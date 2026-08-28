"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UploadResponse = {
  success: boolean;
  message?: string;
  publicUrl?: string;
};

type CreateResponse = {
  success: boolean;
  message?: string;
  productCode?: string;
  detailPath?: string;
};

async function uploadImage(
  file: File,
  productCode: string,
  imageType: "thumbnail" | "detail"
) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("productCode", productCode);
  formData.append("imageType", imageType);

  const response = await fetch(
    "/api/admin/products/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data =
    (await response.json()) as UploadResponse;

  if (!response.ok || !data.success || !data.publicUrl) {
    throw new Error(
      data.message || "이미지 업로드에 실패했습니다."
    );
  }

  return data.publicUrl;
}

export default function NewProductForm() {
  const router = useRouter();

  const thumbnailRef =
    useRef<HTMLInputElement>(null);

  const detailsRef =
    useRef<HTMLInputElement>(null);

  const [productCode, setProductCode] =
    useState("");

  const [productType, setProductType] =
    useState<"TERMINAL" | "PHONE">("TERMINAL");

  const [name, setName] =
    useState("");

  const [shortDescription, setShortDescription] =
    useState("");

  const [price, setPrice] =
    useState("100");

  const [badge, setBadge] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("0");

  const [
    naverReviewCount,
    setNaverReviewCount,
  ] = useState("0");

  const [
    naverReviewUrl,
    setNaverReviewUrl,
  ] = useState("");

  const [isVisible, setIsVisible] =
    useState(true);

  const [isFeatured, setIsFeatured] =
    useState(false);

  const [
    thumbnailFile,
    setThumbnailFile,
  ] = useState<File | null>(null);

  const [
    thumbnailPreview,
    setThumbnailPreview,
  ] = useState("");

  const [
    detailFiles,
    setDetailFiles,
  ] = useState<File[]>([]);

  const [
    detailPreviews,
    setDetailPreviews,
  ] = useState<string[]>([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const normalizedCode =
    productCode
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-");

  function selectThumbnail(
    file?: File
  ) {
    if (!file) {
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(
      URL.createObjectURL(file)
    );
  }

  function selectDetails(
    fileList: FileList | null
  ) {
    if (!fileList) {
      return;
    }

    const files =
      Array.from(fileList);

    setDetailFiles(files);

    setDetailPreviews(
      files.map((file) =>
        URL.createObjectURL(file)
      )
    );
  }

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (!normalizedCode) {
      setMessage(
        "상품코드를 입력해주세요. 영문/숫자/하이픈을 권장합니다."
      );
      return;
    }

    if (!name.trim()) {
      setMessage(
        "상품명을 입력해주세요."
      );
      return;
    }

    try {
      setSubmitting(true);

      let thumbnailUrl = "";

      if (thumbnailFile) {
        setMessage(
          "대표이미지를 업로드하는 중입니다."
        );

        thumbnailUrl =
          await uploadImage(
            thumbnailFile,
            normalizedCode,
            "thumbnail"
          );
      }

      const detailUrls: string[] = [];

      if (detailFiles.length > 0) {
        for (
          let index = 0;
          index < detailFiles.length;
          index += 1
        ) {
          setMessage(
            `상세이미지 업로드 중 ${
              index + 1
            }/${detailFiles.length}`
          );

          const url =
            await uploadImage(
              detailFiles[index],
              normalizedCode,
              "detail"
            );

          detailUrls.push(url);
        }
      }

      setMessage(
        "상품정보를 저장하는 중입니다."
      );

      const response =
        await fetch(
          "/api/admin/products/create",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              productCode:
                normalizedCode,
              productType,
              name,
              shortDescription,
              price:
                Number(price) || 0,
              badge,
              thumbnailUrl,
              sortOrder:
                Number(sortOrder) || 0,
              naverReviewCount:
                Number(
                  naverReviewCount
                ) || 0,
              naverReviewUrl,
              isVisible,
              isFeatured,
              detailImages:
                detailUrls,
            }),
          }
        );

      const data =
        (await response.json()) as CreateResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "상품 등록에 실패했습니다."
        );
      }

      setMessage(
        "상품 등록이 완료되었습니다."
      );

      router.push(
        "/admin/products?saved=created"
      );
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "상품 등록 중 오류가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6"
    >
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          기본 상품정보
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              상품코드 *
            </label>

            <input
              value={productCode}
              onChange={(event) =>
                setProductCode(
                  event.target.value
                )
              }
              placeholder="예: new-phone-01"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-gray-400">
              실제 코드:{" "}
              {normalizedCode ||
                "-"}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              상품 구분 *
            </label>

            <select
              value={productType}
              onChange={(event) =>
                setProductType(
                  event.target.value as
                    | "TERMINAL"
                    | "PHONE"
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="TERMINAL">
                카드단말기
              </option>

              <option value="PHONE">
                휴대폰
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              상품명 *
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="상품명을 입력해주세요."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              판매가
            </label>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(event) =>
                setPrice(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              배지
            </label>

            <input
              value={badge}
              onChange={(event) =>
                setBadge(
                  event.target.value
                )
              }
              placeholder="공부폰 / 효도폰 / 카드단말기"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              정렬 순서
            </label>

            <input
              type="number"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              네이버 리뷰 수
            </label>

            <input
              type="number"
              min="0"
              value={
                naverReviewCount
              }
              onChange={(event) =>
                setNaverReviewCount(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              네이버 리뷰 URL
            </label>

            <input
              value={naverReviewUrl}
              onChange={(event) =>
                setNaverReviewUrl(
                  event.target.value
                )
              }
              placeholder="https://smartstore.naver.com/..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              짧은 설명
            </label>

            <textarea
              rows={4}
              value={
                shortDescription
              }
              onChange={(event) =>
                setShortDescription(
                  event.target.value
                )
              }
              placeholder="상품 목록과 상세 상단에 표시할 설명"
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          대표 이미지
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          메인, 상품목록, 상세페이지 상단에 사용됩니다.
        </p>

        <input
          ref={thumbnailRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) =>
            selectThumbnail(
              event.target.files?.[0]
            )
          }
        />

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            {thumbnailPreview ? (
              <img
                src={
                  thumbnailPreview
                }
                alt="대표 이미지 미리보기"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">
                이미지 없음
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              thumbnailRef.current?.click()
            }
            className="w-fit rounded-xl border border-blue-600 px-5 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50"
          >
            대표 이미지 선택
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          상세 이미지
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          여러 장을 한 번에 선택할 수 있습니다. 선택 순서대로 상세페이지에 표시됩니다.
        </p>

        <input
          ref={detailsRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) =>
            selectDetails(
              event.target.files
            )
          }
        />

        <button
          type="button"
          onClick={() =>
            detailsRef.current?.click()
          }
          className="mt-5 rounded-xl border border-blue-600 px-5 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50"
        >
          상세 이미지 여러 장 선택
        </button>

        {detailPreviews.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {detailPreviews.map(
              (url, index) => (
                <div
                  key={url}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                >
                  <div className="flex aspect-[4/5] items-center justify-center overflow-hidden">
                    <img
                      src={url}
                      alt={`상세 이미지 ${
                        index + 1
                      }`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="px-3 py-2 text-center text-xs font-bold text-gray-500">
                    {index + 1}번째
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(event) =>
                setIsVisible(
                  event.target.checked
                )
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
              checked={isFeatured}
              onChange={(event) =>
                setIsFeatured(
                  event.target.checked
                )
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-semibold text-gray-700">
              추천 상품
            </span>
          </label>
        </div>

        {message && (
          <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {submitting
            ? "상품 등록 중..."
            : "새 상품 등록"}
        </button>
      </section>
    </form>
  );
}
