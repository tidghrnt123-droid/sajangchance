import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/ProductHero";
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

      {/* 상품 이미지 + 상품 정보 */}
      <ProductHero
        category="무선 카드단말기"
        title="무선 카드단말기"
        description="KT · SK LTE 기반으로 어디서나 간편하게 결제할 수 있는 이동형 카드단말기입니다."
        image="/images/wireless.png"
        imageAlt="무선 카드단말기"
        price="100원"
        checkoutUrl="/checkout/wireless"
        features={[
          "KT · SK LTE 사용 가능",
          "애플페이 · 삼성페이 지원",
          "월 통신료 11,000원",
          "푸드트럭 · 배달 · 행사장 추천",
        ]}
      />

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
          alt="무선 카드단말기 상품 안내"
          width={1200}
          height={1200}
          className="h-auto w-full"
          priority
        />

        {details.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`무선 카드단말기 상세 ${index + 1}`}
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