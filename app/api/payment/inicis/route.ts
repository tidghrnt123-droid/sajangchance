import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createInicisOrderId } from "@/lib/inicis/hash";
import { createInicisPayment } from "@/lib/inicis/payment";

import type {
  InicisDeviceType,
  InicisPaymentType,
} from "@/lib/inicis/types";

export const runtime = "nodejs";

type DbProduct = {
  product_code: string;
  product_type: string;
  name: string;
  price: number;
  is_visible: boolean;
};

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
    );

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
      isPaymentType(requestedPaymentType)
        ? requestedPaymentType
        : "CARD";

    const deviceType: InicisDeviceType =
      isDeviceType(requestedDeviceType)
        ? requestedDeviceType
        : "WEB";

    /*
     * ================================
     * 상품코드 검증
     * ================================
     */
    if (!productCode) {
      return NextResponse.json(
        {
          success: false,
          message:
            "상품정보가 올바르지 않습니다.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ================================
     * Supabase 상품 조회
     * 관리자 상품관리의 가격을 사용
     * ================================
     */
    const {
      data: productData,
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .select(
        `
          product_code,
          product_type,
          name,
          price,
          is_visible
        `
      )
      .eq(
        "product_code",
        productCode
      )
      .maybeSingle();

    if (productError) {
      console.error(
        "Supabase product load error:",
        productError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "상품정보를 불러오는 중 오류가 발생했습니다.",
        },
        {
          status: 500,
        }
      );
    }

    const product =
      productData as DbProduct | null;

    /*
     * 상품 존재 여부
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
     * 판매중지 상품 결제 차단
     */
    if (!product.is_visible) {
      return NextResponse.json(
        {
          success: false,
          message:
            "현재 판매하지 않는 상품입니다.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 가격 검증
     */
    const productPrice =
      Number(product.price);

    if (
      !Number.isFinite(productPrice) ||
      productPrice < 0
    ) {
      console.error(
        "Invalid product price:",
        {
          productCode,
          price: product.price,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "상품 가격정보가 올바르지 않습니다.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ================================
     * 구매자 검증
     * ================================
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
     * ================================
     * Supabase 주문 저장
     * ================================
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
          product.product_code,

        product_name:
          product.name,

        amount:
          productPrice,

        product_type:
          product.product_type,

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
     * ================================
     * KG이니시스 결제 준비
     * 반드시 DB 가격 사용
     * ================================
     */
    const payment =
      createInicisPayment({
        orderId,

        amount:
          productPrice,

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
     * 확인 로그
     */
    console.log(
      "INICIS PAYMENT CHECK:",
      {
        orderId,

        productCode:
          product.product_code,

        productName:
          product.name,

        productType:
          product.product_type,

        productPrice,

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