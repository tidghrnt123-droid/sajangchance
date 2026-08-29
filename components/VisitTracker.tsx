"use client";

import { useEffect } from "react";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

const SESSION_KEY =
  "sajangchance_visit_id";

const ATTRIBUTION_KEY =
  "sajangchance_attribution";

type AttributionData = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
};

function getSessionId() {
  let id =
    sessionStorage.getItem(
      SESSION_KEY
    );

  if (!id) {
    id = crypto.randomUUID();

    sessionStorage.setItem(
      SESSION_KEY,
      id
    );
  }

  return id;
}

function getDeviceType() {
  const width =
    window.innerWidth;

  if (width < 768) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
}

function getStoredAttribution():
  | AttributionData
  | null {
  try {
    const raw =
      sessionStorage.getItem(
        ATTRIBUTION_KEY
      );

    if (!raw) {
      return null;
    }

    return JSON.parse(
      raw
    ) as AttributionData;
  } catch {
    return null;
  }
}

function saveAttribution(
  data: AttributionData
) {
  try {
    sessionStorage.setItem(
      ATTRIBUTION_KEY,
      JSON.stringify(data)
    );
  } catch {
    // 저장 실패가 사이트 이용을 방해하면 안 됨
  }
}

export default function VisitTracker() {
  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    /*
     * 관리자 / 결제 페이지 제외
     */
    const excludedPaths = [
      "/admin",
      "/checkout",
      "/payment",
    ];

    if (
      excludedPaths.some(
        (path) =>
          pathname.startsWith(
            path
          )
      )
    ) {
      return;
    }

    const sessionId =
      getSessionId();

    /*
     * 현재 URL의 UTM
     */
    const currentAttribution: AttributionData =
      {
        utmSource:
          searchParams.get(
            "utm_source"
          ),

        utmMedium:
          searchParams.get(
            "utm_medium"
          ),

        utmCampaign:
          searchParams.get(
            "utm_campaign"
          ),

        utmContent:
          searchParams.get(
            "utm_content"
          ),

        utmTerm:
          searchParams.get(
            "utm_term"
          ),

        referrer:
          document.referrer ||
          null,
      };

    /*
     * UTM 파라미터가 하나라도 있는지
     */
    const hasCurrentUtm =
      Boolean(
        currentAttribution.utmSource ||
          currentAttribution.utmMedium ||
          currentAttribution.utmCampaign ||
          currentAttribution.utmContent ||
          currentAttribution.utmTerm
      );

    /*
     * 기존 저장된 최초 유입정보
     */
    const storedAttribution =
      getStoredAttribution();

    let attribution:
      AttributionData;

    /*
     * 광고 UTM으로 새로 들어온 경우
     * 해당 UTM을 현재 세션의 유입정보로 저장
     */
    if (hasCurrentUtm) {
      attribution =
        currentAttribution;

      saveAttribution(
        attribution
      );
    } else if (
      storedAttribution
    ) {
      /*
       * 페이지 이동 후 UTM이 사라졌다면
       * 최초 저장된 광고정보 유지
       */
      attribution =
        storedAttribution;
    } else {
      /*
       * UTM 없는 직접 / 자연 유입
       */
      attribution =
        currentAttribution;

      saveAttribution(
        attribution
      );
    }

    const data = {
      sessionId,

      path:
        pathname,

      pageTitle:
        document.title,

      referrer:
        attribution.referrer,

      utmSource:
        attribution.utmSource,

      utmMedium:
        attribution.utmMedium,

      utmCampaign:
        attribution.utmCampaign,

      utmContent:
        attribution.utmContent,

      utmTerm:
        attribution.utmTerm,

      deviceType:
        getDeviceType(),
    };

    fetch(
      "/api/visit",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            data
          ),

        keepalive: true,
      }
    ).catch(() => {
      /*
       * 방문기록 실패가
       * 사이트 이용을 방해하면 안 됨
       */
    });
  }, [
    pathname,
    searchParams,
  ]);

  return null;
}