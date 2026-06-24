import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

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
              <h1 className="text-2xl font-bold text-gray-900">사장님찬스</h1>
              <p className="text-xs text-gray-500">카드단말기 전문몰</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-8">
            <a href="/card-terminal">카드단말기</a>
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
              href="#contact"
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
              사장님을 위한 카드단말기 전문몰
            </p>

            <h2 className="text-6xl font-bold leading-tight text-gray-900">
              매장 결제,
              <br />
              쉽게 준비하세요.
            </h2>

            <p className="mt-8 text-xl text-gray-600 leading-relaxed">
              토스 프론트2부터 무선 카드단말기까지
              <br />
              매장 환경에 맞는 카드단말기를 안내드립니다.
            </p>

            <div className="mt-10 flex gap-4">
              <a
                href="#contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold"
              >
                무료 상담 신청
              </a>

              <a
                href="/card-terminal"
                className="border border-gray-300 px-8 py-4 rounded-2xl font-semibold"
              >
                상품 보기
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="px-4 py-2 bg-gray-100 rounded-full">
                카드단말기
              </span>
              <span className="px-4 py-2 bg-gray-100 rounded-full">
                토스 프론트2
              </span>
              <span className="px-4 py-2 bg-gray-100 rounded-full">
                무선 카드단말기
              </span>
              <span className="px-4 py-2 bg-gray-100 rounded-full">
                무료 상담
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-6 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>

            <div className="relative bg-white border border-gray-200 rounded-[32px] p-8 shadow-xl">
              <div className="mb-6">
                <p className="text-sm text-gray-500">사장님찬스 추천</p>
                <h3 className="text-2xl font-bold mt-1">
                  매장 결제에 필요한 단말기를 한 번에
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
                      <p className="text-sm text-gray-500">
                        토스 · 무선 · 영수증 프린터
                      </p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-semibold">보기</span>
                </div>

                <div className="flex items-center justify-between border rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                      🧾
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">영수증 프린터 구성</h4>
                      <p className="text-sm text-gray-500">
                        영수증 출력이 필요한 매장 추천
                      </p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-semibold">보기</span>
                </div>

                <div className="flex items-center justify-between border rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                      📡
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">무선 카드단말기</h4>
                      <p className="text-sm text-gray-500">
                        이동형 매장 · 행사장 · 배달 추천
                      </p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-semibold">보기</span>
                </div>
              </div>

              <div className="mt-6 bg-blue-600 text-white rounded-2xl p-5">
                <p className="text-sm opacity-80">전화 상담 가능</p>
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
              상담부터 단말기 안내까지, 한 번에 진행합니다.
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
              <p className="mt-4 text-xl font-bold">설치 상담</p>
              <p className="mt-3 text-gray-300">
                카드단말기, 영수증 프린터, 무선단말기까지 안내합니다.
              </p>
            </div>

            <div className="bg-white/10 rounded-3xl p-7">
              <p className="text-5xl font-bold text-blue-400">98%</p>
              <p className="mt-4 text-xl font-bold">고객 만족도</p>
              <p className="mt-3 text-gray-300">
                상담부터 안내 이후 관리까지 만족도 중심으로 운영합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold text-center mb-4">
          카드단말기를 찾고 계신가요?
        </h2>

        <p className="text-center text-gray-500 mb-12">
          매장 환경에 맞는 카드단말기 상품을 확인해보세요.
        </p>

        <div className="grid md:grid-cols-1 gap-8 max-w-md mx-auto">
          <a
            href="/card-terminal"
            className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl mb-6">
              💳
            </div>

            <h3 className="text-3xl font-bold mb-3">카드단말기</h3>

            <p className="text-gray-600 leading-relaxed mb-6">
              토스 프론트2 · 영수증 프린터 · 토스 터미널2 · 무선 카드단말기
              <br />
              매장에 맞는 단말기 상품을 확인해보세요.
            </p>

            <span className="text-blue-600 font-semibold">상품 보기 →</span>
          </a>
        </div>
      </section>

      <ContactForm />
    </main>
  );
}