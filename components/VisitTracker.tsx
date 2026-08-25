"use client";

import { useEffect } from "react";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

function getSessionId() {
  const key = "sajangchance_visit_id";

  let id = sessionStorage.getItem(key);

  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }

  return id;
}

function getDeviceType() {
  const width = window.innerWidth;

  if (width < 768) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
}

export default function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    // 관리자 등 제외
    const excludedPaths = [
      "/admin",
      "/checkout",
      "/payment",
    ];

    if (
      excludedPaths.some((path) =>
        pathname.startsWith(path)
      )
    ) {
      return;
    }

    const sessionId = getSessionId();

    const data = {
      sessionId,
      path: pathname,
      pageTitle: document.title,
      referrer: document.referrer || null,

      utmSource:
        searchParams.get("utm_source"),

      utmMedium:
        searchParams.get("utm_medium"),

      utmCampaign:
        searchParams.get("utm_campaign"),

      utmContent:
        searchParams.get("utm_content"),

      utmTerm:
        searchParams.get("utm_term"),

      deviceType: getDeviceType(),
    };

    fetch("/api/visit", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),

      keepalive: true,
    }).catch(() => {
      // 방문 기록 실패가 사이트 이용을 방해하면 안 됨
    });
  }, [pathname, searchParams]);

  return null;
}