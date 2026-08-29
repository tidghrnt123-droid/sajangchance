"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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

function getAttribution():
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

function getProductCode(
  pathname: string
) {
  /*
   * 기존 휴대폰
   */
  if (
    pathname.startsWith(
      "/phone/"
    )
  ) {
    return (
      pathname
        .split("/")
        .filter(Boolean)[1] ||
      null
    );
  }

  /*
   * 관리자에서 새로 등록한
   * 공통 상품 상세페이지
   */
  if (
    pathname.startsWith(
      "/product/"
    )
  ) {
    return (
      pathname
        .split("/")
        .filter(Boolean)[1] ||
      null
    );
  }

  /*
   * 기존 카드단말기
   */
  const terminalProducts: Record<
    string,
    string
  > = {
    "/front2":
      "front2",

    "/front2-printer":
      "front2-printer",

    "/front2-terminal2":
      "front2-terminal2",

    "/wireless":
      "wireless",
  };

  return (
    terminalProducts[
      pathname
    ] || null
  );
}

export default function ConversionTracker() {
  const pathname =
    usePathname();

  useEffect(() => {
    function handleClick(
      event: MouseEvent
    ) {
      const target =
        event.target as HTMLElement;

      const link =
        target.closest(
          "a"
        ) as HTMLAnchorElement | null;

      if (!link) {
        return;
      }

      const href =
        link.getAttribute(
          "href"
        ) || "";

      let eventType:
        | "phone_click"
        | "kakao_click"
        | null = null;

      /*
       * 전화 클릭
       */
      if (
        href.startsWith(
          "tel:"
        )
      ) {
        eventType =
          "phone_click";
      }

      /*
       * 카카오 상담 클릭
       */
      if (
        href.includes(
          "pf.kakao.com"
        )
      ) {
        eventType =
          "kakao_click";
      }

      if (!eventType) {
        return;
      }

      const attribution =
        getAttribution();

      const data = {
        sessionId:
          getSessionId(),

        eventType,

        path:
          pathname,

        pageTitle:
          document.title,

        productCode:
          getProductCode(
            pathname
          ),

        referrer:
          attribution?.referrer ||
          document.referrer ||
          null,

        utmSource:
          attribution?.utmSource ||
          null,

        utmMedium:
          attribution?.utmMedium ||
          null,

        utmCampaign:
          attribution?.utmCampaign ||
          null,

        utmContent:
          attribution?.utmContent ||
          null,

        utmTerm:
          attribution?.utmTerm ||
          null,

        deviceType:
          getDeviceType(),
      };

      fetch(
        "/api/conversion",
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
         * 추적 실패 때문에
         * 전화/카카오 이동을
         * 막으면 안 됨
         */
      });
    }

    document.addEventListener(
      "click",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClick
      );
    };
  }, [pathname]);

  return null;
}