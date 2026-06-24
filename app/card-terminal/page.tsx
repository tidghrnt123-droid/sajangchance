import Image from "next/image";
import Footer from "../../components/Footer";

export default function CardTerminalPage() {
  return (
    
    <main className="min-h-screen bg-white">
   <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">SC</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">사장님찬스</h1>
              <p className="text-xs text-gray-500">사장님을 위한 비교 플랫폼</p>
            </div>
          </a>

          <nav className="hidden md:flex gap-8">
            <a href="/card-terminal">카드단말기</a>
            <a href="/internet">인터넷</a>
            <a href="/mobile">휴대폰 비교</a>
            <a href="/#contact">상담신청</a>
          </nav>

       <div className="flex items-center gap-3">
  <a
    href="tel:01079083099"
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition"
  >
    📞 전화문의
  </a>

  <a
    href="http://pf.kakao.com/_xcxhFen/chat"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold transition"
  >
    💬 카카오톡
  </a>

  <a
    href="/#contact"
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition"
  >
    무료 상담
  </a>
</div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-blue-600 font-semibold mb-4">카드단말기 비교</p>

        <h2 className="text-5xl font-bold leading-tight text-gray-900">
          매장에 맞는 카드단말기를
          <br />
          한 번에 비교하세요.
        </h2>

        <p className="mt-6 text-xl text-gray-600 leading-relaxed">
          토스 프론트2, 영수증 프린터 구성, 토스 터미널2,
          <br />
          무선 카드단말기까지 매장 환경에 맞춰 안내드립니다.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="border border-gray-200 rounded-3xl p-7 hover:shadow-xl transition flex flex-col">
            <Image
  src="/images/front2.png"
  alt="토스 프론트2"
  width={300}
  height={300}
className="w-full h-60 object-cover rounded-2xl mb-6"
/>

            <h3 className="text-2xl font-bold mb-3 min-h-[72px] flex items-center">
              토스 프론트2
            </h3>

            <p className="text-gray-600 leading-relaxed min-h-[120px] mb-6">
              무료 제공
              <br />
              POS 연동형
              <br />
              월 사용료 없음
            </p>

<div className="mt-auto space-y-3">
  <p className="text-2xl font-bold text-blue-600">100원</p>

  <div className="grid grid-cols-2 gap-3">
    <a
      href="/front2"
      className="block text-center border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold"
    >
      자세히 보기
    </a>

    <a
      href="/buy/front2"
      className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold"
    >
      구매하기
    </a>
  </div>
</div>
          </div>

          <div className="border border-gray-200 rounded-3xl p-7 hover:shadow-xl transition flex flex-col">
           <Image
  src="/images/front2-printer.png"
  alt="토스 프론트2 + 영수증 프린터"
  width={300}
  height={300}
  className="w-full h-60 object-cover rounded-2xl mb-6"
/>

            <h3 className="text-2xl font-bold mb-3 min-h-[72px] flex items-center">
              토스 프론트2 +<br />
              영수증 프린터
            </h3>

            <p className="text-gray-600 leading-relaxed min-h-[120px] mb-6">
                            카페 · 병원 · 뷰티샵 추천
              <br />
              영수증이 필요한 업종
              <br />
           
            </p>

          <div className="mt-auto space-y-3">
  <p className="text-2xl font-bold text-blue-600">79,000원</p>

  <div className="grid grid-cols-2 gap-3">
    <a
      href="/front2-printer"
      className="block text-center border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold"
    >
      자세히 보기
    </a>

    <a
      href="/buy/front2-printer"
      className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold"
    >
      구매하기
    </a>
  </div>
</div>
          </div>

          <div className="border border-gray-200 rounded-3xl p-7 hover:shadow-xl transition flex flex-col">
        <Image
  src="/images/front2-terminal2.png"
  alt="토스 프론트2 + 토스 터미널2"
  width={300}
  height={300}
  className="w-full h-60 object-cover rounded-2xl mb-6"
/>

            <h3 className="text-2xl font-bold mb-3 min-h-[72px] flex items-center">
              토스 프론트2 +<br />
              토스 터미널2
            </h3>

            <p className="text-gray-600 leading-relaxed min-h-[120px] mb-6">
                           영수증 출력과 금액을 입력하여 
                           결제까지 가능한 토스 세트
              <br />
        
            </p>

          <div className="mt-auto space-y-3">
  <p className="text-2xl font-bold text-blue-600">139,000원</p>

  <div className="grid grid-cols-2 gap-3">
    <a
      href="/front2-terminal2"
      className="block text-center border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold"
    >
      자세히 보기
    </a>

    <a
      href="/buy/front2-terminal2"
      className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold"
    >
      구매하기
    </a>
  </div>
</div>
          </div>

          <div className="border border-gray-200 rounded-3xl p-7 hover:shadow-xl transition flex flex-col">
         <Image
  src="/images/wireless.png"
  alt="무선 카드단말기"
  width={300}
  height={300}
className="w-full h-60 object-cover rounded-2xl mb-6"
/>

            <h3 className="text-2xl font-bold mb-3 min-h-[72px] flex items-center">
              무선 카드단말기
            </h3>

            <p className="text-gray-600 leading-relaxed min-h-[120px] mb-6">
              KT · SK LTE
              <br />
              월 통신료 11,000원
              <br />
              전국 어디서나 사용
            </p>

          <div className="mt-auto space-y-3">
  <p className="text-2xl font-bold text-blue-600">100원</p>

  <div className="grid grid-cols-2 gap-3">
    <a
      href="/wireless"
      className="block text-center border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold"
    >
      자세히 보기
    </a>

    <a
      href="/buy/wireless"
      className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold"
    >
      구매하기
    </a>
  </div>
</div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}