import type { Metadata } from "next";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhoneActivationOptions from "@/components/PhoneActivationOptions";

export const metadata: Metadata = {
  title: "갤럭시 A175 | 사장님찬스",
  description:
    "법인폰·키즈폰·효도폰 등 다양한 용도로 활용하기 좋은 실용적인 갤럭시 A175 스마트폰을 확인하세요.",
  alternates: {
    canonical: "https://sajangchance.com/phone/a175",
  },
};

export default function A175Page() {
  const detailImages = [
    "/images/a175-detail-01.png",
    "/images/a175-detail-02.png",
    "/images/a175-detail-03.png",
    "/images/a175-detail-04.jpg",
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 상품 상단 영역 */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
          {/* 대표 이미지 */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100">
            <Image
              src="/images/phone-a175.png"
              alt="갤럭시 A175"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* 상품 정보 */}
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              스마트폰
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              갤럭시 A175
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              법인폰·키즈폰·효도폰 등 다양한 용도로 활용하기 좋은
              실용적인 스마트폰입니다.
            </p>

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
                  다양한 활용
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  법인폰·키즈폰·효도폰 등 다양한 용도로 활용
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  갤럭시 A175
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  일상 사용에 적합한 실용적인 삼성 스마트폰
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">
                  편리한 개통
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  신규가입과 번호이동을 간편하게 신청
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
              action="/checkout/a175"
              method="get"
              className="mt-8"
            >
              {/* 구매 / 상담 버튼 */}
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700"
                >
                  100원 구매하기
                </button>

                <a
                  href="https://pf.kakao.com/_xcxhFen/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-base font-bold text-black transition hover:bg-yellow-500"
                >
                  카카오톡 상담
                </a>
              </div>

              {/* 가입 유형 선택 */}
              <PhoneActivationOptions />
            </form>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              상품 및 개통 관련 자세한 내용은 상세페이지 또는 상담을
              통해 확인하실 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 상세페이지 */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl">
          {detailImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`갤럭시 A175 상세정보 ${index + 1}`}
              width={1000}
              height={2000}
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="block h-auto w-full"
            />
          ))}
        </div>
      </section>

      {/* 하단 상담 영역 */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center md:py-16">
          <p className="text-sm font-bold text-blue-600">
            갤럭시 A175
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