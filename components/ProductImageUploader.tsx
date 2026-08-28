"use client";

import { useRef, useState } from "react";

type Props = {
  productCode: string;
  currentUrl: string;
};

type UploadResponse = {
  success: boolean;
  message?: string;
  publicUrl?: string;
};

export default function ProductImageUploader({
  productCode,
  currentUrl,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;

    setMessage("");

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("productCode", productCode);
    formData.append("imageType", "thumbnail");

    try {
      setUploading(true);

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

      setUploadedUrl(data.publicUrl);
      setPreviewUrl(data.publicUrl);
      setMessage("업로드 완료 · 아래 변경사항 저장을 눌러주세요.");
    } catch (error) {
      setPreviewUrl(currentUrl);
      setUploadedUrl(currentUrl);
      setMessage(
        error instanceof Error
          ? error.message
          : "이미지 업로드 중 오류가 발생했습니다."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        대표 이미지
      </label>

      <input
        type="hidden"
        name="thumbnail_url"
        value={uploadedUrl}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="대표 이미지 미리보기"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">
              이미지 없음
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) =>
              handleFile(event.target.files?.[0])
            }
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border border-blue-600 bg-white px-4 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "업로드 중..."
              : "대표 이미지 선택"}
          </button>

          <p className="mt-2 break-all text-xs text-gray-400">
            {uploadedUrl || "업로드된 이미지 없음"}
          </p>

          {message && (
            <p className="mt-2 text-xs font-semibold text-blue-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}