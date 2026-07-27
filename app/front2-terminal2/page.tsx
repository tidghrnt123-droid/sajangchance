import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/ProductHero";
import Image from "next/image";
import type { Metadata } from "next";
import ContactBanner from "@/components/ContactBanner";


export const metadata: Metadata = {
  title: "토스 프론트2 + 토스 터미널2 | 사장님찬스",
  description:
    "금액 입력 결제와 영수증 출력이 가능한 토스 프론트2와 토스 터미널2 세트 상품입니다.",
  alternates: {
    canonical: "https://sajangchance.com/front2-terminal2",
  },
};

export default function Front2Terminal2Page() {
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
<ContactBanner />
      {/* 공통 혜택 이미지 */}
      <section className="mx-auto max-w-5xl">
        <Image
          src="/images/common-top-benefit.png"
          alt="인터넷 가입 혜택"
          width={1200}
          height={1500}
          className="h-auto w-full"
        />
      </section>

      {/* 기존 상세페이지 */}
      <section className="mx-auto max-w-5xl pb-24">
        <Image
          src="/images/SCTOP.png"
          alt="토스 프론트2 + 토스 터미널2 상품 안내"
          width={1200}
          height={1200}
          className="h-auto w-full"
          priority
        />

        {details.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`토스 프론트2 + 토스 터미널2 상세 ${index + 1}`}
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