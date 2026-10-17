import type { Metadata } from "next";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSummary from "@/components/ReviewSummary";
import ReviewSection from "@/components/ReviewSection";
import MetaViewContent from "@/components/MetaViewContent";
import MetaCheckoutButton from "@/components/MetaCheckoutButton";

export const metadata: Metadata = {
  title: "우들 워치 키즈폰 | 사장님찬스",

  description:
    "스마트폰은 너무 이르다고 생각하시는 부모님들에게 딱 좋은 우들 워치 키즈폰. 위치추적과 통화가 가능합니다.",

  alternates: {
    canonical:
      "https://sajangchance.com/phone/kids-watch-phone",
  },

  openGraph: {
    title: "우들 워치 키즈폰 | 사장님찬스",

    description:
      "스마트폰은 아직 이르다고 생각하시는 부모님을 위한 우들 워치 키즈폰. 위치추적과 통화가 가능합니다.",

    url:
      "https://sajangchance.com/phone/kids-watch-phone",

    siteName: "사장님찬스",

    locale: "ko_KR",

    type: "website",

    images: [
      {
        url: "/images/kids-watch-phone.png",
        width: 1312,
        height: 1199,
        alt: "우들 워치 키즈폰",
      },
    ],
  },
};

/*
  VS Code에서 직접 관리하는 상품 정보
  판매가를 바꾸려면 price 숫자만 수정하면 됩니다.
*/
const product = {
  product_code: "kids-watch-phone",
  product_type: "PHONE",
  name: "우들 워치 키즈폰",

  short_description:
    "스마트폰은 너무 이르다고 생각하시는 부모님들에게 딱 좋은 우들 워치 키즈폰. 위치추적, 통화 가능!",

  price: 100,

  thumbnail_url:
    "/images/kids-watch-phone.png",

  badge: "키즈워치폰",

  naver_review_count: 0,

  naver_review_url:
    null as string | null,
};

const detailImages = [
  "/images/kids-phone01.png",
  "/images/kids-phone02.png",
  "/images/kids-phone03.png",
  "/images/kids-phone04.png",
  "/images/kids-phone05.png",
  "/images/kids-phone06.png",
  "/images/kids-phone07.png",
];

export default function KidsWatchPhonePage() {
  const heroImage =
    product.thumbnail_url;

  const description =
    product.short_description;

  const price =
    Number(product.price);

  const priceText =
    `${price.toLocaleString()}원`;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Meta 상품 상세 조회 */}
      <MetaViewContent
        productId={
          product.product_code
        }
        productName={
          product.name
        }
        value={price}
      />

      {/* 상품 상단 영역 */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
          {/* 대표 이미지 */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50">
            <Image
              src={heroImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-5 md:p-9"
            />
          </div>

          {/* 상품 정보 */}
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              {product.badge}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              {description}
            </p>

            {/* 상단 리뷰 요약 */}
            <ReviewSummary
              productCode={
                product.product_code
              }
              href="#reviews"
              naverReviewCount={
                product.naver_review_count
              }
              naverReviewUrl={
                product.naver_review_url ||
                undefined
              }
            />

            {/* 판매가 */}
            <div className="mt-8 border-y border-gray-200 py-6">
              <p className="text-sm font-medium text-gray-500">
                판매가
              </p>

              <div className="mt-1 flex items-end justify-between gap-4">
                <p className="text-4xl font-bold text-gray-900">
                  {priceText}
                </p>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                  SKT 신규가입 혜택
                </span>
              </div>
            </div>

            {/* 상품 특징 */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  스마트폰 대신 워치폰
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  스마트폰은 아직 이르다고 생각하시는 부모님께 추천
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  위치추적 가능
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  보호자 앱을 통해 아이의 위치를 간편하게 확인
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  통화 가능
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  필요할 때 아이와 바로 통화할 수 있는 키즈 워치폰
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  편리한 손목 착용
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  분실 걱정을 줄이고 손목에 편리하게 착용
                </p>
              </div>
            </div>

            {/* 구매 영역 */}
            <form
              action="/checkout/kids-watch-phone"
              method="get"
              className="mt-8"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <MetaCheckoutButton
                  productId={
                    product.product_code
                  }
                  productName={
                    product.name
                  }
                  value={price}
                >
                  {priceText} 구매하기
                </MetaCheckoutButton>

                <a
                  href="https://pf.kakao.com/_xcxhFen/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-base font-bold text-black transition hover:bg-yellow-500"
                >
                  카카오톡 상담
                </a>
              </div>
            </form>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              가입 조건, 요금제, 위치추적 및 통화 기능에 대한
              자세한 내용은 상세페이지 또는 상담을 통해
              확인하실 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 상세페이지 이미지 */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl">
          {detailImages.map(
            (src, index) => (
              <Image
                key={src}
                src={src}
                alt={`${product.name} 상세정보 ${
                  index + 1
                }`}
                width={1000}
                height={2000}
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="block h-auto w-full"
              />
            )
          )}
        </div>
      </section>

      {/* 구매 고객 리뷰 */}
      <ReviewSection
        productCode={
          product.product_code
        }
        naverReviewUrl={
          product.naver_review_url ||
          undefined
        }
      />

      {/* 하단 상담 영역 */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center md:py-16">
          <p className="text-sm font-bold text-blue-600">
            {product.name}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            우리 아이 첫 워치폰을 찾고 계신가요?
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            가입 조건, 요금제, 위치추적과 통화 기능에 대한
            자세한 내용은 카카오톡을 통해 상담받으실 수 있습니다.
          </p>

          <a
            href="https://pf.kakao.com/_xcxhFen/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-7 block max-w-sm rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black transition hover:bg-yellow-500"
          >
            카카오톡 상담
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}