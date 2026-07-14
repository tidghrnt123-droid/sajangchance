"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const products = {
  front2: {
    name: "토스 프론트2",
    price: 100,
  },
  "front2-printer": {
    name: "프론트2 + 영수증 프린터",
    price: 79000,
  },
  "front2-terminal2": {
    name: "프론트2 + 토스 터미널2",
    price: 139000,
  },
  wireless: {
    name: "무선 카드단말기",
    price: 100,
  },
} as const;

type ProductCode = keyof typeof products;

export default function CheckoutProductPage() {
  const params = useParams<{ product: string }>();

  const productCode = params.product as ProductCode;

  const selectedProduct = useMemo(() => {
    return products[productCode];
  }, [productCode]);

  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!selectedProduct) {
      setMessage("존재하지 않는 상품입니다.");
      return;
    }

    if (!buyerName.trim()) {
      setMessage("구매자명을 입력해주세요.");
      return;
    }

    if (!buyerPhone.trim()) {
      setMessage("연락처를 입력해주세요.");
      return;
    }

    if (!agreed) {
      setMessage("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    window.name = "sajangChanceOpener";

    const popup = window.open(
      "",
      "kovanPayment",
      "width=500,height=760,scrollbars=yes,resizable=yes"
    );

    if (!popup) {
      setMessage(
        "팝업이 차단되었습니다. 브라우저에서 팝업을 허용한 후 다시 시도해주세요."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productCode,
          buyerName,
          buyerPhone,
          buyerEmail,
          businessName,
          requestNote,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        popup.close();

        throw new Error(
          data.message || "결제 준비 과정에서 오류가 발생했습니다."
        );
      }

      if (!data.paymentUrl || !data.fields) {
        popup.close();
        throw new Error("결제 요청 정보가 올바르지 않습니다.");
      }

      const form = document.createElement("form");

      form.method = "POST";
      form.action = data.paymentUrl;
      form.target = "kovanPayment";
      form.acceptCharset = "UTF-8";

      Object.entries(data.fields).forEach(([name, value]) => {
        const input = document.createElement("input");

        input.type = "hidden";
        input.name = name;
        input.value = String(value ?? "");

        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      form.remove();

      popup.focus();

      setMessage("결제창이 열렸습니다. 결제를 진행해주세요.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "결제 준비 중 오류가 발생했습니다.";

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (!selectedProduct) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />

        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            존재하지 않는 상품입니다.
          </h1>

          <p className="mt-4 text-gray-600">
            상품 주소를 다시 확인해주세요.
          </p>

          <a
            href="/card-terminal"
            className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            전체 상품 보기
          </a>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-10">
          <a
            href="/card-terminal"
            className="text-blue-600 font-semibold"
          >
            ← 카드단말기 목록으로
          </a>

          <p className="text-blue-600 font-semibold mt-8 mb-3">
            사장님찬스 주문서
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            주문 정보를 입력해주세요.
          </h1>

          <p className="mt-4 text-gray-600">
            주문 정보를 확인한 뒤 코밴 테스트 결제창으로 이동합니다.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm"
        >
          <div className="space-y-8">
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
              <p className="text-sm text-gray-500">결제 상품</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {selectedProduct.name}
              </p>

              <p className="text-2xl font-bold text-blue-600 mt-3">
                {selectedProduct.price.toLocaleString()}원
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="buyerName"
                  className="block font-semibold text-gray-900 mb-2"
                >
                  구매자명 <span className="text-red-500">*</span>
                </label>

                <input
                  id="buyerName"
                  type="text"
                  value={buyerName}
                  onChange={(event) => setBuyerName(event.target.value)}
                  placeholder="홍길동"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="buyerPhone"
                  className="block font-semibold text-gray-900 mb-2"
                >
                  연락처 <span className="text-red-500">*</span>
                </label>

                <input
                  id="buyerPhone"
                  type="tel"
                  value={buyerPhone}
                  onChange={(event) => setBuyerPhone(event.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="buyerEmail"
                  className="block font-semibold text-gray-900 mb-2"
                >
                  이메일
                </label>

                <input
                  id="buyerEmail"
                  type="email"
                  value={buyerEmail}
                  onChange={(event) => setBuyerEmail(event.target.value)}
                  placeholder="example@email.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="businessName"
                  className="block font-semibold text-gray-900 mb-2"
                >
                  상호명
                </label>

                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  placeholder="상호명을 입력해주세요"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="requestNote"
                className="block font-semibold text-gray-900 mb-2"
              >
                요청사항
              </label>

              <textarea
                id="requestNote"
                value={requestNote}
                onChange={(event) => setRequestNote(event.target.value)}
                placeholder="설치 일정이나 요청사항을 입력해주세요."
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-600"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer rounded-2xl bg-gray-50 p-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-1 w-4 h-4"
              />

              <span className="text-sm text-gray-600 leading-relaxed">
                주문 처리와 결제 진행을 위한 개인정보 수집 및 이용에
                동의합니다. <span className="text-red-500">(필수)</span>
              </span>
            </label>

            {message && (
              <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-2xl px-6 py-4 text-lg font-bold transition"
            >
              {loading
                ? "결제 준비 중..."
                : `${selectedProduct.price.toLocaleString()}원 결제하기`}
            </button>

            <p className="text-xs text-center text-gray-500">
              현재 코밴 개발기 테스트 결제로 진행됩니다.
            </p>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}