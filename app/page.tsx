import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Image from "next/image";
import { BadgePercent, ClipboardCheck, Store } from "lucide-react";

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
      price: "39,000원",
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
      desc: "KT LTE 무선 단말기",
      price: "100원",
      image: "/images/wireless.png",
      href: "/wireless",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 메인 영역 */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-blue-600 font-semibold text-lg mb-4">
              사장님을 위한 카드단말기 전문몰
            </p>

            <h2 className="text-[38px] md:text-6xl font-bold leading-tight text-gray-900 whitespace-nowrap">
              매장 결제,
              <br />
              쉽게 준비하세요.
            </h2>

            <p className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed">
              토스 프론트2부터 무선 카드단말기까지
              <br className="hidden sm:block" />
              매장 환경에 맞는 카드단말기를 안내드립니다.
            </p>

            <div className="mt-10 flex flex-wrap gap-3 md:gap-4">
              <a
                href="#contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-4 rounded-2xl font-semibold transition"
              >
                무료 상담 신청
              </a>

              <a
                href="/card-terminal"
                className="border border-gray-300 hover:border-blue-600 hover:text-blue-600 px-6 md:px-8 py-4 rounded-2xl font-semibold transition"
              >
                상품 보기
              </a>


            </div>
          </div>

          {/* 추천 상품 */}
          <div className="relative">
            <div className="absolute -top-10 -right-6 w-72 h-72 bg-blue-100 rounded-full blur-3xl" />

            <div className="relative bg-white border border-gray-200 rounded-[32px] p-5 md:p-6 shadow-xl">
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
                    className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg hover:border-blue-200 transition bg-white"
                  >
                    <div className="h-32 bg-gray-50 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={220}
                        height={160}
                        className="max-h-28 object-contain"
                      />
                    </div>

                    <h4 className="font-bold text-lg text-gray-900 min-h-[56px]">
                      {product.title}
                    </h4>

                    <p className="text-sm text-gray-500 mt-1 min-h-[40px]">
                      {product.desc}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-blue-600 font-bold">
                        {product.price}
                      </span>

                      <span className="inline-flex items-center justify-center rounded-xl border border-blue-600 px-3 py-2 text-sm text-blue-600 font-semibold">
                        자세히 보기
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <a
                href="tel:01079083099"
                className="mt-6 block bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 text-center transition"
              >
                <p className="text-sm opacity-90">전화 상담 가능</p>
                <p className="text-2xl font-bold mt-1">010-7908-3099</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 사장님찬스를 선택하는 이유 */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-blue-600 font-semibold mb-3">
              사장님이 사장님찬스를 선택하는 이유
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              개통부터 설치와 사후관리까지
              <br className="hidden md:block" />
              하나의 창구에서 해결하세요.
            </h2>

            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              여러 업체를 따로 알아보는 번거로움 없이
              <br className="hidden sm:block" />
              전담 매니저가 매장 환경에 맞춰 안내해드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-7 md:p-8 shadow-sm hover:shadow-lg transition">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <ClipboardCheck size={28} strokeWidth={2.2} />
              </div>

              <p className="text-sm font-bold text-blue-600 mb-2">
                ONE-STOP 진행
              </p>

              <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                복잡한 개통 절차,
                <br />
                한 번에 해결
              </h3>

              <p className="mt-5 text-gray-600 leading-relaxed">
                대리점 여러 곳을 방문할 필요 없이 통신·POS·PG 관련 절차를
                전담 매니저 한 명이 처음부터 끝까지 안내합니다.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-7 md:p-8 shadow-sm hover:shadow-lg transition">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Store size={28} strokeWidth={2.2} />
              </div>

              <p className="text-sm font-bold text-blue-600 mb-2">
                업종별 맞춤 추천
              </p>

              <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                매장에 꼭 맞는
                <br />
                기기 구성 안내
              </h3>

              <p className="mt-5 text-gray-600 leading-relaxed">
                카페·식당·미용실·병원 등 업종과 운영 방식에 맞는
                POS, 카드단말기, 영수증 프린터 구성을 추천합니다.
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-950 rounded-3xl p-7 md:p-8 shadow-sm hover:shadow-lg transition text-white">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6">
                <BadgePercent size={28} strokeWidth={2.2} />
              </div>

              <p className="text-sm font-bold text-blue-400 mb-2">
                결합 혜택 점검
              </p>

              <h3 className="text-2xl font-bold leading-snug">
                통신과 결제 인프라
                <br />
                고정비 절감
              </h3>

              <p className="mt-5 text-gray-300 leading-relaxed">
                통신과 결제 인프라를 함께 점검해 적용 가능한 결합 혜택과
                매월 절감 가능한 비용을 상담을 통해 안내해드립니다.
              </p>

              <a
                href="#contact"
                className="mt-7 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                절감 가능 금액 확인하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 전체 상품 이동 */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
          카드단말기를 찾고 계신가요?
        </h2>

        <p className="text-center text-gray-500 mb-10 md:mb-12">
          매장 환경에 맞는 카드단말기 상품을 확인해보세요.
        </p>

        <div className="text-center">
          <a
            href="/card-terminal"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
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