"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY =
  "sajangchance_visit_id";

const ATTRIBUTION_KEY =
  "sajangchance_attribution";

const CONTACT_SUBMIT_EVENT =
  "sajangchance:contact_submit";

type AttributionData = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
};

type ConversionEventType =
  | "phone_click"
  | "kakao_click"
  | "contact_submit";

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
    function sendConversion(
      eventType: ConversionEventType
    ) {
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
         * 사용자 동작을 막지 않음
         */
      });
    }

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

      /*
       * 전화 클릭
       */
      if (
        href.startsWith(
          "tel:"
        )
      ) {
        sendConversion(
          "phone_click"
        );

        return;
      }

      /*
       * 카카오 상담 클릭
       */
      if (
        href.includes(
          "pf.kakao.com"
        )
      ) {
        sendConversion(
          "kakao_click"
        );
      }
    }

    /*
     * 상담폼 제출 성공 이벤트
     */
    function handleContactSubmit() {
      sendConversion(
        "contact_submit"
      );
    }

    document.addEventListener(
      "click",
      handleClick
    );

    window.addEventListener(
      CONTACT_SUBMIT_EVENT,
      handleContactSubmit
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClick
      );

      window.removeEventListener(
        CONTACT_SUBMIT_EVENT,
        handleContactSubmit
      );
    };
  }, [pathname]);

  return null;
}