"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();

  const order = searchParams.get("order");
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="max-w-2xl mx-auto px-6 py-20">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center text-3xl font-bold">
            !
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            결제가 완료되지 않았습니다.
          </h1>

          <p className="mt-4 text-gray-600">
            결제 과정에서 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도하거나 상담으로 문의해주세요.
          </p>

          <div className="mt-8 rounded-2xl bg-gray-50 p-5 text-left space-y-3">
            {order && (
              <p>
                <span className="text-gray-500">주문번호</span>
                <br />
                <strong className="text-gray-900">{order}</strong>
              </p>
            )}

            {code && (
              <p>
                <span className="text-gray-500">오류코드</span>
                <br />
                <strong className="text-red-600">{code}</strong>
              </p>
            )}

            {message && (
              <p>
                <span className="text-gray-500">오류내용</span>
                <br />
                <strong className="text-gray-900">{message}</strong>
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/card-terminal"
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold"
            >
              상품으로 돌아가기
            </a>

            <a
              href="tel:01079083099"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              결제 문의하기
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}