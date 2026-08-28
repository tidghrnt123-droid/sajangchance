import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{
    product: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteProps
) {
  try {
    const {
      product: productCode,
    } = await params;

    if (!productCode) {
      return NextResponse.json(
        {
          success: false,
          message:
            "상품코드가 없습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("products")
      .select(
        `
          product_code,
          product_type,
          category,
          name,
          short_description,
          price,
          thumbnail_url,
          detail_path,
          badge,
          naver_review_count,
          naver_review_url,
          is_visible,
          is_featured,
          sort_order
        `
      )
      .eq(
        "product_code",
        productCode
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Product load error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "상품정보를 불러오지 못했습니다.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !data ||
      !data.is_visible
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "판매 중인 상품을 찾을 수 없습니다.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      product: data,
    });
  } catch (error) {
    console.error(
      "Product API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "상품정보 조회 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}