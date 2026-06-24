export default function BuyFront2PrinterPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-6 py-20">
        <a href="/card-terminal" className="text-blue-600 font-semibold">
          ← 상품 목록으로
        </a>

        <div className="mt-8 border border-gray-200 rounded-3xl p-8 shadow-sm">
          <p className="text-blue-600 font-semibold mb-3">주문서</p>

          <h1 className="text-4xl font-bold mb-4">
            토스 프론트2 + 영수증 프린터
          </h1>

          <p className="text-3xl font-bold text-blue-600 mb-8">
            79,000원
          </p>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">성함</label>
              <input
                type="text"
                placeholder="성함을 입력해주세요"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">연락처</label>
              <input
                type="text"
                placeholder="010-0000-0000"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">배송지 주소</label>
              <input
                type="text"
                placeholder="주소를 입력해주세요"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">요청사항</label>
              <textarea
                rows={4}
                placeholder="요청사항을 입력해주세요"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          <button className="mt-8 w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-semibold">
            결제하기
          </button>

          <p className="text-sm text-gray-500 mt-5 text-center">
            결제 기능은 다음 단계에서 PG와 연결됩니다.
          </p>
        </div>
      </section>
    </main>
  );
}