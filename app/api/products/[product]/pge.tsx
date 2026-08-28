import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSummary from "@/components/ReviewSummary";
import ReviewSection from "@/components/ReviewSection";
import MetaViewContent from "@/components/MetaViewContent";
import MetaCheckoutButton from "@/components/MetaCheckoutButton";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    product: string;
  }>;
};

type ProductRow = {
  product_code: string;
  product_type: string;
  category: string;
  name: string;
  short_description: string | null;
  price: number;
  thumbnail_url: string | null;
  badge: string | null;
  naver_review_count: number;
  naver_review_url: string | null;
  is_visible: boolean;
};

type ProductImageRow = {
  id: number;
  image_url: string;
  sort_order: number;
};

export default async function GenericProductPage({
  params,
}: PageProps) {
  const { product: productCode } =
    await params;

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("products")
    .select(`
      product_code,
      product_type,
      category,
      name,
      short_description,
      price,
      thumbnail_url,
      badge,
      naver_review_count,
      naver_review_url,
      is_visible
    `)
    .eq(
      "product_code",
      productCode
    )
    .maybeSingle();

  if (error) {
    console.error(
      "Generic product load error:",
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
          <h1 className="text-3xl font-bold text-gray-900">
            현재 판매하지 않는 상품입니다.
          </h1>

          <a
            href={
              product?.product_type === "PHONE"
                ? "/phone"
                : "/card-terminal"
            }
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
          >
            상품 목록으로
          </a>
        </section>

        <Footer />
      </main>
    );
  }

  const {
    data: imageData,
    error: imageError,
  } = await supabaseAdmin
    .from("product_images")
    .select(
      "id,image_url,sort_order"
    )
    .eq(
      "product_code",
      product.product_code
    )
    .eq(
      "image_type",
      "detail"
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    );

  if (imageError) {
    console.error(
      "Generic product image load error:",
      imageError
    );
  }

  const detailImages =
    (imageData ?? []) as ProductImageRow[];

  const price =
    Number(product.price);

  const priceText =
    `${price.toLocaleString()}원`;

  const isPhone =
    product.product_type ===
    "PHONE";

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <MetaViewContent
        productId={
          product.product_code
        }
        productName={
          product.name
        }
        value={price}
      />

      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100">
            {product.thumbnail_url ? (
              <Image
                src={
                  product.thumbnail_url
                }
                alt={
                  product.name
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                대표 이미지 없음
              </div>
            )}
          </div>

          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              {product.badge ||
                (isPhone
                  ? "휴대폰"
                  : "카드단말기")}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              {product.short_description ||
                "상품 상세정보를 확인해보세요."}
            </p>

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

            <div className="mt-8 border-y border-gray-200 py-6">
              <p className="text-sm font-medium text-gray-500">
                판매가
              </p>

              <div className="mt-1 flex items-end justify-between gap-4">
                <p className="text-4xl font-bold text-gray-900">
                  {priceText}
                </p>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                  온라인 판매가
                </span>
              </div>
            </div>

            <form
              action={`/checkout/${product.product_code}`}
              method="get"
              className="mt-8"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <MetaCheckoutButton
                  productId={
                    product.product_code
                  }
                  productName={
                    product.name
                  }
                  value={price}
                >
                  {priceText} 구매하기
                </MetaCheckoutButton>

                <a
                  href="https://pf.kakao.com/_xcxhFen/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-base font-bold text-black transition hover:bg-yellow-500"
                >
                  카카오톡 상담
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {detailImages.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-5xl">
            {detailImages.map(
              (
                detail,
                index
              ) => (
                <Image
                  key={
                    detail.id
                  }
                  src={
                    detail.image_url
                  }
                  alt={`${product.name} 상세정보 ${
                    index + 1
                  }`}
                  width={1000}
                  height={1600}
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  className="block h-auto w-full"
                />
              )
            )}
          </div>
        </section>
      )}

      <ReviewSection
        productCode={
          product.product_code
        }
        naverReviewUrl={
          product.naver_review_url ||
          undefined
        }
      />

      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center md:py-16">
          <p className="text-sm font-bold text-blue-600">
            {product.name}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            구매 전 궁금한 점이 있으신가요?
          </h2>

          <a
            href="https://pf.kakao.com/_xcxhFen/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-7 block max-w-sm rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black transition hover:bg-yellow-500"
          >
            카카오톡 상담
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
