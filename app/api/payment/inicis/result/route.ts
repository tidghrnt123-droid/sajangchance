import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getInicisConfig } from "@/lib/inicis/config";
import { approveInicisPayment } from "@/lib/inicis/approve";
import { sendOrderPaidNotification } from "@/lib/orderNotification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getFormValue(
  formData: FormData,
  key: string
): string {
  return String(formData.get(key) ?? "").trim();
}

function createRedirectUrl(
  baseUrl: string,
  path: string,
  params: Record<string, string | undefined>
): URL {
  const url = new URL(path, baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

async function updateFailedOrder({
  orderId,
  tid,
  resultCode,
  resultMessage,
}: {
  orderId: string;
  tid?: string;
  resultCode: string;
  resultMessage: string;
}) {
  if (!orderId) {
    return;
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      tid: tid || null,
      payment_status: "FAILED",
      result_code: resultCode,
      result_message: resultMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("order_no", orderId);

  if (error) {
    console.error(
      "INICIS failed order update error:",
      error
    );
  }
}

export async function POST(request: NextRequest) {
  const config = getInicisConfig();
  const siteUrl = config.siteUrl;

  try {
    const formData = await request.formData();

    const status = getFormValue(formData, "P_STATUS");
    const resultMessage =
      getFormValue(formData, "P_RMESG") ||
      getFormValue(formData, "P_MESG");

    const receivedMid = getFormValue(formData, "P_MID");
    const authTid = getFormValue(formData, "P_AUTH_TID");
    const amount = getFormValue(formData, "P_AMT");
    const idcName = getFormValue(formData, "P_IDCNAME");

    console.log(
      "INICIS AUTH RESULT:",
      Object.fromEntries(formData.entries())
    );

    const orderId =
      getFormValue(formData, "P_OID") ||
      getFormValue(formData, "P_NOTI") ||
      request.nextUrl.searchParams.get("order")?.trim() ||
      "";

    if (!orderId) {
      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/fail",
          {
            message: "주문번호가 전달되지 않았습니다.",
          }
        ),
        303
      );
    }

    if (status !== "00") {
      await updateFailedOrder({
        orderId,
        resultCode: status || "AUTH_FAILED",
        resultMessage:
          resultMessage || "결제 인증에 실패했습니다.",
      });

      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/fail",
          {
            order: orderId,
            code: status || "AUTH_FAILED",
            message:
              resultMessage ||
              "결제 인증에 실패했습니다.",
          }
        ),
        303
      );
    }

    if (!receivedMid || receivedMid !== config.mid) {
      await updateFailedOrder({
        orderId,
        resultCode: "MID_MISMATCH",
        resultMessage:
          "결제 가맹점 정보가 일치하지 않습니다.",
      });

      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/fail",
          {
            order: orderId,
            code: "MID_MISMATCH",
            message:
              "결제 가맹점 정보가 일치하지 않습니다.",
          }
        ),
        303
      );
    }

    if (!authTid || !amount || !idcName) {
      await updateFailedOrder({
        orderId,
        resultCode: "AUTH_DATA_MISSING",
        resultMessage:
          "결제 승인에 필요한 인증정보가 누락되었습니다.",
      });

      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/fail",
          {
            order: orderId,
            code: "AUTH_DATA_MISSING",
            message:
              "결제 승인정보가 누락되었습니다.",
          }
        ),
        303
      );
    }

    /*
     * 기존 코드에서 이미 사용하던 컬럼만 조회
     */
    const { data: order, error: orderFindError } =
      await supabaseAdmin
        .from("orders")
        .select(
          "order_no, amount, payment_status, product_name, buyer_name, buyer_phone, buyer_email, business_name"
        )
        .eq("order_no", orderId)
        .maybeSingle();

    if (orderFindError) {
      console.error(
        "INICIS order lookup error:",
        orderFindError
      );

      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/fail",
          {
            order: orderId,
            code: "ORDER_LOOKUP_ERROR",
            message:
              "주문정보 확인 중 오류가 발생했습니다.",
          }
        ),
        303
      );
    }

    if (!order) {
      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/fail",
          {
            order: orderId,
            code: "ORDER_NOT_FOUND",
            message: "주문정보를 찾을 수 없습니다.",
          }
        ),
        303
      );
    }

    if (order.payment_status === "PAID") {
      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/success",
          {
            order: orderId,
          }
        ),
        303
      );
    }

    const storedAmount = String(order.amount);
    const receivedAmount = amount.replace(/,/g, "");

    if (storedAmount !== receivedAmount) {
      await updateFailedOrder({
        orderId,
        resultCode: "AMOUNT_MISMATCH",
        resultMessage:
          "결제 요청금액과 주문금액이 일치하지 않습니다.",
      });

      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/fail",
          {
            order: orderId,
            code: "AMOUNT_MISMATCH",
            message:
              "결제금액 검증에 실패했습니다.",
          }
        ),
        303
      );
    }

    /*
     * 인증 성공 후 KG이니시스 승인 API 호출
     */
    const approval = await approveInicisPayment({
      mid: config.mid,
      authTid,
      amount: receivedAmount,
      idcName,
    });

    const approvalStatus = approval.P_STATUS ?? "";
    const approvalMessage =
      approval.P_RMESG ?? "승인 결과 메시지가 없습니다.";

    const approvalTid =
      approval.P_APPL_TID ||
      approval.P_AUTH_TID ||
      authTid;

    if (approvalStatus !== "00") {
      await updateFailedOrder({
        orderId,
        tid: approvalTid,
        resultCode:
          approvalStatus || "APPROVAL_FAILED",
        resultMessage: approvalMessage,
      });

      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/fail",
          {
            order: orderId,
            code:
              approvalStatus || "APPROVAL_FAILED",
            message: approvalMessage,
          }
        ),
        303
      );
    }

    const now = new Date().toISOString();

    const { error: paidUpdateError } =
      await supabaseAdmin
        .from("orders")
        .update({
          tid: approvalTid,
          payment_status: "PAID",
          result_code: approvalStatus,
          result_message: approvalMessage,
          approved_at: now,
          updated_at: now,
        })
        .eq("order_no", orderId);

    if (paidUpdateError) {
      console.error(
        "CRITICAL: INICIS payment approved but DB update failed:",
        {
          orderId,
          approvalTid,
          error: paidUpdateError,
        }
      );

      return NextResponse.redirect(
        createRedirectUrl(
          siteUrl,
          "/payment/fail",
          {
            order: orderId,
            code: "ORDER_UPDATE_FAILED",
            message:
              "결제는 승인되었으나 주문정보 저장에 실패했습니다. 고객센터로 문의해주세요.",
          }
        ),
        303
      );
    }

    /*
     * 결제 성공 후 관리자 이메일 알림.
     * 현재는 확실히 존재하는 주문정보만 보냅니다.
     * 메일 전송 실패가 결제 성공을 막지 않도록 별도 처리합니다.
     */
    console.log("ORDER NOTIFY START:", {
  orderId,
  hasWebhook: !!process.env.ORDER_NOTIFY_WEBHOOK_URL,
  hasToken: !!process.env.ORDER_NOTIFY_TOKEN,
});

    try {
await sendOrderPaidNotification({
  orderId,
  productName: order.product_name || "상품명 없음",
  amount: Number(order.amount) || 0,
  buyerName: order.buyer_name || "",
  buyerPhone: order.buyer_phone || "",
  buyerEmail: order.buyer_email || null,
  businessName: order.business_name || null,
  paymentMethod: null,
  tid: approvalTid,
      });
    } catch (notificationError) {
      console.error(
        "ORDER PAID notification error:",
        notificationError
      );
    }

    return NextResponse.redirect(
      createRedirectUrl(
        siteUrl,
        "/payment/success",
        {
          order: orderId,
          tid: approvalTid,
        }
      ),
      303
    );
  } catch (error) {
    console.error(
      "INICIS payment result error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "결제 결과 처리 중 오류가 발생했습니다.";

    return NextResponse.redirect(
      createRedirectUrl(
        siteUrl,
        "/payment/fail",
        {
          message,
        }
      ),
      303
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message:
        "KG이니시스 결제 결과를 수신하는 POST 전용 API입니다.",
    },
    { status: 405 }
  );
}
