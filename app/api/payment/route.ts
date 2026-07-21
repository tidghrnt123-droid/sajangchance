import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const products = {
  front2: {
    name: "토스 프론트2",
    amount: 100,
    itemCode: "front2",
  },
  "front2-printer": {
    name: "프론트2 영수증 프린터",
    amount: 39000,
    itemCode: "f2printer",
  },
  "front2-terminal2": {
    name: "프론트2 토스 터미널2",
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

function getKoreaDateTime() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return {
    orderdt: `${values.year}${values.month}${values.day}`,
    ordertm: `${values.hour}${values.minute}${values.second}`,
  };
}

function createOrderNumber() {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();

  return `SC${timestamp.slice(-12)}${random}`.slice(0, 20);
}

export async function POST(request: NextRequest) {
  try {
    const mid = process.env.KOVAN_MID;
    const apiKey = process.env.KOVAN_API_KEY;
    const baseUrl = process.env.KOVAN_BASE_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!mid || !apiKey || !baseUrl || !siteUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "KOVAN 환경변수가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const productCode = body.productCode as ProductCode;

    const buyerName =
      typeof body.buyerName === "string" ? body.buyerName.trim() : "";

    const buyerPhone =
      typeof body.buyerPhone === "string" ? body.buyerPhone.trim() : "";

    const buyerEmail =
      typeof body.buyerEmail === "string" ? body.buyerEmail.trim() : "";

    const businessName =
      typeof body.businessName === "string"
        ? body.businessName.trim()
        : "";

    const deliveryAddress =
      typeof body.deliveryAddress === "string"
        ? body.deliveryAddress.trim()
        : "";

    const requestNote =
      typeof body.requestNote === "string"
        ? body.requestNote.trim()
        : "";

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

    const orderno = createOrderNumber();
    const { orderdt, ordertm } = getKoreaDateTime();
    const buyReqamt = String(product.amount);

    const { error: orderInsertError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_no: orderno,
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        buyer_email: buyerEmail || null,
        business_name: businessName || null,
        delivery_address: deliveryAddress || null,
        request_note: requestNote || null,
        product_code: productCode,
        product_name: product.name,
        amount: product.amount,
        payment_status: "PENDING",
      });

    if (orderInsertError) {
      console.error("Supabase order insert error:", orderInsertError);

      return NextResponse.json(
        {
          success: false,
          message: "주문 저장 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    const hashMessage = `${orderno}${orderdt}${ordertm}${buyReqamt}`;

    const checkHash = crypto
      .createHmac("sha256", apiKey)
      .update(hashMessage, "utf8")
      .digest("base64");

    return NextResponse.json({
      success: true,
      paymentUrl: `${baseUrl}/paypage/common/mainFrame.pay`,
      fields: {
        mid,
        rUrl: `${siteUrl}/api/payment/result`,
        rMethod: "POST",
        payGroup: "GEP",
        payType: "CC",
        buyItemnm: product.name,
        buyReqamt,
        buyItemcd: product.itemCode,
        buyernm: buyerName,
        buyerEmail,
        orderno,
        orderdt,
        ordertm,
        checkHash,
      },
    });
  } catch (error) {
    console.error("KOVAN payment error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "결제 준비 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}