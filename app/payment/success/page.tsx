import { Check, ChevronRight, MessageCircle } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type Order = {
  order_no: string;
  product_name: string;
  amount: number;
  payment_status: string;
  shipping_status: string;
  approved_at: string | null;
};

function formatDate(date: string | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    order?: string;
    tid?: string;
  }>;
}) {
  const { order: orderNo } = await searchParams;

  let order: Order | null = null;

  if (orderNo) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
          order_no,
          product_name,
          amount,
          payment_status,
          shipping_status,
          approved_at
        `
      )
      .eq("order_no", orderNo)
      .maybeSingle();

    if (!error && data) {
      order = data as Order;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="mx-auto max-w-4xl px-5 py-14 md:px-6 md:py-20">
        <div className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-xl">
          <div className="bg-blue-600 px-6 py-12 text-center text-white md:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg">
              <Check size={44} strokeWidth={3} />
            </div>

            <h1 className="mt-7 text-3xl font-bold md:text-4xl">
              결제가 정상적으로 완료되었습니다
            </h1>

            <p className="mt-4 text-blue-100">
              사장님찬스를 이용해주셔서 감사합니다.
              <br />
              주문 확인 후 담당자가 순차적으로 안내드립니다.
            </p>
          </div>

          <div className="p-6 md:p-10">
            {order ? (
              <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <OrderInfo
                    label="주문번호"
                    value={order.order_no}
                  />

                  <OrderInfo
                    label="결제일시"
                    value={formatDate(order.approved_at)}
                  />

                  <OrderInfo
                    label="주문상품"
                    value={order.product_name}
                  />

                  <OrderInfo
                    label="결제금액"
                    value={`${order.amount.toLocaleString()}원`}
                    highlight
                  />
                </div>
              </section>
            ) : (
              <section className="rounded-3xl bg-gray-50 p-6 text-center text-gray-600">
                결제 승인이 완료되었습니다.
                <br />
                주문정보는 고객 주문조회에서 확인할 수 있습니다.
              </section>
            )}

            <section className="mt-10">
              <p className="text-center font-semibold text-blue-600">
                앞으로의 진행 과정
              </p>

              <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
                접수부터 설치까지 안내해드립니다
              </h2>

              <div className="mt-8 grid gap-3 md:grid-cols-4">
                <ProgressItem
                  number="01"
                  title="결제완료"
                  description="결제가 정상 승인되었습니다."
                  active
                />

                <ProgressItem
                  number="02"
                  title="주문 확인"
                  description="담당자가 주문정보를 확인합니다."
                />

                <ProgressItem
                  number="03"
                  title="가맹·배송 안내"
                  description="필요한 절차와 일정을 안내합니다."
                />

                <ProgressItem
                  number="04"
                  title="설치·이용 시작"
                  description="제품 수령 후 이용을 시작합니다."
                />
              </div>
            </section>

            <section className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-6 md:p-8">
              <p className="text-sm font-semibold text-blue-600">
                담당자 안내
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-900">
                주문 확인 후 연락드리겠습니다
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                주문상품과 설치 관련 확인이 필요한 경우 담당자가
                입력하신 연락처로 안내드립니다. 빠른 상담이
                필요하시면 전화 또는 카카오톡으로 문의해주세요.
              </p>

              <p className="mt-5 text-2xl font-bold text-blue-600">
                010-7908-3099
              </p>
            </section>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <a
                href="/order-check"
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                주문·배송조회
                <ChevronRight size={19} />
              </a>

              <a
                href="https://pf.kakao.com/_xcxhFen/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-5 py-4 font-bold text-[#191919] transition hover:brightness-95"
              >
                <MessageCircle size={20} />
                카카오톡 문의
              </a>

              <a
                href="/"
                className="flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 py-4 font-bold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
              >
                홈으로 돌아가기
              </a>
            </div>

            <p className="mt-8 text-center text-xs leading-6 text-gray-400">
              주문번호는 주문조회 시 필요하므로 보관해주세요.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function OrderInfo({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p
        className={`mt-2 break-all font-bold ${
          highlight
            ? "text-2xl text-blue-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ProgressItem({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-200 bg-white text-gray-900"
      }`}
    >
      <p
        className={`text-sm font-bold ${
          active ? "text-blue-100" : "text-blue-600"
        }`}
      >
        {number}
      </p>

      <p className="mt-3 font-bold">{title}</p>

      <p
        className={`mt-2 text-sm leading-6 ${
          active ? "text-blue-100" : "text-gray-500"
        }`}
      >
        {description}
      </p>
    </div>
  );
}