import type { Metadata } from "next";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhoneActivationOptions from "@/components/PhoneActivationOptions";
import ReviewSummary from "@/components/ReviewSummary";
import ReviewSection from "@/components/ReviewSection";
import MetaViewContent from "@/components/MetaViewContent";
import MetaCheckoutButton from "@/components/MetaCheckoutButton";

export const metadata: Metadata = {
  title: "AT-M140 스타일 폴더폰2 | 사장님찬스",
  description:
    "큰 버튼과 편리한 사용성, 외부 디스플레이를 갖춘 AT-M140 스타일 폴더폰2를 확인하세요.",
  alternates: {
    canonical: "https://sajangchance.com/phone/m140",
  },
};

export default function M140Page() {
  const detailImages = [
    "/images/m140-detail-01.png",
    "/images/m140-detail-02.png",
    "/images/m140-detail-03.png",
    "/images/m140-detail-04.jpg",
    "/images/m140-detail-05.jpg",
    "/images/m140-detail-06.jpg",
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Meta 상품 상세 조회 */}
      <MetaViewContent
        productId="m140"
        productName="AT-M140 스타일 폴더폰2"
        value={100}
      />

      {/* 상품 상단 영역 */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
          {/* 대표 이미지 */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100">
            <Image
              src="/images/phone-m141.png"
              alt="AT-M140 스타일 폴더폰2"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* 상품 정보 */}
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              효도폰
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              AT-M140 스타일 폴더폰2
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              큰 버튼과 편리한 조작, 외부 디스플레이를 갖춰
              누구나 간편하게 사용할 수 있는 실용적인 폴더폰입니다.
            </p>

            {/* 상단 리뷰 요약 */}
            <ReviewSummary productCode="m140" />

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
                  편리한 폴더폰
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  큰 버튼과 직관적인 키패드로 간편하게 사용
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  외부 디스플레이
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  폴더를 열지 않고도 시간과 알림을 간편하게 확인
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  시니어 맞춤 기능
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  알림 읽어주기와 화면 터치 잠금 등 편의 기능 지원
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  안심 기능
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  SOS 기능과 스팸 전화·메시지 차단 등 실용적인 기능
                </p>
              </div>
            </div>

            {/* 구매 영역 */}
            <form
              action="/checkout/m140"
              method="get"
              className="mt-8"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <MetaCheckoutButton
                  productId="m140"
                  productName="AT-M140 스타일 폴더폰2"
                  value={100}
                >
                  100원 구매하기
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

              <PhoneActivationOptions />
            </form>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              상품 및 개통 관련 자세한 내용은 상세페이지 또는 상담을
              통해 확인하실 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 상세페이지 이미지 */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl">
          {detailImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`AT-M140 스타일 폴더폰2 상세정보 ${index + 1}`}
              width={1000}
              height={2000}
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="block h-auto w-full"
            />
          ))}
        </div>
      </section>

      {/* 구매 고객 리뷰 */}
      <ReviewSection productCode="m140" />

      {/* 하단 상담 영역 */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center md:py-16">
          <p className="text-sm font-bold text-blue-600">
            AT-M140 스타일 폴더폰2
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            구매 전 궁금한 점이 있으신가요?
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            상품과 개통 관련 내용은 카카오톡을 통해 상담받으실 수 있습니다.
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