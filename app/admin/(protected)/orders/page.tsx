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
  "배송준비",
  "배송중",
  "배송완료",
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

async function updateShippingStatus(formData: FormData) {
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

  if (
    !Number.isInteger(orderId) ||
    !SHIPPING_STATUSES.includes(shippingStatus)
  ) {
    throw new Error("잘못된 배송상태 변경 요청입니다.");
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({
      shipping_status: shippingStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select("id, shipping_status")
    .single();

  if (error) {
    console.error("배송상태 변경 오류:", error);
    throw new Error(`배송상태 변경 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error("변경할 주문을 찾지 못했습니다.");
  }

  revalidatePath("/admin/orders");
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

  const preparingOrders = orders.filter(
    (order) => order.shipping_status === "배송준비"
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
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-blue-600">
              사장님찬스 관리자
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              주문관리
            </h1>
          </div>

          <div className="flex gap-3">
            <a
              href="/"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700"
            >
              홈페이지
            </a>

            <a
              href="/api/admin/logout"
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              로그아웃
            </a>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">전체 주문</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">결제완료</p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {paidOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">배송준비</p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {preparingOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">배송중</p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {shippingOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">결제완료 금액</p>

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
          </div>

          {error ? (
            <div className="p-8 text-red-600">
              주문을 불러오지 못했습니다.
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              등록된 주문이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1450px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      주문번호
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      구매자
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      연락처
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
                      배송상태
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      배송상태 변경
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
                      className="transition hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                        {order.order_no}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {order.buyer_name}
                        </p>

                        {order.business_name && (
                          <p className="mt-1 text-xs text-gray-500">
                            {order.business_name}
                          </p>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                        {order.buyer_phone}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                        {order.product_name}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                        {order.amount.toLocaleString()}원
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
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

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getShippingStatusClass(
                            order.shipping_status
                          )}`}
                        >
                          {order.shipping_status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <form
                          action={updateShippingStatus}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="hidden"
                            name="orderId"
                            value={order.id}
                          />

                          <select
                            name="shippingStatus"
                            defaultValue={order.shipping_status}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
                          >
                            {SHIPPING_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            변경
                          </button>
                        </form>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
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