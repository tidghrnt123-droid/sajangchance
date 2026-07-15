import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const cookieStore = await cookies();
  const cookieName = getAdminSessionCookieName();
  const currentToken = cookieStore.get(cookieName)?.value;

  if (verifyAdminSessionToken(currentToken)) {
    redirect("/admin/orders");
  }

  const params = await searchParams;
  const hasError = params.error === "1";

  async function loginAction(formData: FormData) {
    "use server";

    const password = String(formData.get("password") ?? "");

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

    redirect("/admin/orders");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        <p className="mb-3 font-semibold text-blue-600">
          사장님찬스 관리자
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          관리자 로그인
        </h1>

        <p className="mt-3 leading-relaxed text-gray-500">
          주문관리 페이지에 접속하려면 관리자 비밀번호를 입력해주세요.
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600"
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