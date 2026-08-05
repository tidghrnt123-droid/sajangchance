import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const SHIPPING_STATUSES = [
  "결제완료",
  "가맹 접수대기",
  "가맹 심사중",
  "배송준비",
  "배송중",
  "배송완료",
] as const;

const COURIERS = [
  "",
  "CJ대한통운",
  "한진택배",
  "롯데택배",
  "우체국택배",
  "로젠택배",
  "경동택배",
  "대신택배",
  "기타",
] as const;

type ShippingStatus = (typeof SHIPPING_STATUSES)[number];

type Order = {
  id: number;
  order_no: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string | null;
  business_name: string | null;
  delivery_address: string | null;
  request_note: string | null;
  admin_note: string | null;
  product_code: string;
  product_name: string;
  amount: number;
  payment_status: string;
  shipping_status: ShippingStatus;
  courier: string | null;
  tracking_number: string | null;
  tid: string | null;
  result_code: string | null;
  result_message: string | null;
  created_at: string;
  approved_at: string | null;
  updated_at: string | null;
};

function formatDate(date: string | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
}

function getPaymentStatusLabel(status: string) {
  switch (status) {
    case "PAID":
      return "결제완료";

    case "PENDING":
      return "결제대기";

    case "FAILED":
      return "결제실패";

    case "CANCELLED":
      return "주문취소";

    case "REFUNDED":
      return "환불완료";

    default:
      return status;
  }
}

function getPaymentStatusClass(status: string) {
  switch (status) {
    case "PAID":
      return "border-green-200 bg-green-50 text-green-700";

    case "PENDING":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";

    case "FAILED":
      return "border-red-200 bg-red-50 text-red-700";

    case "CANCELLED":
    case "REFUNDED":
      return "border-gray-200 bg-gray-100 text-gray-700";

    default:
      return "border-gray-200 bg-gray-100 text-gray-700";
  }
}

/**
 * 관리자 메모 저장
 */
async function updateAdminNote(formData: FormData) {
  "use server";

  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

  const orderId = Number(formData.get("orderId"));
  const orderNo = String(
    formData.get("orderNo") ?? ""
  ).trim();

  const adminNote = String(
    formData.get("adminNote") ?? ""
  ).trim();

  if (!Number.isInteger(orderId) || !orderNo) {
    throw new Error(
      "잘못된 관리자 메모 저장 요청입니다."
    );
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      admin_note: adminNote || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("관리자 메모 저장 오류:", error);

    throw new Error(
      `관리자 메모 저장에 실패했습니다: ${error.message}`
    );
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNo}`);

  redirect(`/admin/orders/${orderNo}`);
}

/**
 * 가맹·배송 진행정보 저장
 */
async function updateOrderProgress(formData: FormData) {
  "use server";

  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

  const orderId = Number(formData.get("orderId"));

  const orderNo = String(
    formData.get("orderNo") ?? ""
  ).trim();

  const shippingStatus = String(
    formData.get("shippingStatus") ?? ""
  ) as ShippingStatus;

  const courier = String(
    formData.get("courier") ?? ""
  ).trim();

  const trackingNumber = String(
    formData.get("trackingNumber") ?? ""
  )
    .trim()
    .replace(/\s/g, "");

  if (
    !Number.isInteger(orderId) ||
    !orderNo ||
    !SHIPPING_STATUSES.includes(shippingStatus)
  ) {
    throw new Error(
      "잘못된 주문정보 변경 요청입니다."
    );
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      shipping_status: shippingStatus,
      courier: courier || null,
      tracking_number: trackingNumber || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("주문 진행정보 저장 오류:", error);

    throw new Error(
      `저장에 실패했습니다: ${error.message}`
    );
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNo}`);
  revalidatePath("/order-check");

  redirect(`/admin/orders/${orderNo}`);
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNo: string }>;
}) {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

  const { orderNo } = await params;
  const decodedOrderNo = decodeURIComponent(orderNo);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
        id,
        order_no,
        buyer_name,
        buyer_phone,
        buyer_email,
        business_name,
        delivery_address,
        request_note,
        admin_note,
        product_code,
        product_name,
        amount,
        payment_status,
        shipping_status,
        courier,
        tracking_number,
        tid,
        result_code,
        result_message,
        created_at,
        approved_at,
        updated_at
      `
    )
    .eq("order_no", decodedOrderNo)
    .maybeSingle();

  if (error) {
    console.error(
      "관리자 주문 상세 조회 오류:",
      error
    );

    throw new Error(
      `주문 조회에 실패했습니다: ${error.message}`
    );
  }

  if (!data) {
    notFound();
  }

  const order = data as Order;

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* 상단 */}
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <a
              href="/admin/orders"
              className="font-semibold text-blue-600 hover:underline"
            >
              ← 주문목록으로
            </a>

            <p className="mt-7 font-semibold text-blue-600">
              사장님찬스 관리자
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              주문 상세
            </h1>

            <p className="mt-3 break-all text-sm text-gray-500">
              {order.order_no}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-bold ${getPaymentStatusClass(
              order.payment_status
            )}`}
          >
            {getPaymentStatusLabel(
              order.payment_status
            )}
          </span>
        </header>

        {/* 요약 */}
        <section className="mb-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              결제금액
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-600">
              {order.amount.toLocaleString()}원
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              주문일시
            </p>

            <p className="mt-3 font-bold text-gray-900">
              {formatDate(order.created_at)}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              승인일시
            </p>

            <p className="mt-3 font-bold text-gray-900">
              {formatDate(order.approved_at)}
            </p>
          </div>
        </section>

        {/* 기본 정보 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 고객 정보 */}
          <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              고객 정보
            </h2>

            <dl className="mt-6 divide-y divide-gray-100">
              <InfoRow
                label="구매자명"
                value={order.buyer_name}
              />

              <InfoRow
                label="연락처"
                value={order.buyer_phone}
                href={`tel:${order.buyer_phone}`}
              />

              <InfoRow
                label="이메일"
                value={order.buyer_email || "미입력"}
                href={
                  order.buyer_email
                    ? `mailto:${order.buyer_email}`
                    : undefined
                }
              />

              <InfoRow
                label="상호명"
                value={
                  order.business_name || "미입력"
                }
              />

              <InfoRow
                label="배송지"
                value={
                  order.delivery_address || "미입력"
                }
              />
            </dl>
          </section>

          {/* 주문 상품 */}
          <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              주문 상품
            </h2>

            <dl className="mt-6 divide-y divide-gray-100">
              <InfoRow
                label="상품명"
                value={order.product_name}
              />

              <InfoRow
                label="상품코드"
                value={order.product_code}
              />

              <InfoRow
                label="수량"
                value="1개"
              />

              <InfoRow
                label="결제금액"
                value={`${order.amount.toLocaleString()}원`}
              />
            </dl>
          </section>

          {/* 결제 정보 */}
          <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              결제 정보
            </h2>

            <dl className="mt-6 divide-y divide-gray-100">
              <InfoRow
                label="결제상태"
                value={getPaymentStatusLabel(
                  order.payment_status
                )}
              />

              <InfoRow
                label="KG이니시스 TID"
                value={order.tid || "미등록"}
              />

              <InfoRow
                label="결과코드"
                value={order.result_code || "-"}
              />

              <InfoRow
                label="결과메시지"
                value={order.result_message || "-"}
              />

              <InfoRow
                label="승인일시"
                value={formatDate(order.approved_at)}
              />
            </dl>
          </section>

          {/* 고객 요청사항 */}
          <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              요청사항
            </h2>

            <div className="mt-6 min-h-36 whitespace-pre-wrap rounded-2xl bg-gray-50 p-5 leading-7 text-gray-700">
              {order.request_note ||
                "등록된 요청사항이 없습니다."}
            </div>
          </section>
        </div>

        {/* 관리자 메모 */}
        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-8">
          <div>
            <p className="font-semibold text-blue-600">
              내부 관리용
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              관리자 메모
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              고객 주문조회 화면에는 노출되지 않는
              관리자 전용 메모입니다.
            </p>
          </div>

          <form
            action={updateAdminNote}
            className="mt-6"
          >
            <input
              type="hidden"
              name="orderId"
              value={order.id}
            />

            <input
              type="hidden"
              name="orderNo"
              value={order.order_no}
            />

            <textarea
              name="adminNote"
              defaultValue={order.admin_note ?? ""}
              rows={6}
              placeholder={`예시)
고객 통화 완료
8월 8일 오전 설치 예정
사업자등록증 수신 완료
프린터 흰색 요청`}
              className="w-full resize-y rounded-2xl border border-gray-300 px-5 py-4 leading-7 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition hover:bg-gray-700"
              >
                관리자 메모 저장
              </button>
            </div>
          </form>
        </section>

        {/* 가맹 및 배송정보 */}
        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-8">
          <div>
            <p className="font-semibold text-blue-600">
              주문 진행 관리
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              가맹 및 배송정보
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              진행상태와 택배사, 송장번호를 변경한
              뒤 저장해주세요.
            </p>
          </div>

          <form
            action={updateOrderProgress}
            className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            <input
              type="hidden"
              name="orderId"
              value={order.id}
            />

            <input
              type="hidden"
              name="orderNo"
              value={order.order_no}
            />

            <div>
              <label
                htmlFor="shippingStatus"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                진행상태
              </label>

              <select
                id="shippingStatus"
                name="shippingStatus"
                defaultValue={order.shipping_status}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {SHIPPING_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="courier"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                택배사
              </label>

              <select
                id="courier"
                name="courier"
                defaultValue={order.courier ?? ""}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {COURIERS.map((courier) => (
                  <option
                    key={courier || "none"}
                    value={courier}
                  >
                    {courier || "택배사 선택"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="trackingNumber"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                송장번호
              </label>

              <input
                id="trackingNumber"
                name="trackingNumber"
                type="text"
                defaultValue={
                  order.tracking_number ?? ""
                }
                placeholder="송장번호 입력"
                inputMode="numeric"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                진행정보 저장
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
              현재 상태: {order.shipping_status}
            </span>

            {order.courier && (
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                택배사: {order.courier}
              </span>
            )}

            {order.tracking_number && (
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                송장번호: {order.tracking_number}
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[130px_1fr]">
      <dt className="text-sm font-medium text-gray-500">
        {label}
      </dt>

      <dd className="break-all font-semibold text-gray-900">
        {href ? (
          <a
            href={href}
            className="text-blue-600 hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}