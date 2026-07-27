import Header from "@/components/Header";
import Image from "next/image";
import Footer from "@/components/Footer";
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

export default function CardTerminalPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* 왼쪽 제목 영역 */}
          <div>
            <p className="mb-4 font-semibold text-blue-600">
              카드단말기 비교
            </p>

            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              매장에 맞는 카드단말기를
              <br />
              한 번에 비교하세요.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
              토스 프론트2, 영수증 프린터 구성, 토스 터미널2,
              <br className="hidden md:block" />
              무선 카드단말기까지 매장 환경에 맞춰 안내드립니다.
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
                <p className="text-sm font-bold text-blue-600">무료 상담</p>
                <p className="text-2xl font-black text-gray-950">
                  010-7908-3099
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {["무료 상담", "무료 카드가맹", "빠른 출고"].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-semibold text-gray-800"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm leading-relaxed text-gray-500">
              전화 한 통으로 매장에 맞는 단말기를 추천해드립니다.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white">
              <Phone size={19} />
              전화하기
            </div>
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col rounded-3xl border border-gray-200 p-7 transition hover:shadow-xl">
            <Image
              src="/images/front2.png"
              alt="토스 프론트2"
              width={300}
              height={300}
              priority
              className="mb-6 h-60 w-full rounded-2xl object-cover"
            />

            <h2 className="mb-3 flex min-h-[72px] items-center text-2xl font-bold">
              토스 프론트2
            </h2>

            <p className="mb-6 min-h-[120px] leading-relaxed text-gray-600">
              무료 제공
              <br />
              POS 연동형
              <br />
              월 사용료 없음
            </p>

            <div className="mt-auto space-y-3">
              <p className="text-2xl font-bold text-blue-600">100원</p>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/front2"
                  className="block rounded-xl border border-blue-600 py-3 text-center font-semibold text-blue-600"
                >
                  자세히 보기
                </a>

                <a
                  href="/checkout/front2"
                  className="block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white"
                >
                  구매하기
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-gray-200 p-7 transition hover:shadow-xl">
            <Image
              src="/images/front2-printer.png"
              alt="토스 프론트2 + 영수증 프린터"
              width={300}
              height={300}
              className="mb-6 h-60 w-full rounded-2xl object-cover"
            />

            <h2 className="mb-3 flex min-h-[72px] items-center text-2xl font-bold">
              토스 프론트2 +
              <br />
              영수증 프린터
            </h2>

            <p className="mb-6 min-h-[120px] leading-relaxed text-gray-600">
              카페 · 병원 · 뷰티샵 추천
              <br />
              영수증이 필요한 업종
            </p>

            <div className="mt-auto space-y-3">
              <p className="text-2xl font-bold text-blue-600">39,000원</p>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/front2-printer"
                  className="block rounded-xl border border-blue-600 py-3 text-center font-semibold text-blue-600"
                >
                  자세히 보기
                </a>

                <a
                  href="/checkout/front2-printer"
                  className="block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white"
                >
                  구매하기
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-gray-200 p-7 transition hover:shadow-xl">
            <Image
              src="/images/front2-terminal2.png"
              alt="토스 프론트2 + 토스 터미널2"
              width={300}
              height={300}
              className="mb-6 h-60 w-full rounded-2xl object-cover"
            />

            <h2 className="mb-3 flex min-h-[72px] items-center text-2xl font-bold">
              토스 프론트2 +
              <br />
              토스 터미널2
            </h2>

            <p className="mb-6 min-h-[120px] leading-relaxed text-gray-600">
              영수증 출력과 금액 입력 결제가 가능한 토스 세트
              <br />
              프리미엄 구성
            </p>

            <div className="mt-auto space-y-3">
              <p className="text-2xl font-bold text-blue-600">139,000원</p>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/front2-terminal2"
                  className="block rounded-xl border border-blue-600 py-3 text-center font-semibold text-blue-600"
                >
                  자세히 보기
                </a>

                <a
                  href="/checkout/front2-terminal2"
                  className="block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white"
                >
                  구매하기
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-gray-200 p-7 transition hover:shadow-xl">
            <Image
              src="/images/wireless.png"
              alt="무선 카드단말기"
              width={300}
              height={300}
              className="mb-6 h-60 w-full rounded-2xl object-cover"
            />

            <h2 className="mb-3 flex min-h-[72px] items-center text-2xl font-bold">
              무선 카드단말기
            </h2>

            <p className="mb-6 min-h-[120px] leading-relaxed text-gray-600">
              KT · SK LTE
              <br />
              월 통신료 11,000원
              <br />
              전국 어디서나 사용
            </p>

            <div className="mt-auto space-y-3">
              <p className="text-2xl font-bold text-blue-600">100원</p>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/wireless"
                  className="block rounded-xl border border-blue-600 py-3 text-center font-semibold text-blue-600"
                >
                  자세히 보기
                </a>

                <a
                  href="/checkout/wireless"
                  className="block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white"
                >
                  구매하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}