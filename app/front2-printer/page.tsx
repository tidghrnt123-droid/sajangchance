import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/ProductHero";
import Image from "next/image";
import type { Metadata } from "next";
import ContactBanner from "@/components/ContactBanner";
import ReviewSummary from "@/components/ReviewSummary";
import ReviewSection from "@/components/ReviewSection";

export const metadata: Metadata = {
  title: "토스 프론트2 + 영수증 프린터 | 사장님찬스",
  description:
    "카페, 병원, 미용실 등 영수증 출력이 필요한 매장을 위한 프론트2와 영수증 프린터 세트 상품입니다.",
  alternates: {
    canonical: "https://sajangchance.com/front2-printer",
  },
};

export default function Front2PrinterPage() {
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

      {/* 상품 이미지 + 가격 + 구매 영역 */}
      <ProductHero
        title="토스 프론트2 + 영수증 프린터"
        description="프론트2와 영수증 프린터가 함께 구성된 매장용 세트 상품입니다."
        image="/images/front2-printer.png"
        imageAlt="토스 프론트2와 영수증 프린터 세트"
        price="1,000원"
        checkoutUrl="/checkout/front2-printer"
        features={[
          "토스 프론트2와 영수증 프린터 세트 구성",
          "POS 연동 필수",
          "카페·음식점·뷰티샵·병원 추천",
          "월 사용료 없음",
        ]}
      />

      {/* 상단 리뷰 요약 */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-5">
          <ReviewSummary productCode="front2-printer" />
        </div>
      </section>

      <ContactBanner />

      {/* 상세페이지 상단 이미지 */}
      <section className="mx-auto max-w-5xl">
        <Image
          src="/images/SCTOP.png"
          alt="토스 프론트2 영수증 프린터 상품 안내"
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
            alt={`토스 프론트2 영수증 프린터 상세 ${index + 1}`}
            width={1200}
            height={2000}
            className="h-auto w-full"
            unoptimized={src.endsWith(".gif")}
          />
        ))}
      </section>

      {/* 구매 고객 리뷰 */}
      <ReviewSection productCode="front2-printer" />

      <Footer />
    </main>
  );
}