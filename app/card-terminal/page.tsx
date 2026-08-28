import Header from "@/components/Header";
import Image from "next/image";
import Footer from "@/components/Footer";
import ReviewSummary from "@/components/ReviewSummary";

import type { Metadata } from "next";
import { Check, Phone } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "카드단말기 비교 | 사장님찬스",
  description:
    "토스 프론트2, 영수증 프린터, 토스 터미널2, 무선 카드단말기를 한눈에 비교하세요.",
  alternates: {
    canonical: "https://sajangchance.com/card-terminal",
  },
};

type ProductRow = {
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

export default async function CardTerminalPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
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
    .eq("category", "CARD_TERMINAL")
    .eq("is_visible", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Card terminal products load error:",
      error
    );
  }

  const products =
    (data ?? []) as ProductRow[];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* 상단 소개 */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-28 md:px-6 md:pb-14 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-bold text-blue-600 md:text-base">
              카드단말기 비교
            </p>

            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
              매장에 맞는 카드단말기
              <br />
              한 번에 비교하세요.
            </h1>

            <p className="mt-5 text-base leading-7 text-gray-600 md:text-lg">
              토스 프론트2부터 영수증 프린터,
              토스 터미널2, 무선 카드단말기까지
              <br className="hidden md:block" />
              매장 환경에 맞춰 안내드립니다.
            </p>
          </div>

          {/* 상담 카드 */}
          <a
            href="tel:01079083099"
            className="block rounded-[28px] border-2 border-blue-600 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <Phone size={23} />
              </span>

              <div>
                <p className="text-sm font-bold text-blue-600">
                  무료 상담
                </p>

                <p className="text-2xl font-black text-gray-950">
                  010-7908-3099
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {[
                "무료 상담",
                "무료 카드가맹",
                "빠른 출고",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-semibold text-gray-800"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Check
                      size={15}
                      strokeWidth={3}
                    />
                  </span>

                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm leading-relaxed text-gray-500">
              전화 한 통으로 매장에 맞는 단말기를
              추천해드립니다.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white">
              <Phone size={19} />
              전화하기
            </div>
          </a>
        </div>
      </section>

      {/* 카드단말기 상품 */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            카드단말기 상품
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            원하는 상품을 선택하면 상세정보를 확인할 수 있습니다.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            상품정보를 불러오지 못했습니다.
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center text-gray-500 shadow-sm">
            현재 판매 중인 카드단말기가 없습니다.
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => {
            const href =
              product.detail_path ||
              "/card-terminal";

            const image =
              product.thumbnail_url ||
              "/images/front2.png";

            return (
              <article
                key={product.product_code}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* 대표 이미지 */}
                <a
                  href={href}
                  className="block"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-300 hover:scale-[1.02]"
                    />
                  </div>
                </a>

                {/* 상품 정보 */}
                <div className="flex flex-col p-6">
                  {/* 뱃지 */}
                  {product.badge && (
                    <div>
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* 상품명 */}
                  <a
                    href={href}
                    className="mt-4 block"
                  >
                    <h3 className="text-xl font-bold leading-snug text-gray-900">
                      {product.name}
                    </h3>
                  </a>

                  {/* 설명 */}
                  <p className="mt-3 min-h-[52px] text-sm leading-6 text-gray-500">
                    {product.short_description ||
                      "상품 상세정보를 확인해보세요."}
                  </p>

                  {/* 리뷰 */}
                  <div className="mt-4">
                    <ReviewSummary
                      productCode={
                        product.product_code
                      }
                      href={`${href}#reviews`}
                      naverReviewCount={
                        product.naver_review_count
                      }
                      naverReviewUrl={
                        product.naver_review_url ||
                        undefined
                      }
                    />
                  </div>

                  {/* 가격 */}
                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-gray-100 pt-5">
                    <div>
                      <p className="text-xs text-gray-400">
                        판매가
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        {Number(
                          product.price
                        ).toLocaleString()}
                        원
                      </p>
                    </div>

                    <a
                      href={href}
                      className="shrink-0 text-sm font-bold text-blue-600 transition hover:text-blue-700"
                    >
                      자세히 보기 →
                    </a>
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
