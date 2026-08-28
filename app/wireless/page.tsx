import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/ProductHero";
import Image from "next/image";
import type { Metadata } from "next";
import ContactBanner from "@/components/ContactBanner";
import ReviewSummary from "@/components/ReviewSummary";
import ReviewSection from "@/components/ReviewSection";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "무선 카드단말기 | 사장님찬스",
  description:
    "KT LTE 기반 무선 카드단말기입니다. 배달, 행사장, 푸드트럭 등 이동형 결제가 필요한 업종에 적합합니다.",
  alternates: {
    canonical: "https://sajangchance.com/wireless",
  },
};

type ProductRow = {
  product_code: string;
  product_type: string;
  name: string;
  short_description: string | null;
  price: number;
  thumbnail_url: string | null;
  badge: string | null;
  naver_review_count: number;
  naver_review_url: string | null;
  is_visible: boolean;
};

export default async function WirelessPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("products")
    .select(
      `
        product_code,
        product_type,
        name,
        short_description,
        price,
        thumbnail_url,
        badge,
        naver_review_count,
        naver_review_url,
        is_visible
      `
    )
    .eq(
      "product_code",
      "wireless"
    )
    .maybeSingle();

  if (error) {
    console.error(
      "Wireless product load error:",
      error
    );
  }

  const product =
    data as ProductRow | null;

  if (
    !product ||
    !product.is_visible
  ) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="font-semibold text-blue-600">
            사장님찬스
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            현재 판매하지 않는 상품입니다.
          </h1>

          <p className="mt-4 text-gray-500">
            다른 카드단말기 상품을 확인해주세요.
          </p>

          <a
            href="/card-terminal"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
          >
            카드단말기 보러가기
          </a>
        </section>

        <Footer />
      </main>
    );
  }

  const details = [
    "/images/lte1.png",
    "/images/lte2.png",
  ];

  const heroImage =
    product.thumbnail_url ||
    "/images/wireless.png";

  const description =
    product.short_description ||
    "KT · SK LTE 기반으로 어디서나 간편하게 결제할 수 있는 이동형 카드단말기입니다.";

  return (
    <main className="bg-white">
      <Header />

      {/* 상품 이미지 + 상품 정보 */}
      <ProductHero
        category={
          product.badge ||
          "무선 카드단말기"
        }
        title={product.name}
        description={description}
        image={heroImage}
        imageAlt={product.name}
        price={`${Number(
          product.price
        ).toLocaleString()}원`}
        checkoutUrl="/checkout/wireless"
        features={[
          "KT · SK LTE 사용 가능",
          "애플페이 · 삼성페이 지원",
          "월 통신료 11,000원",
          "푸드트럭 · 배달 · 행사장 추천",
        ]}
        metaProductId={
          product.product_code
        }
        metaProductName={
          product.name
        }
        metaValue={
          Number(
            product.price
          )
        }
      />

      {/* 상단 리뷰 요약 */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-5">
          <ReviewSummary
            productCode={
              product.product_code
            }
            href="#reviews"
            naverReviewCount={
              product.naver_review_count
            }
            naverReviewUrl={
              product.naver_review_url ||
              undefined
            }
          />
        </div>
      </section>

      <ContactBanner />

      {/* 상세페이지 */}
      <section className="mx-auto max-w-5xl pb-24">
        <Image
          src="/images/SCTOP.png"
          alt={`${product.name} 상품 안내`}
          width={1200}
          height={1200}
          className="h-auto w-full"
          priority
        />

        {details.map(
          (src, index) => (
            <Image
              key={src}
              src={src}
              alt={`${product.name} 상세 ${
                index + 1
              }`}
              width={1200}
              height={2000}
              className="h-auto w-full"
              priority={
                index === 0
              }
            />
          )
        )}
      </section>

      {/* 구매 고객 리뷰 */}
      <ReviewSection
        productCode={
          product.product_code
        }
        naverReviewUrl={
          product.naver_review_url ||
          undefined
        }
      />

      <Footer />
    </main>
  );
}
