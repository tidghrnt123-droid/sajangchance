import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { supabaseServer } from "@/lib/supabaseServer";

import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

type OrderSummary = {
  amount: number;
  payment_status: string;
  shipping_status: string;
  created_at: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default async function AdminPage({
  searchParams,
}: AdminLoginPageProps) {
  const cookieStore = await cookies();
  const cookieName = getAdminSessionCookieName();
  const currentToken = cookieStore.get(cookieName)?.value;

  const isLoggedIn = verifyAdminSessionToken(currentToken);

  const params = await searchParams;
  const hasError = params.error === "1";

  async function loginAction(formData: FormData) {
    "use server";

    const password = String(
      formData.get("password") ?? ""
    ).trim();

    if (!verifyAdminPassword(password)) {
      redirect("/admin?error=1");
    }

    const sessionToken = createAdminSessionToken();
    const serverCookieStore = await cookies();

    serverCookieStore.set(
      getAdminSessionCookieName(),
      sessionToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 12,
        path: "/",
      }
    );

    redirect("/admin");
  }

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
          <p className="mb-3 font-semibold text-blue-600">
            사장님찬스 관리자
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            관리자 로그인
          </h1>

          <p className="mt-3 leading-relaxed text-gray-500">
            관리자 페이지에 접속하려면 비밀번호를 입력해주세요.
          </p>

          <form action={loginAction} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-semibold text-gray-900"
              >
                관리자 비밀번호
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                placeholder="비밀번호를 입력해주세요"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {hasError && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                비밀번호가 올바르지 않습니다.
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              로그인
            </button>
          </form>

          <a
            href="/"
            className="mt-5 block text-center text-sm text-gray-500 transition hover:text-blue-600"
          >
            홈페이지로 돌아가기
          </a>
        </div>
      </main>
    );
  }

  const { data, error } = await supabaseServer
    .from("orders")
    .select(
      `
        amount,
        payment_status,
        shipping_status,
        created_at
      `
    )
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as OrderSummary[];

  const paidOrders = orders.filter(
    (order) => order.payment_status === "PAID"
  );

  const pendingPaymentOrders = orders.filter(
    (order) => order.payment_status === "PENDING"
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

  const completedOrders = orders.filter(
    (order) => order.shipping_status === "배송완료"
  );

  const totalSales = paidOrders.reduce(
    (sum, order) => sum + Number(order.amount || 0),
    0
  );

  const today = formatDate(new Date());

  const todayOrders = orders.filter(
    (order) => formatDate(new Date(order.created_at)) === today
  );

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-8 flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-semibold text-blue-600">
              사장님찬스 관리자
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              관리자 운영센터
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              주문, 결제, 가맹 진행상태와 배송정보를 한눈에 확인할 수 있습니다.
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

        {error && (
          <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              주문 통계를 불러오지 못했습니다.
            </p>
            <p className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          </section>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">전체 주문</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}건
            </p>
            <p className="mt-2 text-xs text-gray-400">
              오늘 신규 주문 {todayOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">결제완료</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {paidOrders.length}건
            </p>
            <p className="mt-2 text-xs text-gray-400">
              결제대기 {pendingPaymentOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">배송중</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {shippingOrders.length}건
            </p>
            <p className="mt-2 text-xs text-gray-400">
              배송완료 {completedOrders.length}건
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">결제완료 금액</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {totalSales.toLocaleString()}원
            </p>
            <p className="mt-2 text-xs text-gray-400">
              결제완료 주문 기준
            </p>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <p className="text-sm font-semibold text-orange-700">
              가맹 접수대기
            </p>
            <p className="mt-2 text-3xl font-bold text-orange-700">
              {waitingOrders.length}건
            </p>
            <p className="mt-2 text-sm text-orange-600">
              가맹 접수가 필요한 주문입니다.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <p className="text-sm font-semibold text-purple-700">
              가맹 심사중
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-700">
              {reviewingOrders.length}건
            </p>
            <p className="mt-2 text-sm text-purple-600">
              카드사 심사가 진행 중입니다.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <p className="text-sm font-semibold text-blue-700">
              배송중
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {shippingOrders.length}건
            </p>
            <p className="mt-2 text-sm text-blue-600">
              운송장 등록 후 배송 중인 주문입니다.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              관리자 메뉴
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              관리할 메뉴를 선택해주세요.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <a
              href="/admin/orders"
              className="group rounded-3xl border border-blue-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                    📦
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-gray-900">
                    주문관리
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    주문정보, 고객 연락처, 결제상태, 가맹 진행과 배송정보를 관리합니다.
                  </p>
                </div>
                <span className="text-xl text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-600">
                  전체 {orders.length}건
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                  배송중 {shippingOrders.length}건
                </span>
              </div>
            </a>

            <a
              href="/order-check"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                    🔎
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-gray-900">
                    고객 주문조회
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    고객에게 노출되는 주문·배송조회 화면을 직접 확인합니다.
                  </p>
                </div>
                <span className="text-xl text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>

              <div className="mt-6">
                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  새 창에서 열기
                </span>
              </div>
            </a>

            <div className="rounded-3xl border border-gray-200 bg-white p-7 opacity-75 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                📝
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                상담관리
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                상담 신청 내역과 고객 처리상태를 관리하는 메뉴입니다.
              </p>
              <div className="mt-6">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                  준비중
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-7 opacity-75 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                💳
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                상품관리
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                상품명, 결제금액과 상품 노출상태를 관리하는 메뉴입니다.
              </p>
              <div className="mt-6">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                  준비중
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-7 opacity-75 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-2xl">
                📊
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                매출통계
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                기간별 주문과 결제완료 금액을 조회하는 메뉴입니다.
              </p>
              <div className="mt-6">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                  준비중
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-7 opacity-75 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                ⚙️
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                환경설정
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                관리자 비밀번호와 사이트 운영정보를 관리하는 메뉴입니다.
              </p>
              <div className="mt-6">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                  준비중
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}