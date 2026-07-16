import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

const SHIPPING_STEPS = [
  "결제완료",
  "가맹 접수대기",
  "가맹 심사중",
  "배송준비",
  "배송중",
  "배송완료",
] as const;

type OrderCheckPageProps = {
  searchParams: Promise<{
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

function maskName(name: string) {
  if (!name) {
    return "-";
  }

  if (name.length === 1) {
    return name;
  }

  if (name.length === 2) {
    return `${name[0]}*`;
  }

  return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}`;
}

function maskPhone(phone: string) {
  const normalized = normalizePhone(phone);

  if (normalized.length < 8) {
    return phone;
  }

  return `${normalized.slice(0, 3)}-****-${normalized.slice(-4)}`;
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

function getCurrentStepIndex(status: string) {
  const index = SHIPPING_STEPS.indexOf(
    status as (typeof SHIPPING_STEPS)[number]
  );

  return index >= 0 ? index : 0;
}

function ProgressSteps({
  currentStatus,
}: {
  currentStatus: string;
}) {
  const currentIndex = getCurrentStepIndex(currentStatus);

  return (
    <div className="mt-6">
      <p className="mb-4 text-sm font-semibold text-gray-900">
        진행상태
      </p>

      <div className="space-y-0">
        {SHIPPING_STEPS.map((step, index) => {
          const completed = index < currentIndex;
          const current = index === currentIndex;

          return (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                    completed
                      ? "bg-green-600 text-white"
                      : current
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-gray-200 text-gray-500",
                  ].join(" ")}
                >
                  {completed ? "✓" : index + 1}
                </div>

                {index < SHIPPING_STEPS.length - 1 && (
                  <div
                    className={[
                      "h-10 w-0.5",
                      index < currentIndex
                        ? "bg-green-500"
                        : "bg-gray-200",
                    ].join(" ")}
                  />
                )}
              </div>

              <div className="pt-2">
                <p
                  className={[
                    "font-semibold",
                    completed
                      ? "text-green-700"
                      : current
                      ? "text-blue-700"
                      : "text-gray-400",
                  ].join(" ")}
                >
                  {step}
                </p>

                {current && (
                  <p className="mt-1 text-sm text-gray-500">
                    현재 진행 중인 단계입니다.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function OrderCheckPage({
  searchParams,
}: OrderCheckPageProps) {
  const params = await searchParams;
  const phoneInput = params.phone ?? "";
  const phone = normalizePhone(phoneInput);

  let orders: Order[] = [];
  let searched = false;

  if (phone) {
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
      .order("created_at", { ascending: false })
      .limit(10);

    orders = ((data ?? []) as Order[]).filter(
      (order) => normalizePhone(order.buyer_phone) === phone
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="mx-auto max-w-4xl px-6 py-14 md:py-20">
        <div className="mb-10 text-center">
          <p className="font-semibold text-blue-600">
            사장님찬스 주문조회
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            주문·진행 상태를 확인하세요.
          </h1>

          <p className="mt-4 text-gray-600">
            주문 시 입력한 휴대폰 번호를 입력하면 최근 주문내역을
            확인할 수 있습니다.
          </p>
        </div>

        <form
          method="GET"
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10"
        >
          <div className="space-y-6">
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
                defaultValue={phoneInput}
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

        {searched && orders.length === 0 && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-red-600">
            입력한 연락처와 일치하는 주문내역이 없습니다.
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
              최근 주문 {orders.length}건을 표시합니다.
            </div>

            {orders.map((order) => (
              <section
                key={order.order_no}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-200 px-6 py-5">
                  <p className="text-sm text-gray-500">상품명</p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {order.product_name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    주문일시 {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="p-6 md:p-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">주문자</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {maskName(order.buyer_name)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">연락처</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {maskPhone(order.buyer_phone)}
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
                      <p className="text-sm text-gray-500">현재 진행상태</p>
                      <p className="mt-1 font-semibold text-blue-700">
                        {order.shipping_status}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">주문번호</p>
                      <p className="mt-1 break-all font-semibold text-gray-900">
                        {order.order_no}
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

                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <ProgressSteps
                      currentStatus={order.shipping_status}
                    />
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}