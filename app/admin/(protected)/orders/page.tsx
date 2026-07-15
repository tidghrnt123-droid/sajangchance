import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

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
  tid: string | null;
  created_at: string;
  approved_at: string | null;
};

function getStatusLabel(status: string) {
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

function getStatusClass(status: string) {
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

  const totalSales = paidOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
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

        <section className="mb-8 grid gap-4 md:grid-cols-3">
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
              <table className="min-w-[1150px] w-full text-left text-sm">
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
                      상태
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
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            order.payment_status
                          )}`}
                        >
                          {getStatusLabel(order.payment_status)}
                        </span>
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