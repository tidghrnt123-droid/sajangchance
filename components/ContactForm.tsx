"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [products, setProducts] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwPMLZtXEIMJ4k7VcaDhSPETBtaFaT_iGuKAgj38MzS3gbAGhbGAnjyjkCKq_LrzUcR/exec";

  function toggleProduct(value: string) {
    if (products.includes(value)) {
      setProducts(products.filter((item) => item !== value));
    } else {
      setProducts([...products, value]);
    }
  }

  async function submitContact() {
    if (!name.trim() || !phone.trim()) {
      alert("성함과 연락처를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const params = new URLSearchParams();
    params.append("name", name);
    params.append("phone", phone);
    params.append("product", products.join(", "));
    params.append("message", message);
    params.append("pageUrl", window.location.href);
    params.append("ua", navigator.userAgent);

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
      });

      setIsDone(true);
      setName("");
      setPhone("");
      setProducts([]);
      setMessage("");

      alert("상담 신청이 접수되었습니다.");
    } catch (error) {
      alert("접수 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="max-w-5xl mx-auto px-6 py-24">
      <div className="bg-white border border-gray-200 rounded-[32px] p-10 shadow-sm">
        <div className="text-center mb-10">
          <p className="text-blue-600 font-semibold mb-3">사장님 맞춤 상담</p>
          <h2 className="text-4xl font-bold">무료 상담 신청</h2>
          <p className="text-gray-500 mt-4">
            카드단말기 · 인터넷 · 휴대폰 비교
            <br />
            전문 상담사가 직접 안내드립니다.
          </p>
        </div>

        {isDone && (
          <div className="mb-6 rounded-2xl bg-blue-50 p-5 text-center text-blue-700 font-semibold">
            상담 신청이 접수되었습니다. 순차적으로 연락드리겠습니다.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">성함</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="성함을 입력해주세요"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">연락처</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              placeholder="010-0000-0000"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block mb-3 font-medium">관심 상품</label>

          <div className="flex flex-wrap gap-5">
            <label>
              <input
                type="checkbox"
                checked={products.includes("카드단말기")}
                onChange={() => toggleProduct("카드단말기")}
              />{" "}
              카드단말기
            </label>

            <label>
              <input
                type="checkbox"
                checked={products.includes("인터넷")}
                onChange={() => toggleProduct("인터넷")}
              />{" "}
              인터넷
            </label>

            <label>
              <input
                type="checkbox"
                checked={products.includes("휴대폰 비교")}
                onChange={() => toggleProduct("휴대폰 비교")}
              />{" "}
              휴대폰 비교
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-medium">문의내용 (선택)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="문의사항을 입력해주세요."
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

      <button
  type="button"
  onClick={submitContact}
  disabled={isSubmitting}
  className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-semibold transition cursor-pointer disabled:bg-gray-400"
>
  {isSubmitting ? "접수 중..." : "무료 상담 신청하기"}
</button>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span>✓ 상담 비용 없음</span>
          <span>✓ 비교 후 결정 가능</span>
          <span>✓ 전문 상담 가능</span>
        </div>
      </div>
    </section>
  );
}