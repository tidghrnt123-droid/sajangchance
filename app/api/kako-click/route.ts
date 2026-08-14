import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      pageName,
      pathname,
      pageUrl,
      clickedAt,
    } = body;

    if (!pathname) {
      return NextResponse.json(
        {
          success: false,
          message: "pathname이 없습니다.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("kakao_clicks")
      .insert({
        page_name: pageName || "알 수 없는 페이지",
        pathname,
        page_url: pageUrl || "",
        clicked_at: clickedAt || new Date().toISOString(),
      });

    if (error) {
      console.error("카카오 클릭 저장 오류:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("카카오 클릭 API 오류:", error);

    return NextResponse.json(
      {
        success: false,
        message: "카카오 클릭 기록 저장 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}