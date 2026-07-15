import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.KOVAN_API_KEY;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://sajangchance.com";

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

    // KOVAN 응답 해시 검증 규칙:
    // RESULT_CODE + TID + ORDERNO
    const hashMessage = `${resultCode}${tid}${orderno}`;

    const expectedHash = crypto
      .createHmac("sha256", apiKey)
      .update(hashMessage, "utf8")
      .digest("base64");

    const hashValid =
      receivedHash.length > 0 &&
      crypto.timingSafeEqual(
        Buffer.from(receivedHash),
        Buffer.from(expectedHash)
      );

    if (!hashValid) {
      return NextResponse.redirect(
        `${siteUrl}/payment/fail?message=${encodeURIComponent(
          "결제 결과 검증에 실패했습니다."
        )}`,
        303
      );
    }

    const success =
      resultCode === "EC0000" ||
      resultCode === "0000" ||
      resultCode === "00";

    if (!success) {
      return NextResponse.redirect(
        `${siteUrl}/payment/fail?order=${encodeURIComponent(
          orderno
        )}&code=${encodeURIComponent(
          resultCode
        )}&message=${encodeURIComponent(resultMessage)}`,
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

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://sajangchance.com";

    return NextResponse.redirect(
      `${siteUrl}/payment/fail?message=${encodeURIComponent(
        "결제 결과 처리 중 오류가 발생했습니다."
      )}`,
      303
    );
  }
}