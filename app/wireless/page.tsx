import Image from "next/image";
import Footer from "../../components/Footer";


export default function WirelessPage() {
  const details = [
    "/images/lte1.png",
    "/images/lte2.png",
  ];

  return (
    <main className="bg-white">
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
      <section className="max-w-6xl mx-auto px-6 py-20">
        <a
          href="/card-terminal"
          className="text-blue-600 font-semibold"
        >
          ← 카드단말기 목록으로
        </a>

        <div className="mt-8">
          <p className="text-blue-600 font-semibold mb-3">
            무선 카드단말기
          </p>

          <h1 className="text-5xl font-bold mb-6">
            무선 카드단말기
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            KT · SK LTE 무선 카드단말기
          </p>

          <div className="bg-gray-50 rounded-3xl p-8 mb-10">
            <ul className="space-y-3 text-lg">
              <li>✓ KT · SK LTE 사용 가능</li>
              <li>✓ 월 통신료 11,000원</li>
              <li>✓ 애플페이 · 삼성페이 지원</li>
              <li>✓ 푸드트럭 · 배달 · 행사장 추천</li>
            </ul>
          </div>

<div className="flex gap-4">
  <a
    href="/buy/wireless"
    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold"
  >
    구매하기
  </a>

  <a
    href="/#contact"
    className="border border-blue-600 text-blue-600 px-8 py-4 rounded-2xl font-semibold"
  >
    상담 신청
  </a>
</div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto pb-20">
        <Image
          src="/images/SCTOP.png"
          alt="무선 카드단말기 상단 이미지"
          width={1200}
          height={1200}
          className="w-full"
          priority
        />

        {details.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`무선 카드단말기 상세 ${index + 1}`}
            width={1200}
            height={2000}
            className="w-full"
            priority={index === 0}
          />
        ))}
      </section>
         <Footer />
    </main>
  );
}