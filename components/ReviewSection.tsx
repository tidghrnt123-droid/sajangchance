import { supabaseServer } from "@/lib/supabaseServer";

type ReviewImage = {
  id: number;
  review_id: number;
  image_url: string;
  sort_order: number;
};

type Review = {
  id: number;
  product_code: string;
  product_name: string;
  rating: number;
  author_name: string;
  content: string;
  is_visible: boolean;
  is_verified_purchase: boolean;
  created_at: string;
};

type ReviewSectionProps = {
  productCode: string;
  naverReviewUrl?: string;
  reviewPage?: number;
};

const REVIEWS_PER_PAGE = 10;

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
) {
  const maxVisible = 5;

  let start = Math.max(
    1,
    currentPage - 2
  );

  let end = Math.min(
    totalPages,
    start + maxVisible - 1
  );

  if (end - start < maxVisible - 1) {
    start = Math.max(
      1,
      end - maxVisible + 1
    );
  }

  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  );
}

export default async function ReviewSection({
  productCode,
  naverReviewUrl,
  reviewPage = 1,
}: ReviewSectionProps) {
  /*
   * 전체 리뷰 개수 조회
   */
  const {
    count: totalCount,
    error: countError,
  } = await supabaseServer
    .from("reviews")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("product_code", productCode)
    .eq("is_visible", true);

  if (countError) {
    console.error(
      "ReviewSection count load error:",
      countError
    );

    return null;
  }

  const reviewCount = totalCount ?? 0;

  /*
   * 리뷰가 없는 경우
   */
  if (reviewCount === 0) {
    return (
      <section
        id="reviews"
        className="scroll-mt-32 border-t bg-gray-50"
      >
        <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-blue-600">
                  REVIEW
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                  구매 고객 리뷰
                </h2>

                <p className="mt-3 text-sm text-gray-500">
                  아직 자사몰에 등록된 리뷰가 없습니다.
                </p>
              </div>

              {naverReviewUrl && (
                <a
                  href={naverReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center justify-center rounded-xl border border-green-500 bg-white px-5 py-3 text-sm font-bold text-green-600 transition hover:bg-green-50"
                >
                  네이버 리뷰 보기 ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /*
   * 전체 평균 평점 계산용
   */
  const {
    data: allRatingData,
    error: ratingError,
  } = await supabaseServer
    .from("reviews")
    .select("rating")
    .eq("product_code", productCode)
    .eq("is_visible", true);

  if (ratingError) {
    console.error(
      "ReviewSection rating load error:",
      ratingError
    );
  }

  const ratingRows =
    (allRatingData ?? []) as {
      rating: number;
    }[];

  const averageRating =
    ratingRows.length > 0
      ? ratingRows.reduce(
          (sum, review) =>
            sum + review.rating,
          0
        ) / ratingRows.length
      : 0;

  /*
   * 페이지 계산
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      reviewCount / REVIEWS_PER_PAGE
    )
  );

  const safePage = Math.min(
    Math.max(reviewPage, 1),
    totalPages
  );

  const from =
    (safePage - 1) *
    REVIEWS_PER_PAGE;

  const to =
    from +
    REVIEWS_PER_PAGE -
    1;

  /*
   * 현재 페이지 리뷰 10개만 조회
   */
  const {
    data: reviewData,
    error: reviewError,
  } = await supabaseServer
    .from("reviews")
    .select(
      `
        id,
        product_code,
        product_name,
        rating,
        author_name,
        content,
        is_visible,
        is_verified_purchase,
        created_at
      `
    )
    .eq("product_code", productCode)
    .eq("is_visible", true)
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (reviewError) {
    console.error(
      "ReviewSection review load error:",
      reviewError
    );

    return null;
  }

  const reviews =
    (reviewData ?? []) as Review[];

  /*
   * 현재 페이지 리뷰 이미지 조회
   */
  const reviewIds =
    reviews.map(
      (review) => review.id
    );

  let reviewImages: ReviewImage[] = [];

  if (reviewIds.length > 0) {
    const {
      data: imageData,
      error: imageError,
    } = await supabaseServer
      .from("review_images")
      .select(
        `
          id,
          review_id,
          image_url,
          sort_order
        `
      )
      .in("review_id", reviewIds)
      .order("sort_order", {
        ascending: true,
      });

    if (imageError) {
      console.error(
        "ReviewSection image load error:",
        imageError
      );
    }

    reviewImages =
      ((imageData ?? []) as ReviewImage[])
        .filter(
          (image) =>
            image.image_url &&
            image.image_url.trim() !== ""
        );
  }

  /*
   * 리뷰별 이미지 정리
   */
  const imagesByReview =
    new Map<
      number,
      ReviewImage[]
    >();

  for (const image of reviewImages) {
    const current =
      imagesByReview.get(
        image.review_id
      ) ?? [];

    current.push(image);

    imagesByReview.set(
      image.review_id,
      current
    );
  }

  const pageNumbers =
    getPageNumbers(
      safePage,
      totalPages
    );

  return (
    <section
      id="reviews"
      className="scroll-mt-32 border-t bg-gray-50"
    >
      <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        {/* 리뷰 요약 */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">
                REVIEW
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                구매 고객 리뷰
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                상품을 이용한 고객의 후기를 확인해보세요.
              </p>

              {naverReviewUrl && (
                <a
                  href={naverReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-xl border border-green-500 bg-white px-5 py-3 text-sm font-bold text-green-600 transition hover:bg-green-50"
                >
                  네이버 리뷰 보기 ↗
                </a>
              )}
            </div>

            {/* 전체 평균 */}
            <div className="rounded-2xl bg-gray-50 px-7 py-5 text-center">
              <p className="text-4xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>

              <p className="mt-1 text-lg tracking-wide text-amber-400">
                ★★★★★
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                리뷰 {reviewCount}개
              </p>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className="mt-6 space-y-4">
          {reviews.map((review) => {
            const images =
              (
                imagesByReview.get(
                  review.id
                ) ?? []
              ).filter(
                (image) =>
                  image.image_url &&
                  image.image_url.trim() !== ""
              );

            return (
              <article
                key={review.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
              >
                {/* 리뷰 상단 */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold tracking-wide text-amber-400">
                        {renderStars(
                          review.rating
                        )}
                      </span>

                      {review.is_verified_purchase && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                          구매확인
                        </span>
                      )}
                    </div>

                    <p className="mt-3 font-bold text-gray-900">
                      {review.author_name}
                    </p>
                  </div>

                  <p className="text-sm text-gray-400">
                    {formatDate(
                      review.created_at
                    )}
                  </p>
                </div>

                {/* 리뷰 내용 */}
                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-700 md:text-base">
                  {review.content}
                </p>

                {/* 리뷰 사진 */}
                {images.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {images.map(
                      (image) => (
                        <a
                          key={image.id}
                          href={
                            image.image_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                        >
                          <img
                            src={
                              image.image_url
                            }
                            alt={`${review.product_name} 리뷰 사진`}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </a>
                      )
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {safePage > 1 ? (
                <a
                  href={`?reviewPage=${
                    safePage - 1
                  }#reviews`}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  이전
                </a>
              ) : (
                <span className="cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-300">
                  이전
                </span>
              )}

              {pageNumbers.map(
                (page) => (
                  <a
                    key={page}
                    href={`?reviewPage=${page}#reviews`}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-bold transition ${
                      safePage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </a>
                )
              )}

              {safePage <
              totalPages ? (
                <a
                  href={`?reviewPage=${
                    safePage + 1
                  }#reviews`}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  다음
                </a>
              ) : (
                <span className="cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-300">
                  다음
                </span>
              )}
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              {safePage} /{" "}
              {totalPages} 페이지
            </p>
          </div>
        )}
      </div>
    </section>
  );
}