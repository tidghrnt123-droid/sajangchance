import type { Metadata } from "next";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import ReviewSummary from "@/components/ReviewSummary";
import MetaViewContent from "@/components/MetaViewContent";
import MetaCheckoutButton from "@/components/MetaCheckoutButton";
import MetaLeadLink from "@/components/MetaLeadLink";

export const metadata: Metadata = {
  title: "갤럭시 A175 공부폰 | 사장님찬스",
  description:
    "갤럭시 A175 기반 세이프 공부폰. 학습에 필요한 기능을 중심으로 안전하고 편리하게 사용할 수 있는 학생용 스마트폰입니다.",
  alternates: {
    canonical: "https://sajangchance.com/phone/a175-study",
  },
};

type A175StudyPageProps = {
  searchParams: Promise<{
    reviewPage?: string;
  }>;
};

export default async function A175StudyPage({
  searchParams,
}: A175StudyPageProps) {
  const params = await searchParams;

  const reviewPage = Math.max(
    1,
    Number(params.reviewPage ?? "1") || 1
  );

  const detailImages = Array.from(
    { length: 17 },
    (_, i) =>
      `/images/study-detail-${String(i + 1).padStart(2, "0")}.png`
  );

  const kakaoUrl = "https://pf.kakao.com/_xcxhFen/chat";

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Meta - 공부폰 상세페이지 조회 */}
      <MetaViewContent
        productId="a175-study"
        productName="갤럭시 A175 공부폰"
        value={100}
      />

      {/* 상품 상단 영역 */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
          {/* 대표 이미지 */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100">
            <Image
              src="/images/phone-a175-study.png"
              alt="갤럭시 A175 공부폰"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* 상품 정보 */}
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              공부폰
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              갤럭시 A175 공부폰
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              공부에 필요한 기능은 남기고 불필요한 기능은 줄인
              학생용 스마트폰입니다.
            </p>

            {/* 리뷰 요약 */}
            <ReviewSummary
              productCode="a175-study"
              href="#reviews"
              naverReviewCount={67}
              naverReviewUrl="https://smartstore.naver.com/ho__/products/13331682072#REVIEW"
            />

            {/* 판매가 */}
            <div className="mt-8 border-y border-gray-200 py-6">
              <p className="text-sm font-medium text-gray-500">
                판매가
              </p>

              <div className="mt-1 flex items-end justify-between gap-4">
                <p className="text-4xl font-bold text-gray-900">
                  100원
                </p>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                  온라인 판매가
                </span>
              </div>
            </div>

            {/* 상품 특징 */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  세이프 공부폰
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  자녀의 스마트폰 사용을 편리하게 관리
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  갤럭시 A175
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  실용적인 삼성 갤럭시 스마트폰
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  안전한 사용관리
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  앱과 데이터 사용을 보호자가 관리
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  전문 상담
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  구매와 개통 관련 상담 가능
                </p>
              </div>
            </div>

            {/* 구매 영역 */}
            <form
              action="/checkout/a175-study"
              method="get"
              className="mt-8"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Meta 결제 시작 */}
                <MetaCheckoutButton
                  productId="a175-study"
                  productName="갤럭시 A175 공부폰"
                  value={100}
                >
                  100원 구매하기
                </MetaCheckoutButton>

                {/* 카카오톡 상담 + Meta Lead */}
                <MetaLeadLink
                  href={kakaoUrl}
                  productId="a175-study"
                  productName="갤럭시 A175 공부폰"
                  leadType="kakao_chat"
                  className="flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-base font-bold text-black transition hover:bg-yellow-500"
                >
                  카카오톡 상담
                </MetaLeadLink>
              </div>


            </form>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              상품 및 개통 관련 자세한 내용은 상세페이지 또는 상담을
              통해 확인하실 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 사전승낙서 + 상세페이지 */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl">
          {/* 이동통신서비스 판매점 사전승낙서 */}
          <div className="flex justify-center bg-white py-8 md:py-12">
            <Image
              src="/images/사전승낙서.png"
              alt="이동통신서비스 판매점 사전승낙서"
              width={636}
              height={900}
              sizes="(max-width: 768px) 100vw, 636px"
              className="block h-auto w-full max-w-[636px]"
              priority
            />
          </div>

          {/* 상세페이지 01 ~ 17 */}
          {detailImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`갤럭시 A175 공부폰 상세정보 ${index + 1}`}
              width={1000}
              height={1500}
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="block h-auto w-full"
            />
          ))}
        </div>
      </section>

      {/* 구매 고객 리뷰 */}
      <ReviewSection
        productCode="a175-study"
        reviewPage={reviewPage}
        naverReviewUrl="https://smartstore.naver.com/ho__/products/13331682072#REVIEW"
      />

      {/* 하단 상담 영역 */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center md:py-16">
          <p className="text-sm font-bold text-blue-600">
            갤럭시 A175 공부폰
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            구매 전 궁금한 점이 있으신가요?
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            상품과 개통 관련 내용은 카카오톡을 통해 상담받으실 수 있습니다.
          </p>

          {/* 하단 카카오톡 상담 + Meta Lead */}
          <MetaLeadLink
            href={kakaoUrl}
            productId="a175-study"
            productName="갤럭시 A175 공부폰"
            leadType="kakao_chat"
            className="mx-auto mt-7 block max-w-sm rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black transition hover:bg-yellow-500"
          >
            카카오톡 상담
          </MetaLeadLink>
        </div>
      </section>

      <Footer />
    </main>
  );
}