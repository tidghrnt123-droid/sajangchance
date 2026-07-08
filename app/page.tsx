import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  const products = [
    {
      title: "토스 프론트2",
      desc: "POS 연동형 · 월 사용료 없음",
      price: "100원",
      image: "/images/front2.png",
      href: "/front2",
    },
    {
      title: "프론트2 + 영수증 프린터",
      desc: "카페 · 병원 · 뷰티샵 추천",
      price: "79,000원",
      image: "/images/front2-printer.png",
      href: "/front2-printer",
    },
    {
      title: "프론트2 + 토스 터미널2",
      desc: "영수증 출력 · 금액 입력 가능",
      price: "139,000원",
      image: "/images/front2-terminal2.png",
      href: "/front2-terminal2",
    },
    {
      title: "무선 카드단말기",
      desc: "KT · SK LTE 무선 단말기",
      price: "100원",
      image: "/images/wireless.png",
      href: "/wireless",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-blue-600 font-semibold text-lg mb-4">
              사장님을 위한 카드단말기 전문몰
            </p>

            <h2 className="text-[38px] md:text-6xl font-bold leading-tight text-gray-900 whitespace-nowrap">
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
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-6 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>

            <div className="relative bg-white border border-gray-200 rounded-[32px] p-6 shadow-xl">
              <div className="mb-6">
                <p className="text-sm text-gray-500">사장님찬스 추천상품</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">
                  판매 중인 카드단말기
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((product) => (
                  <a
                    key={product.title}
                    href={product.href}
                    className="border rounded-2xl p-4 hover:shadow-lg transition bg-white"
                  >
                    <div className="h-32 bg-gray-50 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={180}
                        height={140}
                        className="max-h-28 object-contain"
                      />
                    </div>

                    <h4 className="font-bold text-lg text-gray-900">
                      {product.title}
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      {product.desc}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-blue-600 font-bold">
                        {product.price}
                      </span>

                      <span className="text-sm text-blue-600 font-semibold">
                        자세히 보기 →
                      </span>
                    </div>
                  </a>
                ))}
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
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          카드단말기를 찾고 계신가요?
        </h2>

        <p className="text-center text-gray-500 mb-12">
          매장 환경에 맞는 카드단말기 상품을 확인해보세요.
        </p>

        <div className="text-center">
          <a
            href="/card-terminal"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold"
          >
            전체 상품 보기 →
          </a>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </main>
  );
}