import type { Metadata } from "next";
import Image from "next/image";
import { Check, Phone } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSummary from "@/components/ReviewSummary";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "휴대폰 | 사장님찬스",

  description:
    "공부폰, 키즈폰, 효도폰, 법인폰 등 다양한 용도의 휴대폰 상품을 사장님찬스에서 확인하세요.",

  alternates: {
    canonical: "https://sajangchance.com/phone",
  },
};

type PhoneProduct = {
  product_code: string;
  product_type: string;
  category: string;
  name: string;
  short_description: string | null;
  price: number;
  thumbnail_url: string | null;
  detail_path: string | null;
  badge: string | null;
  naver_review_count: number;
  naver_review_url: string | null;
  is_visible: boolean;
  sort_order: number;
};

export default async function PhonePage() {
  const { data, error } = await supabaseAdmin
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
        sort_order
      `
    )
    .eq("category", "PHONE")
    .eq("is_visible", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Phone products load error:",
      error
    );
  }

  const dbPhones =
    (data ?? []) as PhoneProduct[];

  /*
    VS Code에서 직접 관리하는 상품
  */
  const localPhones: PhoneProduct[] = [
    {
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

      sort_order:
        998,
    },

    {
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

      sort_order:
        999,
    },
  ];

  /*
    Supabase에 같은 상품이 등록되어 있어도
    중복 노출되지 않도록 처리
  */
  const localOnlyPhones =
    localPhones.filter(
      (localPhone) =>
        !dbPhones.some(
          (dbPhone) =>
            dbPhone.product_code ===
            localPhone.product_code
        )
    );

  const phones = [
    ...dbPhones,
    ...localOnlyPhones,
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* 상단 소개 */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">

          <div>
            <p className="font-semibold text-blue-600">
              사장님찬스 휴대폰
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              용도에 맞는 휴대폰을
              <br className="hidden md:block" />
              간편하게 비교하세요
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              공부폰부터 스마트폰, 효도폰, 키즈 워치폰,
              세컨폰까지 필요한 휴대폰을 확인하고 구매 또는
              상담을 진행할 수 있습니다.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-blue-600 bg-white p-7 shadow-sm md:p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <Phone
                  size={24}
                  strokeWidth={2.4}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  휴대폰 개통 상담
                </p>

                <a
                  href="tel:01081413099"
                  className="mt-1 block text-2xl font-bold tracking-tight text-gray-900 transition hover:text-blue-600"
                >
                  010-8141-3099
                </a>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "휴대폰 개통 전문 상담",
                "가입유형·요금제 안내",
                "빠른 개통 및 출고",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Check
                      size={15}
                      strokeWidth={3}
                    />
                  </span>

                  <span className="text-sm font-semibold text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-6 text-gray-500">
              어떤 휴대폰을 선택해야 할지 고민되시면 전화 한 통으로
              용도에 맞는 상품을 안내해드립니다.
            </p>

            <a
              href="tel:01081413099"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              <Phone
                size={18}
                strokeWidth={2.5}
              />

              전화 상담하기
            </a>
          </div>
        </div>
      </section>

      {/* 상품 목록 */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            휴대폰 상품
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            원하는 상품을 선택하면 상세정보를 확인할 수 있습니다.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            일부 휴대폰 상품정보를 불러오지 못했습니다.
          </div>
        )}

        {phones.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center text-gray-500 shadow-sm">
            현재 판매 중인 휴대폰 상품이 없습니다.
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {phones.map((phone) => {
            const href =
              phone.detail_path ||
              "/phone";

            const image =
              phone.thumbnail_url ||
              "/images/phone-a175-study.png";

            const useContainImage =
              phone.product_code ===
                "kids-watch-phone" ||
              phone.product_code ===
                "ikko";

            return (
              <article
                key={phone.product_code}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <a
                  href={href}
                  className="block"
                >
                  <div
                    className={
                      useContainImage
                        ? "relative aspect-square overflow-hidden bg-white"
                        : "relative aspect-square overflow-hidden bg-gray-100"
                    }
                  >
                    <Image
                      src={image}
                      alt={phone.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className={
                        useContainImage
                          ? "object-contain p-5 transition duration-300 group-hover:scale-[1.03]"
                          : "object-cover transition duration-300 group-hover:scale-[1.03]"
                      }
                    />
                  </div>
                </a>

                <div className="p-5">

                  {phone.badge && (
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {phone.badge}
                    </span>
                  )}

                  <a
                    href={href}
                    className="block"
                  >
                    <h2 className="mt-3 text-xl font-bold text-gray-900 transition hover:text-blue-600">
                      {phone.name}
                    </h2>
                  </a>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                    {phone.short_description ||
                      "상품 상세정보를 확인해보세요."}
                  </p>

                  <ReviewSummary
                    productCode={
                      phone.product_code
                    }
                    href={`${href}#reviews`}
                    naverReviewCount={
                      phone.naver_review_count
                    }
                    naverReviewUrl={
                      phone.naver_review_url ||
                      undefined
                    }
                  />

                  <div className="mt-4 border-t border-gray-100 pt-4">

                    <p className="text-xs font-medium text-gray-400">
                      판매가
                    </p>

                    <div className="mt-1 flex items-end justify-between gap-3">

                      <p className="text-2xl font-bold text-gray-900">
                        {Number(
                          phone.price
                        ).toLocaleString()}
                        원
                      </p>

                      <a
                        href={href}
                        className="shrink-0 text-sm font-bold text-blue-600 transition hover:translate-x-1"
                      >
                        자세히 보기 →
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}