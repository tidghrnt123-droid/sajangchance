import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/ProductHero";
import Image from "next/image";
import type { Metadata } from "next";
import ContactBanner from "@/components/ContactBanner";



export const metadata: Metadata = {
  title: "토스 프론트2 + 영수증 프린터 | 사장님찬스",
  description:
    "카페, 병원, 미용실 등 영수증 출력이 필요한 매장을 위한 프론트2와 영수증 프린터 세트 상품입니다.",
  alternates: {
    canonical: "https://sajangchance.com/front2-printer",
  },
};

export default function Front2PrinterPage() {
  const details = Array.from(
    { length: 27 },
    (_, i) =>
      `/images/front2-detail-${String(i + 1).padStart(2, "0")}.png`
  );

  return (
    <main className="bg-white">
      <Header />

      {/* 상품 이미지 + 가격 + 구매 영역 */}
      <ProductHero
        title="토스 프론트2 + 영수증 프린터"
        description="프론트2와 영수증 프린터가 함께 구성된 매장용 세트 상품입니다."
        image="/images/front2-printer.png"
        imageAlt="토스 프론트2와 영수증 프린터 세트"
        price="39,000원"
        checkoutUrl="/checkout/front2-printer"
        features={[
          "토스 프론트2와 영수증 프린터 세트 구성",
          "POS 연동 필수",
          "카페·음식점·뷰티샵·병원 추천",
          "월 사용료 없음",
        ]}
      />
<ContactBanner />

      {/* 공통 인터넷 혜택 이미지 */}
      {/* <section className="max-w-5xl mx-auto">
        <Image
          src="/images/common-top-benefit.png"
          alt="사장님찬스 혜택"
          width={1200}
          height={1500}
          className="w-full h-auto"
        />
      </section> */}
      


      {/* 기존 상세페이지 이미지 */}
      <section className="max-w-5xl mx-auto pb-24">
        <Image
          src="/images/SCTOP.png"
          alt="토스 프론트2 영수증 프린터 상품 안내"
          width={1200}
          height={1200}
          className="w-full h-auto"
        />

        {details.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`토스 프론트2 영수증 프린터 상세 ${index + 1}`}
            width={1200}
            height={2000}
            className="w-full h-auto"
            priority={index === 0}
          />
        ))}
      </section>

      <Footer />
    </main>
  );
}