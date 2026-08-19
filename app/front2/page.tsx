import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/ProductHero";
import Image from "next/image";
import ContactBanner from "@/components/ContactBanner";
import ReviewSummary from "@/components/ReviewSummary";
import ReviewSection from "@/components/ReviewSection";

export const metadata: Metadata = {
  title: "토스 프론트2 카드단말기 | 사장님찬스",
  description:
    "토스 프론트2 카드단말기 가격, 특징, POS 연동 및 월 사용료 정보를 확인하세요.",
  alternates: {
    canonical: "https://sajangchance.com/front2",
  },
};

export default function Front2Page() {
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

      {/* 상품 이미지 + 상품 정보 */}
      <ProductHero
        title="토스 프론트2"
        description="POS와 연동하여 사용하는 매장용 카드결제 단말기입니다."
        image="/images/front2.png"
        imageAlt="토스 프론트2 카드단말기"
        price="100원"
        checkoutUrl="/checkout/front2"
        features={[
          "토스 프론트2 무료 제공",
          "POS 연동 가능",
          "월 사용료 없음",
          "카페·음식점·매장 추천",
        ]}
        metaProductId="front2"
        metaProductName="토스 프론트2"
        metaValue={100}
      />

      {/* 상단 리뷰 요약 */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-5">
          <ReviewSummary
            productCode="front2"
            href="#reviews"
            naverReviewCount={98}
            naverReviewUrl="https://smartstore.naver.com/ho__/products/12539725990#REVIEW"
          />
        </div>
      </section>

      <ContactBanner />

      {/* 상세페이지 상단 이미지 */}
      <section className="mx-auto max-w-5xl">
        <Image
          src="/images/SCTOP.png"
          alt="토스 프론트2 상품 안내"
          width={1200}
          height={1200}
          className="h-auto w-full"
          priority
        />
      </section>

      {/* 상품 상세 이미지 01 ~ 28 */}
      <section className="mx-auto max-w-5xl pb-24">
        {details.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`토스 프론트2 상세 ${index + 1}`}
            width={1200}
            height={2000}
            className="h-auto w-full"
            unoptimized={src.endsWith(".gif")}
          />
        ))}
      </section>

      {/* 구매 고객 리뷰 */}
      <ReviewSection
        productCode="front2"
        naverReviewUrl="https://smartstore.naver.com/ho__/products/12539725990#REVIEW"
      />

      <Footer />
    </main>
  );
}