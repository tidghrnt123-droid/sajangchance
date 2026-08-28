import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductImageUploader from "@/components/ProductImageUploader";

export const dynamic = "force-dynamic";

type ProductRow = {
  id: number;
  product_code: string;
  product_type: string;
  category: string;
  name: string;
  short_description: string | null;
  price: number;
  thumbnail_url: string | null;
  detail_path: string | null;
  badge: string | null;
  features: unknown;
  naver_review_count: number;
  naver_review_url: string | null;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ProductAdminPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

function getString(
  value: FormDataEntryValue | null
) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function getBoolean(
  value: FormDataEntryValue | null
) {
  return value === "on";
}

function getNumber(
  value: FormDataEntryValue | null,
  fallback = 0
) {
  const parsed = Number(
    getString(value)
  );

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

export default async function ProductsAdminPage({
  searchParams,
}: ProductAdminPageProps) {
  const params = await searchParams;

  /*
   * 상품 목록 조회
   */
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("sort_order", {
      ascending: true,
    })
    .order("id", {
      ascending: true,
    });

  const products =
    (data ?? []) as ProductRow[];

  /*
   * 상품 수정
   */
  async function updateProduct(
    formData: FormData
  ) {
    "use server";

    const productCode =
      getString(
        formData.get("product_code")
      );

    const name =
      getString(
        formData.get("name")
      );

    const price =
      getNumber(
        formData.get("price")
      );

    const shortDescription =
      getString(
        formData.get(
          "short_description"
        )
      );

    const badge =
      getString(
        formData.get("badge")
      );

    const thumbnailUrl =
      getString(
        formData.get(
          "thumbnail_url"
        )
      );

    const detailPath =
      getString(
        formData.get(
          "detail_path"
        )
      );

    const naverReviewCount =
      getNumber(
        formData.get(
          "naver_review_count"
        )
      );

    const naverReviewUrl =
      getString(
        formData.get(
          "naver_review_url"
        )
      );

    const sortOrder =
      getNumber(
        formData.get(
          "sort_order"
        )
      );

    const isVisible =
      getBoolean(
        formData.get(
          "is_visible"
        )
      );

    const isFeatured =
      getBoolean(
        formData.get(
          "is_featured"
        )
      );

    if (
      !productCode ||
      !name
    ) {
      redirect(
        "/admin/products?error=missing"
      );
    }

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("products")
      .update({
        name,

        price,

        short_description:
          shortDescription ||
          null,

        badge:
          badge || null,

        thumbnail_url:
          thumbnailUrl ||
          null,

        detail_path:
          detailPath ||
          null,

        naver_review_count:
          naverReviewCount,

        naver_review_url:
          naverReviewUrl ||
          null,

        sort_order:
          sortOrder,

        is_visible:
          isVisible,

        is_featured:
          isFeatured,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "product_code",
        productCode
      );

    if (updateError) {
      console.error(
        "Product update error:",
        updateError
      );

      redirect(
        "/admin/products?error=update"
      );
    }

    revalidatePath(
      "/admin/products"
    );

    revalidatePath("/");

    revalidatePath(
      "/card-terminal"
    );

    revalidatePath("/phone");

    redirect(
      "/admin/products?saved=1"
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1500px]">

        {/* 상단 */}
        <header className="mb-8 flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-semibold text-blue-600">
              사장님찬스 관리자
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              상품관리
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              상품명, 가격, 설명,
              대표이미지와 노출상태를
              관리합니다.
            </p>
          </div>

          <a
            href="/admin"
            className="w-fit rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
          >
            ← 관리자 홈
          </a>
        </header>

        {/* 저장 완료 */}
        {params.saved === "1" && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            상품 정보가
            저장되었습니다.
          </div>
        )}

        {/* 오류 */}
        {params.error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            상품 저장 중 오류가
            발생했습니다.
          </div>
        )}

        {/* 상품 수 */}
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            등록 상품
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {products.length}개
          </p>
        </section>

        {error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-bold text-red-700">
              상품을 불러오지
              못했습니다.
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error.message}
            </p>
          </section>
        )}

        {!error &&
          products.length ===
            0 && (
            <section className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">
                등록된 상품이
                없습니다.
              </p>
            </section>
          )}

        {/* 상품 목록 */}
        <section className="space-y-5">
          {products.map(
            (product) => (
              <form
                key={
                  product.product_code
                }
                action={
                  updateProduct
                }
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                <input
                  type="hidden"
                  name="product_code"
                  value={
                    product.product_code
                  }
                />

                {/* 상품 상단 */}
                <div className="flex flex-col gap-5 border-b border-gray-100 p-6 md:flex-row md:items-start md:justify-between md:p-8">
                  <div className="flex min-w-0 items-start gap-4">
                    {/* 이미지 */}
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                      {product.thumbnail_url ? (
                        <img
                          src={
                            product.thumbnail_url
                          }
                          alt={
                            product.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          이미지 없음
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                        {
                          product.product_code
                        }
                      </p>

                      <h2 className="mt-1 truncate text-xl font-bold text-gray-900">
                        {
                          product.name
                        }
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-600">
                          {
                            product.category
                          }
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                          {
                            product.product_type
                          }
                        </span>

                        <span
                          className={`rounded-full px-3 py-1.5 ${
                            product.is_visible
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {product.is_visible
                            ? "판매중"
                            : "숨김"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-left md:text-right">
                    <p className="text-xs text-gray-400">
                      현재 판매가
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-600">
                      {product.price.toLocaleString()}
                      원
                    </p>
                  </div>
                </div>

                {/* 편집 영역 */}
                <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8 xl:grid-cols-3">
                  {/* 상품명 */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      상품명
                    </label>

                    <input
                      name="name"
                      defaultValue={
                        product.name
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* 가격 */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      판매가
                    </label>

                    <input
                      name="price"
                      type="number"
                      min="0"
                      defaultValue={
                        product.price
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* 배지 */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      배지
                    </label>

                    <input
                      name="badge"
                      defaultValue={
                        product.badge ??
                        ""
                      }
                      placeholder="카드단말기 / 공부폰 / 효도폰"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* 대표 이미지 */}
                  <div>
                    <ProductImageUploader
                      productCode={product.product_code}
                      currentUrl={product.thumbnail_url ?? ""}
                    />
                  </div>

                  {/* 상세 경로 */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      상세페이지 경로
                    </label>

                    <input
                      name="detail_path"
                      defaultValue={
                        product.detail_path ??
                        ""
                      }
                      placeholder="/front2"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* 정렬 */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      정렬 순서
                    </label>

                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={
                        product.sort_order
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* 네이버 리뷰 수 */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      네이버 리뷰 수
                    </label>

                    <input
                      name="naver_review_count"
                      type="number"
                      min="0"
                      defaultValue={
                        product.naver_review_count
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* 네이버 리뷰 URL */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      네이버 리뷰 URL
                    </label>

                    <input
                      name="naver_review_url"
                      defaultValue={
                        product.naver_review_url ??
                        ""
                      }
                      placeholder="https://smartstore.naver.com/..."
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* 설명 */}
                  <div className="md:col-span-2 xl:col-span-3">
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      짧은 설명
                    </label>

                    <textarea
                      name="short_description"
                      rows={3}
                      defaultValue={
                        product.short_description ??
                        ""
                      }
                      className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* 하단 설정 */}
                <div className="flex flex-col gap-5 border-t border-gray-100 bg-gray-50 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
                  <div className="flex flex-wrap gap-5">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        name="is_visible"
                        defaultChecked={
                          product.is_visible
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm font-semibold text-gray-700">
                        판매 노출
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        name="is_featured"
                        defaultChecked={
                          product.is_featured
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm font-semibold text-gray-700">
                        추천 상품
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
                  >
                    변경사항 저장
                  </button>
                </div>
              </form>
            )
          )}
        </section>
      </div>
    </main>
  );
}