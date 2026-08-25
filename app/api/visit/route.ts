import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      sessionId,
      path,
      pageTitle,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      deviceType,
    } = body;

    if (!sessionId || !path) {
      return NextResponse.json(
        { ok: false },
        { status: 400 }
      );
    }

    // 관리자/결제 페이지는 방문 통계에서 제외
    const excludedPaths = [
      "/admin",
      "/api",
      "/checkout",
      "/payment",
    ];

    if (
      excludedPaths.some((excluded) =>
        path.startsWith(excluded)
      )
    ) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabaseServer
      .from("site_visits")
      .insert({
        session_id: sessionId,
        path,
        page_title: pageTitle || null,
        referrer: referrer || null,

        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        utm_content: utmContent || null,
        utm_term: utmTerm || null,

        device_type: deviceType || null,
      });

    if (error) {
      console.error("Visit insert error:", error);

      return NextResponse.json(
        { ok: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Visit API error:", error);

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}