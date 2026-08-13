import type { Metadata } from "next";
import Image from "next/image";
import { Check, Phone } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "휴대폰 | 사장님찬스",
  description:
    "공부폰, 키즈폰, 효도폰, 법인폰 등 다양한 용도의 휴대폰 상품을 사장님찬스에서 확인하세요.",
  alternates: {
    canonical: "https://sajangchance.com/phone",
  },
};

const phones = [
  {
    name: "갤럭시 A175 공부폰",
    description:
      "공부에 필요한 기능은 남기고 불필요한 기능은 줄인 학생용 휴대폰",
    image: "/images/phone-a175-study.png",
    href: "/phone/a175-study",
    badge: "공부폰",
    price: 100,
  },
  {
    name: "갤럭시 A175",
    description:
      "법인폰·키즈폰·효도폰 등 다양한 용도로 활용하기 좋은 실용적인 스마트폰",
    image: "/images/phone-a175.png",
    href: "/phone/a175",
    badge: "스마트폰",
    price: 100,
  },
  {
    name: "AT-M140",
    description:
      "큰 버튼과 간편한 조작으로 누구나 편리하게 사용할 수 있는 실용적인 폴더폰",
    image: "/images/phone-m140.png",
    href: "/phone/m140",
    badge: "효도폰",
    price: 100,
  },
  {
    name: "에이루트 A1",
    description:
      "전화와 문자 등 기본 기능을 간편하게 사용할 수 있는 실용적인 폴더형 휴대폰",
    image: "/images/phone-aroot-a1.png",
    href: "/phone/aroot-a1",
    badge: "효도폰",
    price: 100,
  },
];

export default function PhonePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* 상단 소개 */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          {/* 왼쪽 소개 */}
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
              공부폰부터 스마트폰, 효도폰까지 필요한 휴대폰을
              확인하고 구매 또는 상담을 진행할 수 있습니다.
            </p>
          </div>

          {/* 오른쪽 상담 카드 */}
          <div className="rounded-3xl border-2 border-blue-600 bg-white p-7 shadow-sm md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <Phone size={24} strokeWidth={2.4} />
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

            {/* 상담 장점 */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Check size={15} strokeWidth={3} />
                </span>

                <span className="text-sm font-semibold text-gray-700">
                  휴대폰 개통 전문 상담
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Check size={15} strokeWidth={3} />
                </span>

                <span className="text-sm font-semibold text-gray-700">
                  가입유형·요금제 안내
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Check size={15} strokeWidth={3} />
                </span>

                <span className="text-sm font-semibold text-gray-700">
                  빠른 개통 및 출고
                </span>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-gray-500">
              어떤 휴대폰을 선택해야 할지 고민되시면 전화 한 통으로
              용도에 맞는 상품을 안내해드립니다.
            </p>

            <a
              href="tel:01081413099"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              <Phone size={18} strokeWidth={2.5} />
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

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {phones.map((phone) => (
            <a
              key={phone.href}
              href={phone.href}
              className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              {/* 상품 이미지 */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={phone.image}
                  alt={phone.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>

              {/* 상품 정보 */}
              <div className="p-5">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {phone.badge}
                </span>

                <h2 className="mt-3 text-xl font-bold text-gray-900">
                  {phone.name}
                </h2>

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                  {phone.description}
                </p>

                {/* 판매가 */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-xs font-medium text-gray-400">
                    판매가
                  </p>

                  <div className="mt-1 flex items-end justify-between gap-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {phone.price.toLocaleString()}원
                    </p>

                    <span className="shrink-0 text-sm font-bold text-blue-600 transition group-hover:translate-x-1">
                      자세히 보기 →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}