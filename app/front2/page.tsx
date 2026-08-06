import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/ProductHero";
import Image from "next/image";
import ContactBanner from "@/components/ContactBanner";



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
    (_, i) =>
      `/images/front2-detail-${String(i + 1).padStart(2, "0")}.png`
  );

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
      />
<ContactBanner />

      {/* 공통 혜택 이미지 */}
      {/*<section className="mx-auto max-w-5xl">
        <Image
          src="/images/common-top-benefit.png"
          alt="사장님찬스 혜택"
          width={1200}
          height={1500}
          className="h-auto w-full"
        />
      </section> */}

      {/* 기존 상품 상세 이미지 */}
      <section className="mx-auto max-w-5xl pb-24">
        <Image
          src="/images/SCTOP.png"
          alt="토스 프론트2 상품 안내"
          width={1200}
          height={1200}
          className="h-auto w-full"
        />

        {details.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`토스 프론트2 상세 ${index + 1}`}
            width={1200}
            height={2000}
            className="h-auto w-full"
            priority={index === 0}
          />
        ))}
      </section>

      <Footer />
    </main>
  );
}