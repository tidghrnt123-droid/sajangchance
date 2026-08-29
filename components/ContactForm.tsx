"use client";

import { useState } from "react";

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
   * 휴대폰 상세페이지
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
   * 관리자에서 등록한
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

export default function ContactForm() {
  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    products,
    setProducts,
  ] =
    useState<string[]>([]);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [
    isDone,
    setIsDone,
  ] =
    useState(false);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwPMLZtXEIMJ4k7VcaDhSPETBtaFaT_iGuKAgj38MzS3gbAGhbGAnjyjkCKq_LrzUcR/exec";

  const productOptions = [
    "카드단말기",
    "휴대폰",
    "인터넷",
    "CCTV",
  ];

  function toggleProduct(
    value: string
  ) {
    if (
      products.includes(
        value
      )
    ) {
      setProducts(
        products.filter(
          (item) =>
            item !== value
        )
      );
    } else {
      setProducts([
        ...products,
        value,
      ]);
    }
  }

  /*
   * ================================
   * 상담폼 전환 기록
   * ================================
   */
  async function trackContactSubmit() {
    try {
      const attribution =
        getAttribution();

      const pathname =
        window.location.pathname;

      await fetch(
        "/api/conversion",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              sessionId:
                getSessionId(),

              eventType:
                "contact_submit",

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
            }),

          keepalive:
            true,
        }
      );
    } catch (error) {
      /*
       * 전환 추적 실패가
       * 실제 상담 접수를 방해하면 안 됨
       */
      console.error(
        "Contact conversion tracking error:",
        error
      );
    }
  }

  async function submitContact() {
    if (
      !name.trim() ||
      !phone.trim()
    ) {
      alert(
        "성함과 연락처를 입력해주세요."
      );

      return;
    }

    setIsSubmitting(true);

    const params =
      new URLSearchParams();

    params.append(
      "name",
      name
    );

    params.append(
      "phone",
      phone
    );

    params.append(
      "product",
      products.join(", ")
    );

    params.append(
      "message",
      message
    );

    params.append(
      "pageUrl",
      window.location.href
    );

    params.append(
      "ua",
      navigator.userAgent
    );

    try {
      /*
       * 기존 구글 상담폼 전송
       */
      await fetch(
        SCRIPT_URL,
        {
          method: "POST",

          mode: "no-cors",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded;charset=UTF-8",
          },

          body:
            params.toString(),
        }
      );

      /*
       * 상담폼 제출 전환 +1
       */
      await trackContactSubmit();

      setIsDone(true);

      setName("");

      setPhone("");

      setProducts([]);

      setMessage("");

      alert(
        "상담 신청이 접수되었습니다."
      );
    } catch (error) {
      console.error(
        "Contact form submit error:",
        error
      );

      alert(
        "접수 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(
        false
      );
    }
  }

  return (
    <section
      id="contact"
      className="mx-auto max-w-5xl px-6 py-24"
    >
      <div className="rounded-[32px] border border-gray-200 bg-white p-10 shadow-sm">
        {/* 상단 */}
        <div className="mb-10 text-center">
          <p className="mb-3 font-semibold text-blue-600">
            사장님 맞춤 상담
          </p>

          <h2 className="text-4xl font-bold">
            무료 상담 신청
          </h2>

          <p className="mt-4 text-gray-500">
            사장님찬스 전문 상담사가
            <br />
            직접 안내드립니다.
          </p>
        </div>

        {/* 접수 완료 */}
        {isDone && (
          <div className="mb-6 rounded-2xl bg-blue-50 p-5 text-center font-semibold text-blue-700">
            상담 신청이
            접수되었습니다.
            순차적으로
            연락드리겠습니다.
          </div>
        )}

        {/* 성함 / 연락처 */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              성함
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              type="text"
              placeholder="성함을 입력해주세요"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              연락처
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              type="tel"
              placeholder="010-0000-0000"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
        </div>

        {/* 관심 상품 */}
        <div className="mt-6">
          <label className="mb-3 block font-medium">
            관심 상품
          </label>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {productOptions.map(
              (product) => {
                const checked =
                  products.includes(
                    product
                  );

                return (
                  <label
                    key={
                      product
                    }
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                      checked
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        checked
                      }
                      onChange={() =>
                        toggleProduct(
                          product
                        )
                      }
                      className="h-4 w-4"
                    />

                    <span className="font-medium">
                      {product}
                    </span>
                  </label>
                );
              }
            )}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            여러 상품을 함께
            선택하실 수 있습니다.
          </p>
        </div>

        {/* 문의 내용 */}
        <div className="mt-6">
          <label className="mb-2 block font-medium">
            문의내용 (선택)
          </label>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            rows={5}
            placeholder="문의사항을 입력해주세요."
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        {/* 접수 버튼 */}
        <button
          type="button"
          onClick={
            submitContact
          }
          disabled={
            isSubmitting
          }
          className="mt-8 w-full cursor-pointer rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting
            ? "접수 중..."
            : "무료 상담 신청하기"}
        </button>

        {/* 하단 안내 */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span>
            ✓ 상담 비용 없음
          </span>

          <span>
            ✓ 비교 후 결정 가능
          </span>

          <span>
            ✓ 전문 상담 가능
          </span>
        </div>
      </div>
    </section>
  );
}