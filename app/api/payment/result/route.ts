import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sajangchance.com";

  try {
    const apiKey = process.env.KOVAN_API_KEY;

    if (!apiKey) {
      return NextResponse.redirect(
        `${siteUrl}/payment/fail?message=${encodeURIComponent(
          "결제 환경변수가 설정되지 않았습니다."
        )}`,
        303
      );
    }

    const formData = await request.formData();

    const resultCode = String(formData.get("RESULT_CODE") ?? "");
    const resultMessage = String(formData.get("RESULT_MSG") ?? "");
    const tid = String(formData.get("TID") ?? "");
    const orderno = String(formData.get("ORDERNO") ?? "");
    const receivedHash = String(formData.get("CHECK_HASH") ?? "");

    if (!orderno) {
      return NextResponse.redirect(
        `${siteUrl}/payment/fail?message=${encodeURIComponent(
          "주문번호가 전달되지 않았습니다."
        )}`,
        303
      );
    }

    const hashMessage = `${resultCode}${tid}${orderno}`;

    const expectedHash = crypto
      .createHmac("sha256", apiKey)
      .update(hashMessage, "utf8")
      .digest("base64");

    const receivedBuffer = Buffer.from(receivedHash, "utf8");
    const expectedBuffer = Buffer.from(expectedHash, "utf8");

    const hashValid =
      receivedHash.length > 0 &&
      receivedBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

    if (!hashValid) {
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "FAILED",
          result_code: "HASH_ERROR",
          result_message: "결제 결과 검증 실패",
          updated_at: new Date().toISOString(),
        })
        .eq("order_no", orderno);

      if (updateError) {
        console.error("Supabase hash error update failed:", updateError);
      }

      return NextResponse.redirect(
        `${siteUrl}/payment/fail?order=${encodeURIComponent(
          orderno
        )}&message=${encodeURIComponent("결제 결과 검증에 실패했습니다.")}`,
        303
      );
    }

    const success =
      resultCode === "EC0000" ||
      resultCode === "0000" ||
      resultCode === "00";

    if (!success) {
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          tid: tid || null,
          payment_status: "FAILED",
          result_code: resultCode || null,
          result_message: resultMessage || null,
          updated_at: new Date().toISOString(),
        })
        .eq("order_no", orderno);

      if (updateError) {
        console.error("Supabase failed payment update error:", updateError);
      }

      return NextResponse.redirect(
        `${siteUrl}/payment/fail?order=${encodeURIComponent(
          orderno
        )}&code=${encodeURIComponent(
          resultCode
        )}&message=${encodeURIComponent(resultMessage)}`,
        303
      );
    }

    const now = new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        tid: tid || null,
        payment_status: "PAID",
        result_code: resultCode,
        result_message: resultMessage || null,
        approved_at: now,
        updated_at: now,
      })
      .eq("order_no", orderno);

    if (updateError) {
      console.error("Supabase paid payment update error:", updateError);

      return NextResponse.redirect(
        `${siteUrl}/payment/fail?order=${encodeURIComponent(
          orderno
        )}&message=${encodeURIComponent(
          "결제는 승인됐지만 주문정보 저장에 실패했습니다."
        )}`,
        303
      );
    }

    return NextResponse.redirect(
      `${siteUrl}/payment/success?order=${encodeURIComponent(
        orderno
      )}&tid=${encodeURIComponent(tid)}`,
      303
    );
  } catch (error) {
    console.error("KOVAN payment result error:", error);

    return NextResponse.redirect(
      `${siteUrl}/payment/fail?message=${encodeURIComponent(
        "결제 결과 처리 중 오류가 발생했습니다."
      )}`,
      303
    );
  }
}