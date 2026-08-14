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
};

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

export default async function ReviewSection({
  productCode,
  naverReviewUrl,
}: ReviewSectionProps) {
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
    });

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
   * 리뷰가 없어도 네이버 리뷰 버튼이 있다면
   * 리뷰 영역 자체는 표시
   */
  if (reviews.length === 0) {
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

  const reviewIds =
    reviews.map((review) => review.id);

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

  const reviewImages =
    (imageData ?? []) as ReviewImage[];

  const imagesByReview =
    new Map<number, ReviewImage[]>();

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

  const averageRating =
    reviews.reduce(
      (sum, review) =>
        sum + review.rating,
      0
    ) / reviews.length;

  return (
    <section
      id="reviews"
      className="scroll-mt-32 border-t bg-gray-50"
    >
      <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        {/* 리뷰 요약 */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* 왼쪽 */}
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

              {/* 네이버 리뷰 */}
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

            {/* 평점 */}
            <div className="rounded-2xl bg-gray-50 px-7 py-5 text-center">
              <p className="text-4xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>

              <p className="mt-1 text-lg tracking-wide text-amber-400">
                ★★★★★
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                리뷰 {reviews.length}개
              </p>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className="mt-6 space-y-4">
          {reviews.map((review) => {
            const images =
              imagesByReview.get(
                review.id
              ) ?? [];

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
      </div>
    </section>
  );
}