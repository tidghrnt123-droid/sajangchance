import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createInicisOrderId } from "@/lib/inicis/hash";
import { createInicisPayment } from "@/lib/inicis/payment";

import type {
  InicisDeviceType,
  InicisPaymentType,
} from "@/lib/inicis/types";

export const runtime = "nodejs";

const products = {
  front2: {
    name: "토스 프론트2",
    amount: 100,
    itemCode: "front2",
  },

  "front2-printer": {
    name: "프론트2 + 영수증 프린터",
    amount: 1000,
    itemCode: "f2printer",
  },

  "front2-terminal2": {
    name: "프론트2 + 토스 터미널2",
    amount: 139000,
    itemCode: "f2terminal",
  },

  wireless: {
    name: "무선 카드단말기",
    amount: 100,
    itemCode: "wireless",
  },
} as const;

type ProductCode = keyof typeof products;

function getString(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function isPaymentType(
  value: string
): value is InicisPaymentType {
  return (
    value === "CARD" ||
    value === "BANK" ||
    value === "VBANK"
  );
}

function isDeviceType(
  value: string
): value is InicisDeviceType {
  return value === "WEB" || value === "MOBILE";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const productCode = getString(
      body.productCode
    ) as ProductCode;

    const buyerName = getString(body.buyerName);
    const buyerPhone = getString(body.buyerPhone);
    const buyerEmail = getString(body.buyerEmail);
    const businessName = getString(
      body.businessName
    );

    const requestNote = getString(
      body.requestNote
    );

    const requestedPaymentType = getString(
      body.paymentType
    );

    const requestedDeviceType = getString(
      body.deviceType
    );

    const paymentType: InicisPaymentType =
      isPaymentType(requestedPaymentType)
        ? requestedPaymentType
        : "CARD";

    const deviceType: InicisDeviceType =
      isDeviceType(requestedDeviceType)
        ? requestedDeviceType
        : "WEB";

    const product = products[productCode];

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "유효하지 않은 상품입니다.",
        },
        { status: 400 }
      );
    }

    if (!buyerName) {
      return NextResponse.json(
        {
          success: false,
          message: "구매자명을 입력해주세요.",
        },
        { status: 400 }
      );
    }

    if (!buyerPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "연락처를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const orderId = createInicisOrderId();

    const isEscrow =
      paymentType === "BANK" ||
      paymentType === "VBANK";

    const { error: orderInsertError } =
      await supabaseAdmin
        .from("orders")
        .insert({
          order_no: orderId,

          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          buyer_email: buyerEmail || null,
          business_name: businessName || null,

          delivery_address: null,
          request_note: requestNote || null,

          product_code: productCode,
          product_name: product.name,
          amount: product.amount,

          payment_status: "PENDING",

          payment_method: paymentType,
          is_escrow: isEscrow,
        });

    if (orderInsertError) {
      console.error(
        "Supabase order insert error:",
        orderInsertError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "주문정보 저장 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    const payment = createInicisPayment({
      orderId,
      amount: product.amount,
      goodsName: product.name,

      buyerName,
      buyerEmail,
      buyerTel: buyerPhone,

      deviceType,
      paymentType,
    });

    /*
     * 에스크로 요청값 임시 확인용 로그
     * 정상 확인 후 삭제해도 됩니다.
     */
    console.log("INICIS PAYMENT CHECK:", {
      paymentType,
      isEscrow,
      P_PAY_TYPE: payment.fields.P_PAY_TYPE,
      P_RESERVED: payment.fields.P_RESERVED,
    });

    return NextResponse.json({
      success: true,
      scriptUrl: payment.scriptUrl,
      fields: payment.fields,
    });
  } catch (error) {
    console.error(
      "INICIS payment ready error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "결제 준비 중 오류가 발생했습니다.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}