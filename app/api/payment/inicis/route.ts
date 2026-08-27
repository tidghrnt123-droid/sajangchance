import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createInicisOrderId } from "@/lib/inicis/hash";
import { createInicisPayment } from "@/lib/inicis/payment";

import {
  products,
  type ProductCode,
} from "@/lib/products";

import type {
  InicisDeviceType,
  InicisPaymentType,
} from "@/lib/inicis/types";

export const runtime = "nodejs";

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
  return (
    value === "WEB" ||
    value === "MOBILE"
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const productCode = getString(
      body.productCode
    ) as ProductCode;

    const buyerName = getString(
      body.buyerName
    );

    const buyerPhone = getString(
      body.buyerPhone
    );

    const buyerEmail = getString(
      body.buyerEmail
    );

    const businessName = getString(
      body.businessName
    );

    const requestNote = getString(
      body.requestNote
    );

    const requestedPaymentType =
      getString(body.paymentType);

    const requestedDeviceType =
      getString(body.deviceType);

    const paymentType: InicisPaymentType =
      isPaymentType(
        requestedPaymentType
      )
        ? requestedPaymentType
        : "CARD";

    const deviceType: InicisDeviceType =
      isDeviceType(
        requestedDeviceType
      )
        ? requestedDeviceType
        : "WEB";

    const product =
      products[productCode];

    /*
     * 상품 검증
     */
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "유효하지 않은 상품입니다.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 구매자 검증
     */
    if (!buyerName) {
      return NextResponse.json(
        {
          success: false,
          message:
            "구매자명을 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    if (!buyerPhone) {
      return NextResponse.json(
        {
          success: false,
          message:
            "연락처를 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    const orderId =
      createInicisOrderId();

    const isEscrow =
      paymentType === "BANK" ||
      paymentType === "VBANK";

    /*
     * Supabase 주문 저장
     */
    const {
      error: orderInsertError,
    } = await supabaseAdmin
      .from("orders")
      .insert({
        order_no: orderId,

        buyer_name: buyerName,

        buyer_phone: buyerPhone,

        buyer_email:
          buyerEmail || null,

        business_name:
          businessName || null,

        delivery_address: null,

        request_note:
          requestNote || null,

        product_code:
          productCode,

        product_name:
          product.name,

        amount:
          product.price,

        product_type:
          product.productType,

        /*
         * 가입유형은 더 이상
         * 결제 단계에서 받지 않음
         */
        activation_type: null,
        previous_carrier: null,

        payment_status:
          "PENDING",

        payment_method:
          paymentType,

        is_escrow:
          isEscrow,
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
        {
          status: 500,
        }
      );
    }

    /*
     * KG이니시스 결제 준비
     */
    const payment =
      createInicisPayment({
        orderId,

        amount:
          product.price,

        goodsName:
          product.name,

        buyerName,

        buyerEmail,

        buyerTel:
          buyerPhone,

        deviceType,

        paymentType,
      });

    /*
     * 확인용 로그
     */
    console.log(
      "INICIS PAYMENT CHECK:",
      {
        orderId,

        productCode,

        productType:
          product.productType,

        paymentType,

        deviceType,

        isEscrow,

        P_PAY_TYPE:
          payment.fields.P_PAY_TYPE,

        P_RESERVED:
          payment.fields.P_RESERVED,
      }
    );

    return NextResponse.json({
      success: true,

      scriptUrl:
        payment.scriptUrl,

      fields:
        payment.fields,
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
      {
        status: 500,
      }
    );
  }
}