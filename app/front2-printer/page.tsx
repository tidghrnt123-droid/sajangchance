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
  title: "토스 프론트2 + 영수증 프린터 | 사장님찬스",
  description:
    "카페, 병원, 미용실 등 영수증 출력이 필요한 매장을 위한 프론트2와 영수증 프린터 세트 상품입니다.",
  alternates: {
    canonical: "https://sajangchance.com/front2-printer",
  },
};

type ProductRow = {
  product_code: string;
  product_type: string;
  name: string;
  short_description: string | null;
  price: number;
  thumbnail_url: string | null;
  naver_review_count: number;
  naver_review_url: string | null;
  is_visible: boolean;
};

export default async function Front2PrinterPage() {
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
        naver_review_count,
        naver_review_url,
        is_visible
      `
    )
    .eq(
      "product_code",
      "front2-printer"
    )
    .maybeSingle();

  if (error) {
    console.error(
      "Front2 printer product load error:",
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
    "/images/01.gif",
    "/images/02.gif",
    ...Array.from(
      { length: 26 },
      (_, i) =>
        `/images/${String(
          i + 3
        ).padStart(
          2,
          "0"
        )}.png`
    ),
  ];

  const heroImage =
    product.thumbnail_url ||
    "/images/front2-printer.png";

  const description =
    product.short_description ||
    "프론트2와 영수증 프린터가 함께 구성된 매장용 세트 상품입니다.";

  return (
    <main className="bg-white">
      <Header />

      {/* 상품 이미지 + 가격 + 구매 영역 */}
      <ProductHero
        title={product.name}
        description={description}
        image={heroImage}
        imageAlt={`${product.name} 세트`}
        price={`${Number(
          product.price
        ).toLocaleString()}원`}
        checkoutUrl="/checkout/front2-printer"
        features={[
          "토스 프론트2와 영수증 프린터 세트 구성",
          "POS 연동 필수",
          "카페·음식점·뷰티샵·병원 추천",
          "월 사용료 없음",
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

      {/* 상세페이지 상단 이미지 */}
      <section className="mx-auto max-w-5xl">
        <Image
          src="/images/SCTOP.png"
          alt={`${product.name} 상품 안내`}
          width={1200}
          height={1200}
          className="h-auto w-full"
          priority
        />
      </section>

      {/* 상품 상세 이미지 01 ~ 28 */}
      <section className="mx-auto max-w-5xl pb-24">
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
              unoptimized={
                src.endsWith(
                  ".gif"
                )
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
