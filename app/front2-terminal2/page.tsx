import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/ProductHero";
import Image from "next/image";
import type { Metadata } from "next";
import ContactBanner from "@/components/ContactBanner";
import ReviewSummary from "@/components/ReviewSummary";
import ReviewSection from "@/components/ReviewSection";

export const metadata: Metadata = {
  title: "토스 프론트2 + 토스 터미널2 | 사장님찬스",
  description:
    "금액 입력 결제와 영수증 출력이 가능한 토스 프론트2와 토스 터미널2 세트 상품입니다.",
  alternates: {
    canonical: "https://sajangchance.com/front2-terminal2",
  },
};

export default function Front2Terminal2Page() {
  const details = [
    "/images/01.gif",
    "/images/02.gif",
    ...Array.from(
      { length: 26 },
      (_, i) => `/images/${String(i + 3).padStart(2, "0")}.png`
    ),
  ];

  return (
    <main className="bg-white">
      <Header />

      <ProductHero
        title="토스 프론트2 + 토스 터미널2"
        description="영수증 출력과 금액 입력 결제가 가능한 토스 프론트2와 터미널2 세트 상품입니다."
        image="/images/front2-terminal2.png"
        imageAlt="토스 프론트2 + 토스 터미널2"
        price="139,000원"
        checkoutUrl="/checkout/front2-terminal2"
        features={[
          "토스 프론트2 + 토스 터미널2 세트",
          "금액 직접 입력 후 결제 가능",
          "영수증 출력 지원",
          "월 사용료 없음",
        ]}
      />

      {/* 상단 리뷰 요약 */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-5">
          <ReviewSummary productCode="front2-terminal2" />
        </div>
      </section>

      <ContactBanner />

      <section className="mx-auto max-w-5xl">
        <Image
          src="/images/SCTOP.png"
          alt="토스 프론트2 + 토스 터미널2 상품 안내"
          width={1200}
          height={1200}
          className="h-auto w-full"
          priority
        />
      </section>

      <section className="mx-auto max-w-5xl pb-24">
        {details.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`토스 프론트2 + 토스 터미널2 상세 ${index + 1}`}
            width={1200}
            height={2000}
            className="h-auto w-full"
            unoptimized={src.endsWith(".gif")}
          />
        ))}
      </section>

      {/* 구매 고객 리뷰 */}
      <ReviewSection productCode="front2-terminal2" />

      <Footer />
    </main>
  );
}