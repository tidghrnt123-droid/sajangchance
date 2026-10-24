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

/*
  VS Code에서 직접 관리하는 상품
*/
const localProducts = {
  /*
    우들 워치 키즈폰
  */
  "kids-watch-phone": {
    product_code:
      "kids-watch-phone",

    product_type:
      "PHONE",

    category:
      "PHONE",

    name:
      "우들 워치 키즈폰",

    short_description:
      "스마트폰은 너무 이르다고 생각하시는 부모님들에게 딱 좋은 우들 워치 키즈폰. 위치추적, 통화 가능!",

    price:
      100,

    thumbnail_url:
      "/images/kids-watch-phone.png",

    detail_path:
      "/phone/kids-watch-phone",

    badge:
      "키즈워치폰",

    naver_review_count:
      3,

    naver_review_url:
      "https://smartstore.naver.com/ho__/products/13792407790",

    is_visible:
      true,

    is_featured:
      false,

    sort_order:
      998,
  },

  /*
    iKKO MindOne K Pro
  */
  ikko: {
    product_code:
      "ikko",

    product_type:
      "PHONE",

    category:
      "PHONE",

    name:
      "iKKO MindOne K Pro",

    short_description:
      "작지만 충분한 세컨폰. SKT 신규가입·번호이동으로 이용할 수 있는 iKKO MindOne K Pro.",

    price:
      298000,

    thumbnail_url:
      "/images/ikko.png",

    detail_path:
      "/phone/ikko",

    badge:
      "세컨폰",

    naver_review_count:
      0,

    naver_review_url:
      null,

    is_visible:
      true,

    is_featured:
      false,

    sort_order:
      999,
  },
};

export async function GET(
  _request: NextRequest,
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

    const normalizedProductCode =
      productCode
        .trim()
        .toLowerCase();

    /*
      먼저 VS Code 상품 확인
    */
    const localProduct =
      localProducts[
        normalizedProductCode as keyof typeof localProducts
      ];

    if (
      localProduct &&
      localProduct.is_visible
    ) {
      return NextResponse.json({
        success: true,
        product: localProduct,
      });
    }

    /*
      나머지 기존 상품은 Supabase에서 조회
    */
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
        normalizedProductCode
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