import type { Metadata } from "next";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSummary from "@/components/ReviewSummary";
import ReviewSection from "@/components/ReviewSection";
import MetaViewContent from "@/components/MetaViewContent";
import MetaCheckoutButton from "@/components/MetaCheckoutButton";

export const metadata: Metadata = {
  title: "iKKO MindOne K Pro | 사장님찬스",

  description:
    "iKKO MindOne K Pro 세컨폰. SKT 신규가입·번호이동 가입이 가능한 휴대폰 상품입니다.",

  alternates: {
    canonical:
      "https://sajangchance.com/phone/ikko",
  },

  openGraph: {
    title:
      "iKKO MindOne K Pro | 사장님찬스",

    description:
      "작지만 충분한 세컨폰 iKKO MindOne K Pro. SKT 신규가입·번호이동 가능.",

    url:
      "https://sajangchance.com/phone/ikko",

    siteName:
      "사장님찬스",

    locale:
      "ko_KR",

    type:
      "website",

    images: [
      {
        url:
          "/images/ikko.png",

        width:
          1000,

        height:
          1000,

        alt:
          "iKKO MindOne K Pro",
      },
    ],
  },
};

/*
  VS Code에서 직접 관리하는 상품 정보
*/
const product = {
  product_code:
    "ikko",

  product_type:
    "PHONE",

  name:
    "iKKO MindOne K Pro",

  short_description:
    "메인폰은 두고, 작지만 충분한 세컨폰. SKT 신규가입·번호이동으로 이용할 수 있는 iKKO MindOne K Pro.",

  price:
    298000,

  thumbnail_url:
    "/images/ikko.png",

  badge:
    "세컨폰",

  naver_review_count:
    0,

  naver_review_url:
    null as string | null,
};

const detailImages = [
  "/images/ikko-detail-03.jpg",
  "/images/ikko-detail-04.jpg",
  "/images/ikko-detail-05.jpg",
  "/images/ikko-detail-06.jpg",
  "/images/ikko-detail-01.jpg",
  "/images/ikko-detail-02.jpg",
];

export default function IkkoPage() {
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
              className="object-contain"
            />
          </div>

          {/* 상품 정보 */}
          <div>
            <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-sm font-bold text-violet-700">
              {product.badge}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              {description}
            </p>

            {/* 리뷰 요약 */}
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
                  SKT 가입 상품
                </span>
              </div>
            </div>

            {/* 상품 특징 */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  세컨폰
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  메인폰과 함께 부담 없이 사용할 수 있는 컴팩트 휴대폰
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  SKT 신규·번호이동
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  SK텔레콤 신규가입 또는 번호이동으로 개통 가능
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  1년 약정
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  약정기간 1년으로 간편하게 이용 가능
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  다양한 요금제
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  미성년자 요금제부터 일반 요금제까지 선택 가능
                </p>
              </div>
            </div>

            {/* 구매 영역 */}
            <form
              action="/checkout/ikko"
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
              SKT 신규가입·번호이동 조건 및 요금제에 대한 자세한
              내용은 상세페이지 또는 상담을 통해 확인해주세요.
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

      {/* 하단 상담 */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center md:py-16">

          <p className="text-sm font-bold text-violet-600">
            {product.name}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            가볍게 사용할 세컨폰을 찾고 계신가요?
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            SKT 신규가입·번호이동, 요금제 및 개통 조건은
            카카오톡을 통해 자세히 안내해드립니다.
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