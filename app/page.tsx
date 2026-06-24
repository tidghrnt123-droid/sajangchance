import ContactForm from "../components/ContactForm";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
  <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
         <div className="flex items-center gap-4">
  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
    <span className="text-white text-xl font-bold">SC</span>
  </div>

  <div>
    <h1 className="text-2xl font-bold text-gray-900">
      사장님찬스
    </h1>

    <p className="text-xs text-gray-500">
      사장님을 위한 비교 플랫폼
    </p>
  </div>
</div>

<nav className="hidden md:flex gap-8">
  <a href="/card-terminal">카드단말기</a>
  <a href="/internet">인터넷</a>
  <a href="/mobile">휴대폰 비교</a>
  <a href="#contact">상담신청</a>
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

      <section className="max-w-7xl mx-auto px-6 py-24">
  <div className="grid lg:grid-cols-2 gap-16 items-center">
    <div>
      <p className="text-blue-600 font-semibold text-lg mb-4">
        사장님을 위한 비교 플랫폼
      </p>

      <h2 className="text-6xl font-bold leading-tight text-gray-900">
        비교하면,
        <br />
        비용이 달라집니다.
      </h2>

      <p className="mt-8 text-xl text-gray-600 leading-relaxed">
        카드단말기부터 인터넷,
        <br />
        휴대폰까지 가장 유리한 조건을 찾아드립니다.
      </p>

      <div className="mt-10 flex gap-4">
        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold">
          무료 상담 신청
        </button>

        <button className="border border-gray-300 px-8 py-4 rounded-2xl font-semibold">
          상품 비교하기
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-600">
        <span className="px-4 py-2 bg-gray-100 rounded-full">카드단말기 비교</span>
        <span className="px-4 py-2 bg-gray-100 rounded-full">인터넷 비교</span>
        <span className="px-4 py-2 bg-gray-100 rounded-full">휴대폰 비교</span>
        <span className="px-4 py-2 bg-gray-100 rounded-full">무료 상담</span>
      </div>
    </div>

    <div className="relative">
      <div className="absolute -top-10 -right-6 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>

      <div className="relative bg-white border border-gray-200 rounded-[32px] p-8 shadow-xl">
        <div className="mb-6">
          <p className="text-sm text-gray-500">사장님찬스 추천</p>
          <h3 className="text-2xl font-bold mt-1">
            매장에 필요한 상품을 한 번에
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                💳
              </div>
              <div>
                <h4 className="font-bold text-lg">카드단말기</h4>
                <p className="text-sm text-gray-500">무선 · 토스 · POS</p>
              </div>
            </div>
            <span className="text-blue-600 font-semibold">비교</span>
          </div>

          <div className="flex items-center justify-between border rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                🌐
              </div>
              <div>
                <h4 className="font-bold text-lg">인터넷</h4>
                <p className="text-sm text-gray-500">매장 인터넷 · 와이파이</p>
              </div>
            </div>
            <span className="text-blue-600 font-semibold">비교</span>
          </div>

          <div className="flex items-center justify-between border rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                📱
              </div>
              <div>
                <h4 className="font-bold text-lg">휴대폰 비교</h4>
                <p className="text-sm text-gray-500">SKT · KT · LGU+ · 알뜰폰</p>
              </div>
            </div>
            <span className="text-blue-600 font-semibold">비교</span>
          </div>
        </div>

        <div className="mt-6 bg-blue-600 text-white rounded-2xl p-5">
          <p className="text-sm opacity-80">무료 상담 가능</p>
          <p className="text-xl font-bold mt-1">010-7908-3099</p>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="max-w-7xl mx-auto px-6 pb-20">
  <div className="bg-gray-950 text-white rounded-[36px] p-10 md:p-12">
    <div className="mb-10">
      <p className="text-blue-400 font-semibold mb-3">
        사장님찬스가 선택받는 이유
      </p>
      <h2 className="text-3xl md:text-4xl font-bold">
        상담부터 설치까지, 한 번에 비교합니다.
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white/10 rounded-3xl p-7">
        <p className="text-5xl font-bold text-blue-400">2,000+</p>
        <p className="mt-4 text-xl font-bold">누적 상담</p>
        <p className="mt-3 text-gray-300">
          업종과 매장 환경에 맞춰 무료로 비교 상담합니다.
        </p>
      </div>

      <div className="bg-white/10 rounded-3xl p-7">
        <p className="text-5xl font-bold text-blue-400">800+</p>
        <p className="mt-4 text-xl font-bold">설치 완료</p>
        <p className="mt-3 text-gray-300">
          카드단말기, 인터넷, POS까지 설치 경험을 바탕으로 안내합니다.
        </p>
      </div>

      <div className="bg-white/10 rounded-3xl p-7">
        <p className="text-5xl font-bold text-blue-400">98%</p>
        <p className="mt-4 text-xl font-bold">고객 만족도</p>
        <p className="mt-3 text-gray-300">
          상담부터 설치 이후 관리까지 만족도 중심으로 운영합니다.
        </p>
      </div>
    </div>
  </div>
</section>
      <section className="max-w-7xl mx-auto px-6 pb-24">
  <h2 className="text-4xl font-bold text-center mb-4">
    어떤 상품을 찾고 계신가요?
  </h2>

  <p className="text-center text-gray-500 mb-12">
    필요한 상품을 선택하고 자세한 정보를 확인해보세요.
  </p>

  <div className="grid md:grid-cols-3 gap-8">
    
    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition duration-300">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl mb-6">
        💳
      </div>

      <h3 className="text-3xl font-bold mb-3">
        카드단말기
      </h3>

      <p className="text-gray-600 leading-relaxed mb-6">
        무선단말기 · 토스단말기 · POS · 키오스크
        <br />
        월 비용, 정산방식, 설치까지 비교해드립니다.
      </p>

      <button className="text-blue-600 font-semibold">
        자세히 보기 →
      </button>
    </div>

    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition duration-300">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl mb-6">
        🌐
      </div>

      <h3 className="text-3xl font-bold mb-3">
        인터넷
      </h3>

      <p className="text-gray-600 leading-relaxed mb-6">
        소상공인 인터넷 · 기업 인터넷 · 와이파이
        <br />
        통신사별 조건과 혜택을 비교해드립니다.
      </p>

      <button className="text-blue-600 font-semibold">
        자세히 보기 →
      </button>
    </div>

    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition duration-300">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl mb-6">
        📱
      </div>

      <h3 className="text-3xl font-bold mb-3">
        휴대폰 비교
      </h3>

      <p className="text-gray-600 leading-relaxed mb-6">
        SKT · KT · LGU+ · 알뜰폰
        <br />
        요금제와 단말 조건을 한눈에 비교해드립니다.
      </p>

      <button className="text-blue-600 font-semibold">
        자세히 보기 →
      </button>
    </div>

  </div>
</section>

<ContactForm />

</main>
  );
}