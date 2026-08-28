import {
  NextRequest,
  NextResponse,
} from "next/server";

import { cookies } from "next/headers";

import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const BUCKET_NAME =
  "product-images";

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

function sanitizeValue(
  value: string
) {
  return value
    .trim()
    .replace(
      /[^a-zA-Z0-9-_]/g,
      "-"
    );
}

function getExtension(
  file: File
) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  if (extension) {
    return extension;
  }

  switch (file.type) {
    case "image/jpeg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "image/gif":
      return "gif";

    default:
      return "bin";
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ================================
     * 관리자 인증
     * ================================
     */
    const cookieStore =
      await cookies();

    const sessionToken =
      cookieStore
        .get(
          getAdminSessionCookieName()
        )
        ?.value;

    if (
      !verifyAdminSessionToken(
        sessionToken
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "관리자 로그인이 필요합니다.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ================================
     * FormData
     * ================================
     */
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const productCodeValue =
      formData.get(
        "productCode"
      );

    const imageTypeValue =
      formData.get(
        "imageType"
      );

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "업로드할 이미지가 없습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const productCode =
      typeof productCodeValue ===
      "string"
        ? sanitizeValue(
            productCodeValue
          )
        : "";

    const imageType =
      imageTypeValue ===
      "thumbnail"
        ? "thumbnail"
        : imageTypeValue ===
            "detail"
          ? "detail"
          : "";

    /*
     * ================================
     * 입력 검증
     * ================================
     */
    if (!productCode) {
      return NextResponse.json(
        {
          success: false,
          message:
            "상품코드가 필요합니다.",
        },
        {
          status: 400,
        }
      );
    }

    if (!imageType) {
      return NextResponse.json(
        {
          success: false,
          message:
            "이미지 유형이 올바르지 않습니다.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "이미지 용량은 10MB 이하만 가능합니다.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ================================
     * 저장 경로 생성
     *
     * product-images/
     *   front2/
     *     thumbnail/
     *     detail/
     * ================================
     */
    const extension =
      getExtension(file);

    const uniqueName =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const storagePath =
      `${productCode}/${imageType}/${uniqueName}`;

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    /*
     * ================================
     * Supabase Storage 업로드
     * ================================
     */
    const {
      data: uploadData,
      error: uploadError,
    } =
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(
          storagePath,
          buffer,
          {
            contentType:
              file.type,

            cacheControl:
              "3600",

            upsert:
              false,
          }
        );

    if (uploadError) {
      console.error(
        "Product image upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "이미지 업로드 중 오류가 발생했습니다.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ================================
     * Public URL
     * ================================
     */
    const {
      data: publicUrlData,
    } =
      supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(
          uploadData.path
        );

    const publicUrl =
      publicUrlData.publicUrl;

    return NextResponse.json({
      success: true,

      path:
        uploadData.path,

      publicUrl,

      productCode,

      imageType,
    });
  } catch (error) {
    console.error(
      "Product image upload API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "이미지 업로드 처리 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}