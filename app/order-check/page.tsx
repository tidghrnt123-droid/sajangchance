import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type OrderCheckPageProps = {
  searchParams: Promise<{
    orderNo?: string;
    phone?: string;
  }>;
};

type Order = {
  order_no: string;
  buyer_name: string;
  buyer_phone: string;
  product_name: string;
  amount: number;
  payment_status: string;
  shipping_status: string;
  courier: string | null;
  tracking_number: string | null;
  created_at: string;
  approved_at: string | null;
};

function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
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

function getPaymentStatus(status: string) {
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

export default async function OrderCheckPage({
  searchParams,
}: OrderCheckPageProps) {
  const params = await searchParams;

  const orderNo = (params.orderNo ?? "").trim();
  const phone = normalizePhone(params.phone ?? "");

  let order: Order | null = null;
  let searched = false;

  if (orderNo && phone) {
    searched = true;

    const { data } = await supabaseServer
      .from("orders")
      .select(
        `
          order_no,
          buyer_name,
          buyer_phone,
          product_name,
          amount,
          payment_status,
          shipping_status,
          courier,
          tracking_number,
          created_at,
          approved_at
        `
      )
      .eq("order_no", orderNo)
      .single();

    if (
      data &&
      normalizePhone(String(data.buyer_phone ?? "")) === phone
    ) {
      order = data as Order;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <div className="mb-10 text-center">
          <p className="font-semibold text-blue-600">
            사장님찬스 주문조회
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            주문·배송 상태를 확인하세요.
          </h1>

          <p className="mt-4 text-gray-600">
            결제 완료 화면에 표시된 주문번호와 주문 시 입력한 연락처를
            입력해주세요.
          </p>
        </div>

        <form
          method="GET"
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10"
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="orderNo"
                className="mb-2 block font-semibold text-gray-900"
              >
                주문번호
              </label>

              <input
                id="orderNo"
                name="orderNo"
                type="text"
                required
                defaultValue={orderNo}
                placeholder="예: SC1234567890ABCD"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block font-semibold text-gray-900"
              >
                연락처
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                defaultValue={params.phone ?? ""}
                placeholder="010-0000-0000"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
            >
              주문조회
            </button>
          </div>
        </form>

        {searched && !order && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-red-600">
            주문번호 또는 연락처가 일치하지 않습니다.
          </div>
        )}

        {order && (
          <section className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5">
              <p className="text-sm text-gray-500">주문번호</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {order.order_no}
              </h2>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
              <div>
                <p className="text-sm text-gray-500">주문자</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {order.buyer_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">상품명</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {order.product_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">결제금액</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {order.amount.toLocaleString()}원
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">결제상태</p>
                <p className="mt-1 font-semibold text-green-700">
                  {getPaymentStatus(order.payment_status)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">배송상태</p>
                <p className="mt-1 font-semibold text-blue-700">
                  {order.shipping_status}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">주문일시</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatDate(order.created_at)}
                </p>
              </div>

              {order.courier && (
                <div>
                  <p className="text-sm text-gray-500">택배사</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {order.courier}
                  </p>
                </div>
              )}

              {order.tracking_number && (
                <div>
                  <p className="text-sm text-gray-500">송장번호</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {order.tracking_number}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </section>

      <Footer />
    </main>
  );
}