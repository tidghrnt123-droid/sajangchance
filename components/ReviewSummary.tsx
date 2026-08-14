import { supabaseServer } from "@/lib/supabaseServer";

type ReviewSummaryProps = {
  productCode: string;
  href?: string;
  naverReviewCount?: number;
  naverReviewUrl?: string;
};

export default async function ReviewSummary({
  productCode,
  href = "#reviews",
  naverReviewCount,
  naverReviewUrl,
}: ReviewSummaryProps) {
  const { data, error } = await supabaseServer
    .from("reviews")
    .select("rating")
    .eq("product_code", productCode)
    .eq("is_visible", true);

  if (error) {
    console.error(
      "ReviewSummary load error:",
      error
    );

    return null;
  }

  const reviews = data ?? [];

  if (
    reviews.length === 0 &&
    !naverReviewCount
  ) {
    return null;
  }

  const average =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) =>
            sum + Number(review.rating),
          0
        ) / reviews.length
      : 0;

  return (
    <div className="mt-5 flex w-fit flex-wrap items-center gap-2 text-sm">
      {/* 자사몰 평점 / 리뷰 */}
      {reviews.length > 0 && (
        <>
          <a
            href={href}
            className="flex items-center gap-2 transition hover:opacity-70"
          >
            <span className="font-bold text-amber-500">
              ★ {average.toFixed(1)}
            </span>

            <span className="text-gray-300">
              |
            </span>

            <span className="font-semibold text-gray-600">
              리뷰 {reviews.length}개
            </span>

            <span className="text-gray-400">
              ›
            </span>
          </a>
        </>
      )}

      {/* 네이버 리뷰 */}
      {naverReviewCount !== undefined &&
        naverReviewUrl && (
          <>
            {reviews.length > 0 && (
              <span className="text-gray-300">
                |
              </span>
            )}

            <a
              href={naverReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-green-600 transition hover:text-green-700"
            >
              네이버 리뷰 {naverReviewCount}개 ›
            </a>
          </>
        )}
    </div>
  );
}