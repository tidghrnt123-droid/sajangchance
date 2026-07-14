import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";



export const metadata: Metadata = {
  title: "토스 프론트2 카드단말기 | 사장님찬스",
  description:
    "토스 프론트2 카드단말기 가격, 특징, POS 연동 및 월 사용료 정보를 확인하세요.",
  alternates: {
    canonical: "https://sajangchance.com/front2",
  },
};


export default function Front2Page() {
  const details = Array.from(
    { length: 27 },
    (_, i) => `/images/front2-detail-${String(i + 1).padStart(2, "0")}.png`
  );

  return (
    <main className="bg-white">
      <Header />

      <section className="max-w-6xl mx-auto px-6 pt-32 md:pt-20 pb-20">
        <a href="/card-terminal" className="text-blue-600 font-semibold">
          ← 카드단말기 목록으로
        </a>

        <div className="mt-8">
          <p className="text-blue-600 font-semibold mb-3">카드단말기</p>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            토스 프론트2
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8">
            POS 연동형 카드단말기
          </p>

          <div className="bg-gray-50 rounded-3xl p-8 mb-10">
            <ul className="space-y-3 text-lg">
              <li>✓ 무료 제공</li>
              <li>✓ POS 연동 가능</li>
              <li>✓ 월 사용료 없음</li>
              <li>✓ 카페 · 음식점 · 매장 추천</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <a
              href="/checkout/front2"
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold"
            >
              구매하기
            </a>

            <a
              href="/#contact"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-2xl font-semibold"
            >
              상담 신청
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto pb-20">
        <Image
          src="/images/SCTOP.png"
          alt="토스 프론트2 상단 이미지"
          width={1200}
          height={1200}
          className="w-full"
          priority
        />

        {details.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`토스 프론트2 상세 ${index + 1}`}
            width={1200}
            height={2000}
            className="w-full"
            priority={index === 0}
          />
        ))}
      </section>

      <Footer />
    </main>
  );
}