import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "무선 카드단말기 | 사장님찬스",
  description:
    "KT LTE 기반 무선 카드단말기입니다. 배달, 행사장, 푸드트럭 등 이동형 결제가 필요한 업종에 적합합니다.",
  alternates: {
    canonical: "https://sajangchance.com/wireless",
  },
};

export default function WirelessPage() {
  const details = ["/images/lte1.png", "/images/lte2.png"];

  return (
    <main className="bg-white">
      <Header />

      <section className="max-w-6xl mx-auto px-6 pt-32 md:pt-20 pb-20">
        <a href="/card-terminal" className="text-blue-600 font-semibold">
          ← 카드단말기 목록으로
        </a>

        <div className="mt-8">
          <p className="text-blue-600 font-semibold mb-3">무선 카드단말기</p>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            무선 카드단말기
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8">
            KT · SK LTE 무선 카드단말기
          </p>

          <div className="bg-gray-50 rounded-3xl p-8 mb-10">
            <ul className="space-y-3 text-lg">
              <li>✓ KT · SK LTE 사용 가능</li>
              <li>✓ 월 통신료 11,000원</li>
              <li>✓ 애플페이 · 삼성페이 지원</li>
              <li>✓ 푸드트럭 · 배달 · 행사장 추천</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <a
              href="/buy/wireless"
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
          alt="무선 카드단말기 상단 이미지"
          width={1200}
          height={1200}
          className="w-full"
          priority
        />

        {details.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`무선 카드단말기 상세 ${index + 1}`}
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