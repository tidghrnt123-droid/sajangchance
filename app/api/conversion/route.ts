import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type ConversionEventType =
  | "phone_click"
  | "kakao_click"
  | "contact_submit";

function getString(
  value: unknown
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function isEventType(
  value: string
): value is ConversionEventType {
  return (
    value === "phone_click" ||
    value === "kakao_click" ||
    value === "contact_submit"
  );
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const sessionId =
      getString(body.sessionId);

    const eventType =
      getString(body.eventType);

    const path =
      getString(body.path);

    const pageTitle =
      getString(body.pageTitle);

    const productCode =
      getString(body.productCode);

    const referrer =
      getString(body.referrer);

    const utmSource =
      getString(body.utmSource);

    const utmMedium =
      getString(body.utmMedium);

    const utmCampaign =
      getString(body.utmCampaign);

    const utmContent =
      getString(body.utmContent);

    const utmTerm =
      getString(body.utmTerm);

    const deviceType =
      getString(body.deviceType);

    /*
     * 필수값 검증
     */
    if (!sessionId) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "sessionId가 없습니다.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isEventType(
        eventType
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "유효하지 않은 전환 이벤트입니다.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 관리자 / API / 결제 페이지 제외
     */
    const excludedPaths = [
      "/admin",
      "/api",
      "/checkout",
      "/payment",
    ];

    if (
      path &&
      excludedPaths.some(
        (excluded) =>
          path.startsWith(
            excluded
          )
      )
    ) {
      return NextResponse.json({
        ok: true,
      });
    }

    /*
     * Supabase 저장
     */
    const {
      error,
    } =
      await supabaseServer
        .from(
          "conversion_events"
        )
        .insert({
          session_id:
            sessionId,

          event_type:
            eventType,

          path:
            path || null,

          page_title:
            pageTitle || null,

          product_code:
            productCode || null,

          referrer:
            referrer || null,

          utm_source:
            utmSource || null,

          utm_medium:
            utmMedium || null,

          utm_campaign:
            utmCampaign || null,

          utm_content:
            utmContent || null,

          utm_term:
            utmTerm || null,

          device_type:
            deviceType || null,
        });

    if (error) {
      console.error(
        "Conversion insert error:",
        error
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "전환 이벤트 저장 중 오류가 발생했습니다.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "Conversion API error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "전환 이벤트 처리 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}