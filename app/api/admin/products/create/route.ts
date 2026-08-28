import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore
      .get(getAdminSessionCookieName())
      ?.value;

    if (!verifyAdminSessionToken(sessionToken)) {
      return NextResponse.json(
        {
          success: false,
          message: "관리자 로그인이 필요합니다.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productCode = getString(body.productCode)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-");

    const productType =
      getString(body.productType) === "PHONE"
        ? "PHONE"
        : "TERMINAL";

    const category =
      productType === "PHONE"
        ? "PHONE"
        : "CARD_TERMINAL";

    const name = getString(body.name);
    const shortDescription = getString(body.shortDescription);
    const badge = getString(body.badge);
    const thumbnailUrl = getString(body.thumbnailUrl);
    const price = getNumber(body.price);
    const sortOrder = getNumber(body.sortOrder);
    const naverReviewCount = getNumber(body.naverReviewCount);
    const naverReviewUrl = getString(body.naverReviewUrl);
    const isVisible = body.isVisible !== false;
    const isFeatured = body.isFeatured === true;

    const detailImages = Array.isArray(body.detailImages)
      ? body.detailImages
          .map((item: unknown) => getString(item))
          .filter(Boolean)
      : [];

    if (!productCode || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "상품코드와 상품명은 필수입니다.",
        },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "판매가는 0원 이상이어야 합니다.",
        },
        { status: 400 }
      );
    }

    const detailPath = `/product/${productCode}`;

    const {
      data: existing,
      error: existingError,
    } = await supabaseAdmin
      .from("products")
      .select("product_code")
      .eq("product_code", productCode)
      .maybeSingle();

    if (existingError) {
      console.error("Product duplicate check error:", existingError);

      return NextResponse.json(
        {
          success: false,
          message: "상품 중복 확인 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "이미 사용 중인 상품코드입니다.",
        },
        { status: 409 }
      );
    }

    const {
      error: insertError,
    } = await supabaseAdmin
      .from("products")
      .insert({
        product_code: productCode,
        product_type: productType,
        category,
        name,
        short_description: shortDescription || null,
        price,
        thumbnail_url: thumbnailUrl || null,
        detail_path: detailPath,
        badge: badge || null,
        features: [],
        naver_review_count: naverReviewCount,
        naver_review_url: naverReviewUrl || null,
        is_visible: isVisible,
        is_featured: isFeatured,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Product insert error:", insertError);

      return NextResponse.json(
        {
          success: false,
          message: "상품 등록 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    if (detailImages.length > 0) {
      const imageRows = detailImages.map(
        (imageUrl: string, index: number) => ({
          product_code: productCode,
          image_url: imageUrl,
          image_type: "detail",
          sort_order: index + 1,
        })
      );

      const {
        error: imageInsertError,
      } = await supabaseAdmin
        .from("product_images")
        .insert(imageRows);

      if (imageInsertError) {
        console.error(
          "Product detail image insert error:",
          imageInsertError
        );

        await supabaseAdmin
          .from("products")
          .delete()
          .eq("product_code", productCode);

        return NextResponse.json(
          {
            success: false,
            message:
              "상세이미지 저장 중 오류가 발생해 상품 등록을 취소했습니다.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      productCode,
      detailPath,
    });
  } catch (error) {
    console.error("Product create API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "상품 등록 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
