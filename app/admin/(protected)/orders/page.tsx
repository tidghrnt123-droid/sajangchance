import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import DeleteOrderButton from "@/components/DeleteOrderButton";

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
  product_name: string;
  amount: number;
  payment_status: string;
  payment_method: string | null;
  is_escrow: boolean;
  shipping_status: ShippingStatus;
  courier: string | null;
  tracking_number: string | null;
  tid: string | null;
  created_at: string;
  approved_at: string | null;
};

const DELETABLE_PAYMENT_STATUSES = [
  "PENDING",
  "FAILED",
  "CANCELLED",
] as const;

type DeletablePaymentStatus =
  (typeof DELETABLE_PAYMENT_STATUSES)[number];

async function deleteOrder(formData: FormData) {
  "use server";

  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

  const orderId = Number(formData.get("orderId"));

  if (!Number.isInteger(orderId)) {
    throw new Error("잘못된 주문 삭제 요청입니다.");
  }

  const { data: order, error: findError } =
    await supabaseAdmin
      .from("orders")
      .select("id, order_no, payment_status")
      .eq("id", orderId)
      .maybeSingle();

  if (findError) {
    console.error("삭제할 주문 조회 오류:", findError);

    throw new Error(
      `주문 확인에 실패했습니다: ${findError.message}`
    );
  }

  if (!order) {
    throw new Error("삭제할 주문을 찾지 못했습니다.");
  }

  if (
    !DELETABLE_PAYMENT_STATUSES.includes(
      order.payment_status as DeletablePaymentStatus
    )
  ) {
    throw new Error(
      "결제완료·환불완료 주문은 삭제할 수 없습니다."
    );
  }

  const { error: deleteError } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("id", orderId)
    .eq("payment_status", order.payment_status);

  if (deleteError) {
    console.error("주문 삭제 오류:", deleteError);

    throw new Error(
      `주문 삭제에 실패했습니다: ${deleteError.message}`
    );
  }

  revalidatePath("/admin/orders");
  revalidatePath("/order-check");

  redirect("/admin/orders");
}

async function updateDeliveryInfo(formData: FormData) {
  "use server";

  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

  const orderId = Number(formData.get("orderId"));

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
    !SHIPPING_STATUSES.includes(shippingStatus)
  ) {
    throw new Error("잘못된 배송정보 변경 요청입니다.");
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({
      shipping_status: shippingStatus,
      courier: courier || null,
      tracking_number: trackingNumber || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select(
      `
        id,
        shipping_status,
        courier,
        tracking_number
      `
    )
    .single();

  if (error) {
    console.error("배송정보 저장 오류:", error);

    throw new Error(
      `배송정보 저장에 실패했습니다: ${error.message}`
    );
  }

  if (!data) {
    throw new Error("변경할 주문을 찾지 못했습니다.");
  }

  revalidatePath("/admin/orders");
  revalidatePath("/order-check");

  redirect("/admin/orders");
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
      return "bg-green-50 text-green-700";

    case "PENDING":
      return "bg-yellow-50 text-yellow-700";

    case "FAILED":
      return "bg-red-50 text-red-700";

    case "CANCELLED":
    case "REFUNDED":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getShippingStatusClass(status: string) {
  switch (status) {
    case "결제완료":
      return "bg-gray-100 text-gray-700";

    case "가맹 접수대기":
      return "bg-orange-50 text-orange-700";

    case "가맹 심사중":
      return "bg-purple-50 text-purple-700";

    case "배송준비":
      return "bg-yellow-50 text-yellow-700";

    case "배송중":
      return "bg-blue-50 text-blue-700";

    case "배송완료":
      return "bg-green-50 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

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
  }).format(new Date(date));
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    paymentMethod?: string;
    escrow?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

  const params = await searchParams;

  const query = String(params.q ?? "").trim().toLowerCase();
  const paymentMethod = String(
    params.paymentMethod ?? ""
  ).trim();
  const escrow = String(params.escrow ?? "").trim();
  const dateFrom = String(params.dateFrom ?? "").trim();
  const dateTo = String(params.dateTo ?? "").trim();

  const { data, error } = await supabaseServer
    .from("orders")
    .select(
      `
        id,
        order_no,
        buyer_name,
        buyer_phone,
        buyer_email,
        business_name,
        product_name,
        amount,
        payment_status,
        payment_method,
        is_escrow,
        shipping_status,
        courier,
        tracking_number,
        tid,
        created_at,
        approved_at
      `
    )
    .order("created_at", { ascending: false });

  const allOrders = (data ?? []) as Order[];

  const orders = allOrders.filter((order) => {
    const searchableText = [
      order.order_no,
      order.buyer_name,
      order.buyer_phone,
      order.buyer_email ?? "",
      order.business_name ?? "",
      order.product_name,
    ]
      .join(" ")
      .toLowerCase();

    if (query && !searchableText.includes(query)) {
      return false;
    }

    if (
      paymentMethod &&
      order.payment_method !== paymentMethod
    ) {
      return false;
    }

    if (escrow === "Y" && !order.is_escrow) {
      return false;
    }

    if (escrow === "N" && order.is_escrow) {
      return false;
    }

    const orderDate = new Date(order.created_at);
    const orderDateText = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(orderDate);

    if (dateFrom && orderDateText < dateFrom) {
      return false;
    }

    if (dateTo && orderDateText > dateTo) {
      return false;
    }

    return true;
  });

  const hasActiveFilters = Boolean(
    query ||
      paymentMethod ||
      escrow ||
      dateFrom ||
      dateTo
  );

  const paidOrders = orders.filter(
    (order) => order.payment_status === "PAID"
  );

  const waitingOrders = orders.filter(
    (order) => order.shipping_status === "가맹 접수대기"
  );

  const reviewingOrders = orders.filter(
    (order) => order.shipping_status === "가맹 심사중"
  );

  const shippingOrders = orders.filter(
    (order) => order.shipping_status === "배송중"
  );

  const totalSales = paidOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1700px]">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-blue-600">
              사장님찬스 관리자
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              주문관리
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              주문정보와 가맹 진행상태, 배송정보를 관리합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
            >
              홈페이지
            </a>

            <a
              href="/order-check"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              고객 주문조회
            </a>

            <a
              href="/api/admin/logout"
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              로그아웃
            </a>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              전체 주문
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              결제완료
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {paidOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              가맹 접수대기
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              {waitingOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              가맹 심사중
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {reviewingOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              배송중
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {shippingOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              결제완료 금액
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {totalSales.toLocaleString()}원
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-semibold text-blue-600">
                주문 검색·필터
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                필요한 주문만 빠르게 찾기
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                주문번호, 구매자명, 연락처, 이메일, 상호명,
                상품명을 한 번에 검색할 수 있습니다.
              </p>
            </div>

            {hasActiveFilters && (
              <a
                href="/admin/orders"
                className="w-fit rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
              >
                필터 초기화
              </a>
            )}
          </div>

          <form
            method="get"
            action="/admin/orders"
            className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(280px,1.5fr)_180px_180px_170px_170px_auto]"
          >
            <div>
              <label
                htmlFor="q"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                통합검색
              </label>

              <input
                id="q"
                name="q"
                type="search"
                defaultValue={params.q ?? ""}
                placeholder="주문번호, 고객명, 전화번호, 상품명"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="paymentMethod"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                결제수단
              </label>

              <select
                id="paymentMethod"
                name="paymentMethod"
                defaultValue={paymentMethod}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">전체 결제수단</option>
                <option value="CARD">신용카드</option>
                <option value="BANK">계좌이체</option>
                <option value="VBANK">가상계좌</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="escrow"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                에스크로
              </label>

              <select
                id="escrow"
                name="escrow"
                defaultValue={escrow}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">전체</option>
                <option value="Y">에스크로 적용</option>
                <option value="N">일반결제</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dateFrom"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                시작일
              </label>

              <input
                id="dateFrom"
                name="dateFrom"
                type="date"
                defaultValue={dateFrom}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="dateTo"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                종료일
              </label>

              <input
                id="dateTo"
                name="dateTo"
                type="date"
                defaultValue={dateTo}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                검색
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-lg bg-gray-100 px-3 py-2 font-semibold text-gray-700">
              검색 결과 {orders.length}건
            </span>

            {hasActiveFilters && (
              <span className="text-gray-500">
                전체 {allOrders.length}건 중 조건에 맞는 주문입니다.
              </span>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              주문 목록
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              주문정보는 왼쪽에서 확인하고, 진행상태와 배송정보는
              오른쪽 관리영역에서 바로 수정할 수 있습니다.
            </p>
          </div>

          {error ? (
            <div className="p-8">
              <p className="font-semibold text-red-600">
                주문을 불러오지 못했습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {error.message}
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              등록된 주문이 없습니다.
            </div>
          ) : (
            <div className="space-y-4 p-4 md:p-6">
              {orders.map((order) => {
                const canDelete =
                  order.payment_status === "PENDING" ||
                  order.payment_status === "FAILED" ||
                  order.payment_status === "CANCELLED";

                return (
                  <article
                    key={order.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
                      {/* 왼쪽: 주문 정보 */}
                      <div className="p-5 md:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <a
                              href={`/admin/orders/${encodeURIComponent(
                                order.order_no
                              )}`}
                              className="break-all text-base font-bold text-gray-900 transition hover:text-blue-600 hover:underline"
                            >
                              {order.order_no}
                            </a>

                            {order.tid && (
                              <p className="mt-2 break-all text-xs text-gray-400">
                                TID: {order.tid}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getPaymentStatusClass(
                                order.payment_status
                              )}`}
                            >
                              {getPaymentStatusLabel(
                                order.payment_status
                              )}
                            </span>

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getShippingStatusClass(
                                order.shipping_status
                              )}`}
                            >
                              {order.shipping_status}
                            </span>

                            {order.payment_method && (
                              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                {order.payment_method === "CARD"
                                  ? "신용카드"
                                  : order.payment_method === "BANK"
                                    ? "계좌이체"
                                    : order.payment_method === "VBANK"
                                      ? "가상계좌"
                                      : order.payment_method}
                              </span>
                            )}

                            {order.is_escrow && (
                              <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                                에스크로
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-400">
                              고객정보
                            </p>

                            <p className="mt-2 text-base font-bold text-gray-900">
                              {order.buyer_name}
                            </p>

                            {order.business_name && (
                              <p className="mt-1 text-sm text-gray-600">
                                {order.business_name}
                              </p>
                            )}

                            <a
                              href={`tel:${order.buyer_phone}`}
                              className="mt-2 block text-sm text-gray-700 hover:text-blue-600 hover:underline"
                            >
                              {order.buyer_phone}
                            </a>

                            {order.buyer_email ? (
                              <a
                                href={`mailto:${order.buyer_email}`}
                                className="mt-1 block break-all text-sm text-blue-600 hover:underline"
                              >
                                {order.buyer_email}
                              </a>
                            ) : (
                              <p className="mt-1 text-sm text-gray-400">
                                이메일 미입력
                              </p>
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-400">
                              주문상품
                            </p>

                            <p className="mt-2 break-words font-semibold text-gray-900">
                              {order.product_name}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-400">
                              결제금액
                            </p>

                            <p className="mt-2 text-xl font-bold text-blue-600">
                              {order.amount.toLocaleString()}원
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-400">
                              주문일시
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-700">
                              {formatDate(order.created_at)}
                            </p>

                            <p className="mt-3 text-xs font-semibold text-gray-400">
                              승인일시
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              {formatDate(order.approved_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 오른쪽: 진행 및 배송 관리 */}
                      <div className="border-t border-gray-200 bg-gray-50 p-5 md:p-6 lg:border-l lg:border-t-0">
                        <p className="text-sm font-bold text-gray-900">
                          진행·배송 관리
                        </p>

                        <form
                          action={updateDeliveryInfo}
                          className="mt-4 grid gap-3"
                        >
                          <input
                            type="hidden"
                            name="orderId"
                            value={order.id}
                          />

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                                진행상태
                              </label>

                              <select
                                name="shippingStatus"
                                defaultValue={order.shipping_status}
                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                              >
                                {SHIPPING_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                                택배사
                              </label>

                              <select
                                name="courier"
                                defaultValue={order.courier ?? ""}
                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                              송장번호
                            </label>

                            <input
                              type="text"
                              name="trackingNumber"
                              defaultValue={
                                order.tracking_number ?? ""
                              }
                              placeholder="송장번호 입력"
                              inputMode="numeric"
                              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                          >
                            진행정보 저장
                          </button>
                        </form>

                        {(order.courier ||
                          order.tracking_number) && (
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            {order.courier && (
                              <span className="rounded-md bg-white px-2.5 py-1.5 font-medium text-gray-600 ring-1 ring-gray-200">
                                {order.courier}
                              </span>
                            )}

                            {order.tracking_number && (
                              <span className="rounded-md bg-blue-50 px-2.5 py-1.5 font-medium text-blue-700">
                                송장 {order.tracking_number}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-5 border-t border-gray-200 pt-4">
                          <form action={deleteOrder}>
                            <input
                              type="hidden"
                              name="orderId"
                              value={order.id}
                            />

                            <DeleteOrderButton
                              disabled={!canDelete}
                            />
                          </form>

                          {!canDelete && (
                            <p className="mt-2 text-xs leading-relaxed text-gray-400">
                              결제완료·환불완료 주문은 기록 보존을 위해
                              삭제할 수 없습니다.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}