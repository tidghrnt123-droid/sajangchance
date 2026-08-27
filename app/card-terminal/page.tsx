import Header from "@/components/Header";
import Image from "next/image";
import Footer from "@/components/Footer";
import ReviewSummary from "@/components/ReviewSummary";

import type { Metadata } from "next";
import { Check, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "카드단말기 비교 | 사장님찬스",
  description:
    "토스 프론트2, 영수증 프린터, 토스 터미널2, 무선 카드단말기를 한눈에 비교하세요.",
  alternates: {
    canonical: "https://sajangchance.com/card-terminal",
  },
};

const products = [
  {
    code: "front2",
    badge: "카드단말기",
    name: "토스 프론트2",
    description:
      "POS와 연동하여 사용하는 매장용 카드결제 단말기",
    image: "/images/front2.png",
    alt: "토스 프론트2",
    href: "/front2",
    price: "100원",
    naverReviewCount: 98,
    naverReviewUrl:
      "https://smartstore.naver.com/ho__/products/12539725990#REVIEW",
  },
  {
    code: "front2-printer",
    badge: "카드단말기",
    name: "토스 프론트2 + 영수증 프린터",
    description:
      "카페·병원·뷰티샵 등 영수증 출력이 필요한 매장 추천",
    image: "/images/front2-printer.png",
    alt: "토스 프론트2 + 영수증 프린터",
    href: "/front2-printer",
    price: "1,000원",
    naverReviewCount: 9,
    naverReviewUrl:
      "https://smartstore.naver.com/ho__/products/12617688944#REVIEW",
  },
  {
    code: "front2-terminal2",
    badge: "카드단말기",
    name: "토스 프론트2 + 토스 터미널2",
    description:
      "영수증 출력과 금액 입력 결제가 가능한 토스 프리미엄 구성",
    image: "/images/front2-terminal2.png",
    alt: "토스 프론트2 + 토스 터미널2",
    href: "/front2-terminal2",
    price: "139,000원",
    naverReviewCount: 9,
    naverReviewUrl:
      "https://smartstore.naver.com/ho__/products/12553296407#REVIEW",
  },
  {
    code: "wireless",
    badge: "무선단말기",
    name: "무선 카드단말기",
    description:
      "KT·SK LTE 통신으로 전국 어디서나 사용할 수 있는 무선 단말기",
    image: "/images/wireless.png",
    alt: "무선 카드단말기",
    href: "/wireless",
    price: "100원",
    naverReviewCount: 77,
    naverReviewUrl:
      "https://smartstore.naver.com/ho__/products/12940013683#REVIEW",
  },
];

export default function CardTerminalPage() {
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
            className="hidden rounded-[28px] border-2 border-blue-600 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg lg:block"
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

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <article
              key={product.code}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* 대표 이미지 */}
              <a
                href={product.href}
                className="block"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.alt}
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
                <div>
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {product.badge}
                  </span>
                </div>

                {/* 상품명 */}
                <a
                  href={product.href}
                  className="mt-4 block"
                >
                  <h3 className="text-xl font-bold leading-snug text-gray-900">
                    {product.name}
                  </h3>
                </a>

                {/* 설명 */}
                <p className="mt-3 min-h-[52px] text-sm leading-6 text-gray-500">
                  {product.description}
                </p>

                {/* 리뷰 */}
                <div className="mt-4">
                  <ReviewSummary
                    productCode={product.code}
                    href={`${product.href}#reviews`}
                    naverReviewCount={
                      product.naverReviewCount
                    }
                    naverReviewUrl={
                      product.naverReviewUrl
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
                      {product.price}
                    </p>
                  </div>

                  <a
                    href={product.href}
                    className="shrink-0 text-sm font-bold text-blue-600 transition hover:text-blue-700"
                  >
                    자세히 보기 →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}