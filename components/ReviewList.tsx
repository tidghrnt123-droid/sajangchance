"use client";

import { useState } from "react";
import ReviewImage from "@/components/ReviewImage";

type ReviewImageType = {
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

type Props = {
  reviews: Review[];
  images: ReviewImageType[];
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

export default function ReviewList({
  reviews,
  images,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    reviews.length / REVIEWS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * REVIEWS_PER_PAGE;

  const currentReviews = reviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE
  );

  const changePage = (page: number) => {
    setCurrentPage(page);

    setTimeout(() => {
      document
        .getElementById("reviews")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const getPageNumbers = () => {
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
  };

  return (
    <>
      {/* 리뷰 목록 */}
      <div className="mt-6 space-y-4">
        {currentReviews.map((review) => {
          const reviewImages = images.filter(
            (image) =>
              image.review_id === review.id &&
              image.image_url &&
              image.image_url.trim() !== ""
          );

          return (
            <article
              key={review.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-bold tracking-wide text-amber-400">
                      {renderStars(review.rating)}
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
                  {formatDate(review.created_at)}
                </p>
              </div>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-700 md:text-base">
                {review.content}
              </p>

              {reviewImages.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {reviewImages.map((image) => (
                    <ReviewImage
                      key={image.id}
                      src={image.image_url}
                      alt={`${review.product_name} 리뷰 사진`}
                    />
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              changePage(currentPage - 1)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            이전
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => changePage(page)}
              className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              changePage(currentPage + 1)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            다음
          </button>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-gray-400">
        {currentPage} / {totalPages} 페이지
      </p>
    </>
  );
}