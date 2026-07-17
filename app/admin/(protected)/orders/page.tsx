import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { supabaseServer } from "@/lib/supabaseServer";
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
  product_name: string;
  amount: number;
  payment_status: string;
  shipping_status: ShippingStatus;
  courier: string | null;
  tracking_number: string | null;
  tid: string | null;
  created_at: string;
  approved_at: string | null;
};

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

export default async function OrdersPage() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

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
        shipping_status,
        courier,
        tracking_number,
        tid,
        created_at,
        approved_at
      `
    )
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];

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

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              주문 목록
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              고객정보를 확인하고 배송상태, 택배사와 송장번호를
              입력한 뒤 저장을 눌러주세요.
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
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1700px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      주문번호
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      고객정보
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      상품
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      금액
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      결제상태
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      진행상태
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      배송정보 관리
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      주문일시
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      승인일시
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="align-top transition hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-5 py-5">
                        <p className="font-semibold text-gray-900">
                          {order.order_no}
                        </p>

                        {order.tid && (
                          <p className="mt-2 max-w-[180px] truncate text-xs text-gray-400">
                            TID: {order.tid}
                          </p>
                        )}
                      </td>

                      <td className="min-w-[260px] px-5 py-5">
                        <p className="text-base font-bold text-gray-900">
                          {order.buyer_name}
                        </p>

                        {order.business_name && (
                          <p className="mt-1 text-sm font-medium text-gray-600">
                            {order.business_name}
                          </p>
                        )}

                        <div className="mt-3 space-y-1.5">
                          <a
                            href={`tel:${order.buyer_phone}`}
                            className="block text-sm text-gray-700 transition hover:text-blue-600 hover:underline"
                          >
                            전화: {order.buyer_phone}
                          </a>

                          {order.buyer_email ? (
                            <a
                              href={`mailto:${order.buyer_email}`}
                              className="block max-w-[280px] break-all text-sm font-medium text-blue-600 transition hover:text-blue-800 hover:underline"
                            >
                              이메일: {order.buyer_email}
                            </a>
                          ) : (
                            <p className="text-sm text-gray-400">
                              이메일 미입력
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="min-w-[180px] px-5 py-5 text-gray-700">
                        {order.product_name}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 font-semibold text-gray-900">
                        {order.amount.toLocaleString()}원
                      </td>

                      <td className="whitespace-nowrap px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getPaymentStatusClass(
                            order.payment_status
                          )}`}
                        >
                          {getPaymentStatusLabel(
                            order.payment_status
                          )}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getShippingStatusClass(
                            order.shipping_status
                          )}`}
                        >
                          {order.shipping_status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <form
                          action={updateDeliveryInfo}
                          className="flex min-w-[620px] items-center gap-2"
                        >
                          <input
                            type="hidden"
                            name="orderId"
                            value={order.id}
                          />

                          <select
                            name="shippingStatus"
                            defaultValue={order.shipping_status}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          >
                            {SHIPPING_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <select
                            name="courier"
                            defaultValue={order.courier ?? ""}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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

                          <input
                            type="text"
                            name="trackingNumber"
                            defaultValue={
                              order.tracking_number ?? ""
                            }
                            placeholder="송장번호 입력"
                            inputMode="numeric"
                            className="w-44 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />

                          <button
                            type="submit"
                            className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            저장
                          </button>
                        </form>

                        {(order.courier ||
                          order.tracking_number) && (
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            {order.courier && (
                              <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-600">
                                {order.courier}
                              </span>
                            )}

                            {order.tracking_number && (
                              <span className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700">
                                송장 {order.tracking_number}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-gray-600">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-gray-600">
                        {formatDate(order.approved_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}