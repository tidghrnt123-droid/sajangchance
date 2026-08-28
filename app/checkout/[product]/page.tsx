"use client";

import Script from "next/script";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const INICIS_SCRIPT_URL =
  "https://paypro.inicis.com/std/payment/js/INIPayPro_v2.js";

type PaymentType =
  | "CARD"
  | "BANK"
  | "VBANK";

type CheckoutProduct = {
  product_code: string;
  product_type: string;
  category: string;
  name: string;
  short_description: string | null;
  price: number;
  thumbnail_url: string | null;
  badge: string | null;
  is_visible: boolean;
};

type ProductResponse = {
  success: boolean;
  message?: string;
  product?: CheckoutProduct;
};

type PaymentReadyResponse = {
  success: boolean;
  message?: string;
  scriptUrl?: string;
  fields?: Record<string, string>;
};

declare global {
  interface Window {
    INIPayPro?: {
      requestPayment: (
        params: Record<string, string>
      ) => void;
    };
  }
}

export default function CheckoutProductPage() {
  const params =
    useParams<{
      product: string;
    }>();

  const productCode =
    params.product;

  const [
    selectedProduct,
    setSelectedProduct,
  ] =
    useState<CheckoutProduct | null>(
      null
    );

  const [
    productLoading,
    setProductLoading,
  ] = useState(true);

  const [
    productError,
    setProductError,
  ] = useState("");

  const [buyerName, setBuyerName] =
    useState("");

  const [buyerPhone, setBuyerPhone] =
    useState("");

  const [buyerEmail, setBuyerEmail] =
    useState("");

  const [
    businessName,
    setBusinessName,
  ] = useState("");

  const [
    requestNote,
    setRequestNote,
  ] = useState("");

  const [
    paymentType,
    setPaymentType,
  ] =
    useState<PaymentType>("CARD");

  const [agreed, setAgreed] =
    useState(false);

  const [sdkReady, setSdkReady] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    if (!productCode) {
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      try {
        setProductLoading(true);
        setProductError("");

        const response =
          await fetch(
            `/api/products/${encodeURIComponent(
              productCode
            )}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const data =
          (await response.json()) as ProductResponse;

        if (
          !response.ok ||
          !data.success ||
          !data.product
        ) {
          throw new Error(
            data.message ||
              "상품정보를 불러오지 못했습니다."
          );
        }

        if (!cancelled) {
          setSelectedProduct(
            data.product
          );
        }
      } catch (error) {
        if (!cancelled) {
          setProductError(
            error instanceof Error
              ? error.message
              : "상품정보를 불러오지 못했습니다."
          );
        }
      } finally {
        if (!cancelled) {
          setProductLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productCode]);

  const isPhone =
    selectedProduct?.product_type ===
    "PHONE";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (!selectedProduct) {
      setMessage(
        "상품정보를 다시 확인해주세요."
      );

      return;
    }

    if (!buyerName.trim()) {
      setMessage(
        "구매자명을 입력해주세요."
      );

      return;
    }

    if (!buyerPhone.trim()) {
      setMessage(
        "연락처를 입력해주세요."
      );

      return;
    }

    if (!agreed) {
      setMessage(
        "개인정보 수집 및 이용에 동의해주세요."
      );

      return;
    }

    if (
      !sdkReady ||
      !window.INIPayPro
    ) {
      setMessage(
        "KG이니시스 결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요."
      );

      return;
    }

    try {
      setLoading(true);

      const deviceType =
        window.matchMedia(
          "(max-width: 767px)"
        ).matches
          ? "MOBILE"
          : "WEB";

      const response = await fetch(
        "/api/payment/inicis",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productCode:
              selectedProduct.product_code,

            buyerName,
            buyerPhone,
            buyerEmail,
            businessName,
            requestNote,

            paymentType,
            deviceType,
          }),
        }
      );

      const data =
        (await response.json()) as PaymentReadyResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "결제 준비 과정에서 오류가 발생했습니다."
        );
      }

      if (!data.fields) {
        throw new Error(
          "KG이니시스 결제 요청 정보가 올바르지 않습니다."
        );
      }

      setMessage(
        "KG이니시스 결제창을 여는 중입니다."
      );

      window.INIPayPro.requestPayment(
        data.fields
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "결제 준비 중 오류가 발생했습니다.";

      setMessage(errorMessage);
      setLoading(false);
    }
  }

  if (productLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="font-semibold text-blue-600">
            사장님찬스
          </p>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            상품정보를 불러오는 중입니다.
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            잠시만 기다려주세요.
          </p>
        </section>

        <Footer />
      </main>
    );
  }

  if (
    productError ||
    !selectedProduct
  ) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            상품을 확인할 수 없습니다.
          </h1>

          <p className="mt-4 text-gray-600">
            {productError ||
              "상품 주소를 다시 확인해주세요."}
          </p>

          <a
            href="/"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            홈페이지로 이동
          </a>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <>
      <Script
        src={INICIS_SCRIPT_URL}
        strategy="afterInteractive"
        onLoad={() =>
          setSdkReady(true)
        }
        onReady={() =>
          setSdkReady(true)
        }
        onError={() => {
          setSdkReady(false);

          setMessage(
            "KG이니시스 결제 모듈을 불러오지 못했습니다."
          );
        }}
      />

      <main className="min-h-screen bg-gray-50">
        <Header />

        <section className="mx-auto max-w-4xl px-6 py-12 md:py-20">
          <div className="mb-10">
            <a
              href={
                isPhone
                  ? "/phone"
                  : "/card-terminal"
              }
              className="font-semibold text-blue-600"
            >
              ←{" "}
              {isPhone
                ? "휴대폰 목록으로"
                : "카드단말기 목록으로"}
            </a>

            <p className="mb-3 mt-8 font-semibold text-blue-600">
              사장님찬스 주문서
            </p>

            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              주문 정보를 입력해주세요.
            </h1>

            <p className="mt-4 text-gray-600">
              주문정보 확인 후
              KG이니시스 안전결제
              시스템으로 이동합니다.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10"
          >
            <div className="space-y-8">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <p className="text-sm text-gray-500">
                  결제 상품
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {selectedProduct.name}
                </p>

                <p className="mt-3 text-2xl font-bold text-blue-600">
                  {Number(
                    selectedProduct.price
                  ).toLocaleString()}
                  원
                </p>

                <span
                  className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    isPhone
                      ? "bg-violet-100 text-violet-700"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {isPhone
                    ? "휴대폰"
                    : "카드단말기"}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="buyerName"
                    className="mb-2 block font-semibold text-gray-900"
                  >
                    구매자명{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="buyerName"
                    type="text"
                    value={buyerName}
                    onChange={(event) =>
                      setBuyerName(
                        event.target.value
                      )
                    }
                    placeholder="홍길동"
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="buyerPhone"
                    className="mb-2 block font-semibold text-gray-900"
                  >
                    연락처{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="buyerPhone"
                    type="tel"
                    value={buyerPhone}
                    onChange={(event) =>
                      setBuyerPhone(
                        event.target.value
                      )
                    }
                    placeholder="010-0000-0000"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="buyerEmail"
                    className="mb-2 block font-semibold text-gray-900"
                  >
                    이메일
                  </label>

                  <input
                    id="buyerEmail"
                    type="email"
                    value={buyerEmail}
                    onChange={(event) =>
                      setBuyerEmail(
                        event.target.value
                      )
                    }
                    placeholder="example@email.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-2 block font-semibold text-gray-900"
                  >
                    {isPhone
                      ? "상호명 (법인 주문 시)"
                      : "상호명"}
                  </label>

                  <input
                    id="businessName"
                    type="text"
                    value={businessName}
                    onChange={(event) =>
                      setBusinessName(
                        event.target.value
                      )
                    }
                    placeholder={
                      isPhone
                        ? "법인 주문인 경우 입력해주세요"
                        : "상호명을 입력해주세요"
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 font-semibold text-gray-900">
                  결제수단
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "CARD",
                      label: "신용카드",
                    },
                    {
                      value: "BANK",
                      label: "계좌이체",
                    },
                    {
                      value: "VBANK",
                      label: "가상계좌",
                    },
                  ].map((method) => {
                    const selected =
                      paymentType ===
                      method.value;

                    return (
                      <button
                        key={
                          method.value
                        }
                        type="button"
                        onClick={() =>
                          setPaymentType(
                            method.value as PaymentType
                          )
                        }
                        className={`rounded-xl border px-3 py-4 text-sm font-bold transition ${
                          selected
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        {method.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="requestNote"
                  className="mb-2 block font-semibold text-gray-900"
                >
                  요청사항
                </label>

                <textarea
                  id="requestNote"
                  value={requestNote}
                  onChange={(event) =>
                    setRequestNote(
                      event.target.value
                    )
                  }
                  placeholder={
                    isPhone
                      ? "개통 관련 요청사항이 있다면 입력해주세요."
                      : "설치 일정이나 요청사항을 입력해주세요."
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-gray-50 p-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) =>
                    setAgreed(
                      event.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4"
                />

                <span className="text-sm leading-relaxed text-gray-600">
                  주문 처리와 결제 진행을 위한
                  개인정보 수집 및 이용에
                  동의합니다.{" "}
                  <span className="text-red-500">
                    (필수)
                  </span>
                </span>
              </label>

              {message && (
                <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  !sdkReady
                }
                className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {!sdkReady
                  ? "결제 모듈 불러오는 중..."
                  : loading
                    ? "결제 준비 중..."
                    : `${Number(
                        selectedProduct.price
                      ).toLocaleString()}원 결제하기`}
              </button>

              <p className="text-center text-xs text-gray-500">
                KG이니시스 안전결제
                시스템으로 결제가 진행됩니다.
              </p>
            </div>
          </form>
        </section>

        <Footer />
      </main>
    </>
  );
}
