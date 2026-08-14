import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { products, type ProductCode } from "@/lib/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REVIEW_BUCKET = "review-images";
const MAX_REVIEW_IMAGES = 5;
const MAX_REVIEW_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_REVIEW_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type ReviewImage = {
  id: number;
  review_id: number;
  image_url: string;
  sort_order: number;
  created_at: string;
};

type Review = {
  id: number;
  product_code: string;
  product_name: string;
  rating: number;
  author_name: string;
  content: string;
  image_url: string | null;
  is_visible: boolean;
  is_verified_purchase: boolean;
  order_id: number | null;
  order_no: string | null;
  created_at: string;
  updated_at: string;
};

type SearchParams = Promise<{
  category?: string;
  product?: string;
  created?: string;
  updated?: string;
  error?: string;
}>;

function getProductCategory(productCode: string) {
  const product = products[productCode as ProductCode];

  if (!product) {
    return "UNKNOWN";
  }

  return product.productType;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function getReviewFiles(formData: FormData): File[] {
  return formData
    .getAll("images")
    .filter(
      (value): value is File =>
        value instanceof File && value.size > 0
    );
}

function validateReviewFiles(
  files: File[],
  availableSlots = MAX_REVIEW_IMAGES
) {
  if (files.length > availableSlots) {
    throw new Error("TOO_MANY_IMAGES");
  }

  for (const file of files) {
    if (!ALLOWED_REVIEW_IMAGE_TYPES.has(file.type)) {
      throw new Error("INVALID_IMAGE_TYPE");
    }

    if (file.size > MAX_REVIEW_IMAGE_SIZE) {
      throw new Error("IMAGE_TOO_LARGE");
    }
  }
}

function getImageExtension(file: File) {
  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function getStoragePathFromPublicUrl(imageUrl: string) {
  const marker = `/storage/v1/object/public/${REVIEW_BUCKET}/`;
  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const encodedPath = imageUrl.slice(
    markerIndex + marker.length
  );

  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}

async function uploadReviewImages(
  reviewId: number,
  files: File[],
  startingSortOrder = 0
) {
  if (files.length === 0) {
    return;
  }

  const uploadedPaths: string[] = [];
  const rows: Array<{
    review_id: number;
    image_url: string;
    sort_order: number;
  }> = [];

  try {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const extension = getImageExtension(file);

      const storagePath =
        `${reviewId}/${Date.now()}-${index}-${crypto.randomUUID()}.${extension}`;

      const fileBytes = new Uint8Array(
        await file.arrayBuffer()
      );

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from(REVIEW_BUCKET)
          .upload(storagePath, fileBytes, {
            contentType: file.type,
            upsert: false,
          });

      if (uploadError) {
        throw uploadError;
      }

      uploadedPaths.push(storagePath);

      const { data: publicUrlData } =
        supabaseAdmin.storage
          .from(REVIEW_BUCKET)
          .getPublicUrl(storagePath);

      rows.push({
        review_id: reviewId,
        image_url: publicUrlData.publicUrl,
        sort_order: startingSortOrder + index,
      });
    }

    const { error: imageInsertError } =
      await supabaseAdmin
        .from("review_images")
        .insert(rows);

    if (imageInsertError) {
      throw imageInsertError;
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabaseAdmin.storage
        .from(REVIEW_BUCKET)
        .remove(uploadedPaths);
    }

    throw error;
  }
}

function revalidateReviewPages(productCode?: string) {
  revalidatePath("/admin/reviews");
  revalidatePath("/phone");
  revalidatePath("/card-terminal");

  if (!productCode) {
    return;
  }

  if (productCode === "front2") {
    revalidatePath("/front2");
  }

  if (productCode === "front2-printer") {
    revalidatePath("/front2-printer");
  }

  if (productCode === "front2-terminal2") {
    revalidatePath("/front2-terminal2");
  }

  if (productCode === "wireless") {
    revalidatePath("/wireless");
  }

  if (productCode === "a175-study") {
    revalidatePath("/phone/a175-study");
  }

  if (productCode === "a175") {
    revalidatePath("/phone/a175");
  }

  if (productCode === "m140") {
    revalidatePath("/phone/m140");
  }

  if (productCode === "aroot-a1") {
    revalidatePath("/phone/aroot-a1");
  }
}

/* =========================
   리뷰 등록
========================= */

async function createReview(formData: FormData) {
  "use server";

  const productCode = String(
    formData.get("productCode") ?? ""
  ).trim();

  const rating = Number(formData.get("rating"));

  const authorName = String(
    formData.get("authorName") ?? ""
  ).trim();

  const content = String(
    formData.get("content") ?? ""
  ).trim();

  const files = getReviewFiles(formData);

  const product =
    products[productCode as ProductCode];

  if (!product) {
    redirect("/admin/reviews?error=invalid-product");
  }

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    redirect("/admin/reviews?error=invalid-rating");
  }

  if (!authorName || !content) {
    redirect("/admin/reviews?error=missing-fields");
  }

  try {
    validateReviewFiles(files);
  } catch (error) {
    const code =
      error instanceof Error
        ? error.message
        : "image-error";

    redirect(
      `/admin/reviews?error=${encodeURIComponent(code)}`
    );
  }

  const {
    data: createdReview,
    error: reviewInsertError,
  } = await supabaseAdmin
    .from("reviews")
    .insert({
      product_code: productCode,
      product_name: product.name,
      rating,
      author_name: authorName,
      content,
      image_url: null,
      is_visible: true,
      is_verified_purchase: false,
      order_id: null,
      order_no: null,
    })
    .select("id")
    .single();

  if (reviewInsertError || !createdReview) {
    console.error(
      "Review insert error:",
      reviewInsertError
    );

    redirect("/admin/reviews?error=create-failed");
  }

  try {
    await uploadReviewImages(
      createdReview.id,
      files
    );
  } catch (error) {
    console.error(
      "Review image upload error:",
      error
    );

    await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", createdReview.id);

    redirect(
      "/admin/reviews?error=image-upload-failed"
    );
  }

  revalidateReviewPages(productCode);

  redirect("/admin/reviews?created=1");
}

/* =========================
   리뷰 수정
========================= */

async function updateReview(formData: FormData) {
  "use server";

  const reviewId = Number(
    formData.get("reviewId")
  );

  const productCode = String(
    formData.get("productCode") ?? ""
  ).trim();

  const rating = Number(
    formData.get("rating")
  );

  const authorName = String(
    formData.get("authorName") ?? ""
  ).trim();

  const content = String(
    formData.get("content") ?? ""
  ).trim();

  const files = getReviewFiles(formData);

  const product =
    products[productCode as ProductCode];

  if (
    !Number.isInteger(reviewId) ||
    !product ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    !authorName ||
    !content
  ) {
    redirect("/admin/reviews?error=update-invalid");
  }

  const {
    count: existingImageCount,
    error: imageCountError,
  } = await supabaseAdmin
    .from("review_images")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("review_id", reviewId);

  if (imageCountError) {
    console.error(
      "Review image count error:",
      imageCountError
    );

    redirect(
      "/admin/reviews?error=image-count-failed"
    );
  }

  const currentImageCount =
    existingImageCount ?? 0;

  try {
    validateReviewFiles(
      files,
      Math.max(
        0,
        MAX_REVIEW_IMAGES - currentImageCount
      )
    );
  } catch (error) {
    const code =
      error instanceof Error
        ? error.message
        : "image-error";

    redirect(
      `/admin/reviews?error=${encodeURIComponent(code)}`
    );
  }

  const { error } = await supabaseAdmin
    .from("reviews")
    .update({
      product_code: productCode,
      product_name: product.name,
      rating,
      author_name: authorName,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    console.error(
      "Review update error:",
      error
    );

    redirect(
      "/admin/reviews?error=update-failed"
    );
  }

  if (files.length > 0) {
    try {
      await uploadReviewImages(
        reviewId,
        files,
        currentImageCount
      );
    } catch (uploadError) {
      console.error(
        "Review image add error:",
        uploadError
      );

      redirect(
        "/admin/reviews?error=image-upload-failed"
      );
    }
  }

  revalidateReviewPages(productCode);

  redirect("/admin/reviews?updated=1");
}

/* =========================
   노출 / 숨김
========================= */

async function toggleReviewVisibility(
  formData: FormData
) {
  "use server";

  const reviewId = Number(
    formData.get("reviewId")
  );

  const productCode = String(
    formData.get("productCode") ?? ""
  );

  const currentVisible =
    String(
      formData.get("currentVisible")
    ) === "true";

  if (!Number.isInteger(reviewId)) {
    redirect("/admin/reviews");
  }

  const { error } = await supabaseAdmin
    .from("reviews")
    .update({
      is_visible: !currentVisible,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    console.error(
      "Review visibility update error:",
      error
    );

    redirect(
      "/admin/reviews?error=visibility-failed"
    );
  }

  revalidateReviewPages(productCode);

  redirect("/admin/reviews");
}

/* =========================
   리뷰 사진 삭제
========================= */

async function deleteReviewImage(
  formData: FormData
) {
  "use server";

  const imageId = Number(
    formData.get("imageId")
  );

  const reviewId = Number(
    formData.get("reviewId")
  );

  const productCode = String(
    formData.get("productCode") ?? ""
  );

  if (
    !Number.isInteger(imageId) ||
    !Number.isInteger(reviewId)
  ) {
    redirect("/admin/reviews");
  }

  const {
    data: image,
    error: imageFindError,
  } = await supabaseAdmin
    .from("review_images")
    .select("id, image_url")
    .eq("id", imageId)
    .eq("review_id", reviewId)
    .maybeSingle();

  if (imageFindError || !image) {
    console.error(
      "Review image lookup error:",
      imageFindError
    );

    redirect(
      "/admin/reviews?error=image-not-found"
    );
  }

  const storagePath =
    getStoragePathFromPublicUrl(
      image.image_url
    );

  if (storagePath) {
    const { error: storageDeleteError } =
      await supabaseAdmin.storage
        .from(REVIEW_BUCKET)
        .remove([storagePath]);

    if (storageDeleteError) {
      console.error(
        "Review storage image delete error:",
        storageDeleteError
      );

      redirect(
        "/admin/reviews?error=image-delete-failed"
      );
    }
  }

  const { error: imageDeleteError } =
    await supabaseAdmin
      .from("review_images")
      .delete()
      .eq("id", imageId)
      .eq("review_id", reviewId);

  if (imageDeleteError) {
    console.error(
      "Review image row delete error:",
      imageDeleteError
    );

    redirect(
      "/admin/reviews?error=image-delete-failed"
    );
  }

  revalidateReviewPages(productCode);

  redirect("/admin/reviews");
}

/* =========================
   리뷰 삭제
========================= */

async function deleteReview(
  formData: FormData
) {
  "use server";

  const reviewId = Number(
    formData.get("reviewId")
  );

  const productCode = String(
    formData.get("productCode") ?? ""
  );

  if (!Number.isInteger(reviewId)) {
    redirect("/admin/reviews");
  }

  const {
    data: reviewImages,
    error: reviewImagesError,
  } = await supabaseAdmin
    .from("review_images")
    .select("image_url")
    .eq("review_id", reviewId);

  if (reviewImagesError) {
    console.error(
      "Review images lookup error:",
      reviewImagesError
    );
  }

  const storagePaths =
    (reviewImages ?? [])
      .map((image) =>
        getStoragePathFromPublicUrl(
          image.image_url
        )
      )
      .filter(
        (value): value is string =>
          Boolean(value)
      );

  if (storagePaths.length > 0) {
    const { error: storageDeleteError } =
      await supabaseAdmin.storage
        .from(REVIEW_BUCKET)
        .remove(storagePaths);

    if (storageDeleteError) {
      console.error(
        "Review storage cleanup error:",
        storageDeleteError
      );
    }
  }

  const { error } = await supabaseAdmin
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    console.error(
      "Review delete error:",
      error
    );

    redirect(
      "/admin/reviews?error=delete-failed"
    );
  }

  revalidateReviewPages(productCode);

  redirect("/admin/reviews");
}

/* =========================
   PAGE
========================= */

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const selectedCategory =
    params.category ?? "ALL";

  const selectedProduct =
    params.product ?? "ALL";

  const {
    data: reviewData,
    error: reviewError,
  } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (reviewError) {
    console.error(
      "Reviews load error:",
      reviewError
    );
  }

  const reviews =
    (reviewData ?? []) as Review[];

  const {
    data: reviewImageData,
    error: reviewImageError,
  } = await supabaseAdmin
    .from("review_images")
    .select(
      "id, review_id, image_url, sort_order, created_at"
    )
    .order("sort_order", {
      ascending: true,
    });

  if (reviewImageError) {
    console.error(
      "Review images load error:",
      reviewImageError
    );
  }

  const reviewImages =
    (reviewImageData ?? []) as ReviewImage[];

  const reviewImagesByReview =
    new Map<number, ReviewImage[]>();

  for (const image of reviewImages) {
    const current =
      reviewImagesByReview.get(
        image.review_id
      ) ?? [];

    current.push(image);

    reviewImagesByReview.set(
      image.review_id,
      current
    );
  }

  const filteredReviews =
    reviews.filter((review) => {
      const category =
        getProductCategory(
          review.product_code
        );

      if (
        selectedCategory !== "ALL" &&
        category !== selectedCategory
      ) {
        return false;
      }

      if (
        selectedProduct !== "ALL" &&
        review.product_code !==
          selectedProduct
      ) {
        return false;
      }

      return true;
    });

  const totalCount = reviews.length;

  const visibleCount = reviews.filter(
    (review) => review.is_visible
  ).length;

  const hiddenCount =
    totalCount - visibleCount;

  const phoneCount = reviews.filter(
    (review) =>
      getProductCategory(
        review.product_code
      ) === "PHONE"
  ).length;

  const terminalCount = reviews.filter(
    (review) =>
      getProductCategory(
        review.product_code
      ) === "TERMINAL"
  ).length;

  const averageRating =
    totalCount > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / totalCount
        ).toFixed(1)
      : "0.0";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-5 py-10">
        {/* 상단 */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-semibold text-blue-600">
              사장님찬스 관리자
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              리뷰관리
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              상품별 리뷰를 등록하고 수정·노출·삭제할 수 있습니다.
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/admin"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700"
            >
              관리자 홈
            </a>

            <a
              href="/"
              target="_blank"
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              사이트 보기
            </a>
          </div>
        </div>

        {/* 알림 */}
        {params.created === "1" && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            리뷰가 등록되었습니다.
          </div>
        )}

        {params.updated === "1" && (
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            리뷰가 수정되었습니다.
          </div>
        )}

        {params.error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {params.error === "TOO_MANY_IMAGES"
              ? "리뷰 사진은 최대 5장까지 등록할 수 있습니다."
              : params.error === "INVALID_IMAGE_TYPE"
                ? "리뷰 사진은 JPG, PNG, WEBP 파일만 등록할 수 있습니다."
                : params.error === "IMAGE_TOO_LARGE"
                  ? "리뷰 사진은 장당 5MB 이하만 등록할 수 있습니다."
                  : params.error === "image-upload-failed"
                    ? "리뷰 사진 업로드 중 오류가 발생했습니다."
                    : "리뷰 처리 중 오류가 발생했습니다."}
          </div>
        )}

        {/* 통계 */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              전체 리뷰
            </p>
            <p className="mt-2 text-3xl font-bold">
              {totalCount}개
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              평균 별점
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-500">
              ★ {averageRating}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              노출중
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {visibleCount}개
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              카드단말기
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {terminalCount}개
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              휴대폰
            </p>
            <p className="mt-2 text-3xl font-bold text-violet-600">
              {phoneCount}개
            </p>
          </div>
        </section>

        {/* 리뷰 등록 */}
        <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-bold text-blue-600">
            리뷰 등록
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            새 리뷰 추가
          </h2>

          <form
            action={createReview}
            className="mt-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  상품
                </label>

                <select
                  name="productCode"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                >
                  <option value="" disabled>
                    상품을 선택해주세요
                  </option>

                  <optgroup label="카드단말기">
                    {Object.entries(products)
                      .filter(
                        ([, product]) =>
                          product.productType ===
                          "TERMINAL"
                      )
                      .map(([code, product]) => (
                        <option
                          key={code}
                          value={code}
                        >
                          {product.name}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="휴대폰">
                    {Object.entries(products)
                      .filter(
                        ([, product]) =>
                          product.productType ===
                          "PHONE"
                      )
                      .map(([code, product]) => (
                        <option
                          key={code}
                          value={code}
                        >
                          {product.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  별점
                </label>

                <select
                  name="rating"
                  defaultValue="5"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                >
                  <option value="5">
                    ★★★★★ 5점
                  </option>
                  <option value="4">
                    ★★★★☆ 4점
                  </option>
                  <option value="3">
                    ★★★☆☆ 3점
                  </option>
                  <option value="2">
                    ★★☆☆☆ 2점
                  </option>
                  <option value="1">
                    ★☆☆☆☆ 1점
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  작성자
                </label>

                <input
                  name="authorName"
                  required
                  placeholder="예: 김**"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  리뷰 내용
                </label>

                <textarea
                  name="content"
                  required
                  rows={5}
                  placeholder="리뷰 내용을 입력해주세요."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  리뷰 사진
                </label>

                <input
                  type="file"
                  name="images"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  최대 5장 · JPG, PNG, WEBP · 장당 5MB 이하
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700"
            >
              리뷰 등록
            </button>
          </form>
        </section>

        {/* 필터 */}
        <section className="mt-8 rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/reviews"
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                selectedCategory === "ALL" &&
                selectedProduct === "ALL"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              전체 {totalCount}
            </a>

            <a
              href="/admin/reviews?category=TERMINAL"
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                selectedCategory === "TERMINAL"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              카드단말기 {terminalCount}
            </a>

            <a
              href="/admin/reviews?category=PHONE"
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                selectedCategory === "PHONE"
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              휴대폰 {phoneCount}
            </a>

            {Object.entries(products).map(
              ([code, product]) => (
                <a
                  key={code}
                  href={`/admin/reviews?product=${code}`}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                    selectedProduct === code
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {product.name}
                </a>
              )
            )}
          </div>
        </section>

        {/* 리뷰 목록 */}
        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                등록된 리뷰
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                현재 조건에 {filteredReviews.length}개의 리뷰가 있습니다.
              </p>
            </div>

            {hiddenCount > 0 && (
              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                숨김 {hiddenCount}
              </span>
            )}
          </div>

          {filteredReviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
              <p className="font-bold text-gray-700">
                등록된 리뷰가 없습니다.
              </p>

              <p className="mt-2 text-sm text-gray-400">
                위에서 첫 리뷰를 등록해보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredReviews.map((review) => (
                <article
                  key={review.id}
                  className={`rounded-3xl border bg-white p-6 shadow-sm ${
                    review.is_visible
                      ? ""
                      : "opacity-60"
                  }`}
                >
                  {/* 리뷰 상단 */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-amber-500">
                          {renderStars(review.rating)}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            review.is_visible
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {review.is_visible
                            ? "노출중"
                            : "숨김"}
                        </span>

                        {review.is_verified_purchase && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                            구매확인
                          </span>
                        )}
                      </div>

                      <p className="mt-3 font-bold text-gray-900">
                        {review.product_name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {review.author_name} ·{" "}
                        {formatDate(review.created_at)}
                      </p>
                    </div>

                    {/* 노출 / 삭제 */}
                    <div className="flex gap-2">
                      <form
                        action={
                          toggleReviewVisibility
                        }
                      >
                        <input
                          type="hidden"
                          name="reviewId"
                          value={review.id}
                        />

                        <input
                          type="hidden"
                          name="productCode"
                          value={
                            review.product_code
                          }
                        />

                        <input
                          type="hidden"
                          name="currentVisible"
                          value={String(
                            review.is_visible
                          )}
                        />

                        <button
                          type="submit"
                          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                        >
                          {review.is_visible
                            ? "숨김"
                            : "노출"}
                        </button>
                      </form>

                      <form action={deleteReview}>
                        <input
                          type="hidden"
                          name="reviewId"
                          value={review.id}
                        />

                        <input
                          type="hidden"
                          name="productCode"
                          value={
                            review.product_code
                          }
                        />

                        <button
                          type="submit"
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                        >
                          삭제
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* 리뷰 내용 */}
                  <div className="mt-5 rounded-2xl bg-gray-50 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                      {review.content}
                    </p>
                  </div>

                  {/* 리뷰 사진 */}
                  {(reviewImagesByReview.get(review.id) ?? []).length > 0 && (
                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-700">
                          리뷰 사진
                        </p>

                        <span className="text-xs font-medium text-gray-400">
                          {(reviewImagesByReview.get(review.id) ?? []).length}장
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {(reviewImagesByReview.get(review.id) ?? []).map(
                          (image) => (
                            <div
                              key={image.id}
                              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                            >
                              <img
                                src={image.image_url}
                                alt={`${review.product_name} 리뷰 사진`}
                                className="aspect-square w-full object-cover"
                              />

                              <form
                                action={deleteReviewImage}
                                className="p-2"
                              >
                                <input
                                  type="hidden"
                                  name="imageId"
                                  value={image.id}
                                />

                                <input
                                  type="hidden"
                                  name="reviewId"
                                  value={review.id}
                                />

                                <input
                                  type="hidden"
                                  name="productCode"
                                  value={review.product_code}
                                />

                                <button
                                  type="submit"
                                  className="w-full rounded-lg bg-red-50 px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                                >
                                  사진 삭제
                                </button>
                              </form>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* 수정 폼 */}
                  <details className="mt-5">
                    <summary className="cursor-pointer text-sm font-bold text-blue-600">
                      리뷰 수정하기
                    </summary>

                    <form
                      action={updateReview}
                      className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5"
                    >
                      <input
                        type="hidden"
                        name="reviewId"
                        value={review.id}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-bold text-gray-600">
                            상품
                          </label>

                          <select
                            name="productCode"
                            defaultValue={
                              review.product_code
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
                          >
                            {Object.entries(
                              products
                            ).map(
                              ([code, product]) => (
                                <option
                                  key={code}
                                  value={code}
                                >
                                  {product.name}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold text-gray-600">
                            별점
                          </label>

                          <select
                            name="rating"
                            defaultValue={
                              review.rating
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
                          >
                            <option value="5">
                              ★★★★★ 5점
                            </option>
                            <option value="4">
                              ★★★★☆ 4점
                            </option>
                            <option value="3">
                              ★★★☆☆ 3점
                            </option>
                            <option value="2">
                              ★★☆☆☆ 2점
                            </option>
                            <option value="1">
                              ★☆☆☆☆ 1점
                            </option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-xs font-bold text-gray-600">
                            작성자
                          </label>

                          <input
                            name="authorName"
                            defaultValue={
                              review.author_name
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-xs font-bold text-gray-600">
                            내용
                          </label>

                          <textarea
                            name="content"
                            defaultValue={
                              review.content
                            }
                            rows={4}
                            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-xs font-bold text-gray-600">
                            사진 추가
                          </label>

                          <input
                            type="file"
                            name="images"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
                          />

                          <p className="mt-2 text-xs leading-5 text-gray-400">
                            현재 {(reviewImagesByReview.get(review.id) ?? []).length}장 ·
                            최대 5장까지 가능합니다.
                          </p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                      >
                        수정내용 저장
                      </button>
                    </form>
                  </details>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}