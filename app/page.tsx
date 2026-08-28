import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Image from "next/image";
import { BadgePercent, ClipboardCheck, Store } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type ProductRow = {
  product_code: string;
  name: string;
  short_description: string | null;
  price: number;
  thumbnail_url: string | null;
  detail_path: string | null;
  is_visible: boolean;
  is_featured: boolean;
  category: string;
  sort_order: number;
};

export default async function Home() {
  const {
    data: productData,
    error: productError,
  } = await supabaseAdmin
    .from("products")
    .select(
      `
        product_code,
        name,
        short_description,
        price,
        thumbnail_url,
        detail_path,
        is_visible,
        is_featured,
        category,
        sort_order
      `
    )
    .eq("category", "CARD_TERMINAL")
    .eq("is_visible", true)
    .eq("is_featured", true)
    .order("sort_order", {
      ascending: true,
    })
    .limit(4);

  if (productError) {
    console.error(
      "Home featured products load error:",
      productError
    );
  }

  const products =
    (productData ?? []) as ProductRow[];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 메인 영역 */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-lg font-semibold text-blue-600">
              사장님을 위한 카드단말기 전문몰
            </p>

            <h2 className="whitespace-nowrap text-[38px] font-bold leading-tight text-gray-900 md:text-6xl">
              매장 결제,
              <br />
              쉽게 준비하세요.
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-gray-600 md:text-xl">
              토스 프론트2부터 무선 카드단말기까지
              <br className="hidden sm:block" />
              매장 환경에 맞는 카드단말기를 안내드립니다.
            </p>

            <div className="mt-10 flex flex-wrap gap-3 md:gap-4">
              <a
                href="#contact"
                className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 md:px-8"
              >
                무료 상담 신청
              </a>

              <a
                href="/card-terminal"
                className="rounded-2xl border border-gray-300 px-6 py-4 font-semibold transition hover:border-blue-600 hover:text-blue-600 md:px-8"
              >
                상품 보기
              </a>
            </div>
          </div>

          {/* 추천 상품 */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />

            <div className="relative rounded-[32px] border border-gray-200 bg-white p-5 shadow-xl md:p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  사장님찬스 추천상품
                </p>

                <h3 className="mt-1 text-2xl font-bold text-gray-900">
                  판매 중인 카드단말기
                </h3>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {products.map((product) => {
                    const href =
                      product.detail_path ||
                      `/card-terminal`;

                    const image =
                      product.thumbnail_url ||
                      "/images/front2.png";

                    return (
                      <a
                        key={product.product_code}
                        href={href}
                        className="rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-lg"
                      >
                        <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                          <Image
                            src={image}
                            alt={product.name}
                            width={220}
                            height={160}
                            className="max-h-28 object-contain"
                          />
                        </div>

                        <h4 className="min-h-[56px] text-lg font-bold text-gray-900">
                          {product.name}
                        </h4>

                        <p className="mt-1 min-h-[40px] text-sm text-gray-500">
                          {product.short_description ||
                            "상품 상세정보를 확인해보세요."}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="font-bold text-blue-600">
                            {Number(
                              product.price
                            ).toLocaleString()}
                            원
                          </span>

                          <span className="inline-flex items-center justify-center rounded-xl border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600">
                            자세히 보기
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl bg-gray-50 px-5 py-10 text-center text-sm text-gray-500">
                  현재 표시할 추천상품이 없습니다.
                </div>
              )}

              <a
                href="tel:01079083099"
                className="mt-6 block rounded-2xl bg-blue-600 p-5 text-center text-white transition hover:bg-blue-700"
              >
                <p className="text-sm opacity-90">
                  전화 상담 가능
                </p>

                <p className="mt-1 text-2xl font-bold">
                  010-7908-3099
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 사장님찬스를 선택하는 이유 */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 font-semibold text-blue-600">
              사장님이 사장님찬스를 선택하는 이유
            </p>

            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              상담부터 설치
              <br />
              사후관리까지
              <br />
              단 한번에 해결하세요.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              여러 업체를 따로 알아보는 번거로움 없이
              <br className="hidden sm:block" />
              전담 매니저가 매장 환경에 맞춰 안내해드립니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:shadow-lg md:p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ClipboardCheck
                  size={28}
                  strokeWidth={2.2}
                />
              </div>

              <p className="mb-2 text-sm font-bold text-blue-600">
                ONE-STOP 진행
              </p>

              <h3 className="text-2xl font-bold leading-snug text-gray-900">
                복잡한 개통 절차,
                <br />
                한 번에 해결
              </h3>

              <p className="mt-5 leading-relaxed text-gray-600">
                대리점 여러 곳을 방문할 필요 없이 통신·POS·PG 관련 절차를
                전담 매니저 한 명이 처음부터 끝까지 안내합니다.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:shadow-lg md:p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Store
                  size={28}
                  strokeWidth={2.2}
                />
              </div>

              <p className="mb-2 text-sm font-bold text-blue-600">
                업종별 맞춤 추천
              </p>

              <h3 className="text-2xl font-bold leading-snug text-gray-900">
                매장에 꼭 맞는
                <br />
                기기 구성 안내
              </h3>

              <p className="mt-5 leading-relaxed text-gray-600">
                카페·식당·미용실·병원 등 업종과 운영 방식에 맞는
                POS, 카드단말기, 영수증 프린터 구성을 추천합니다.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-950 bg-gray-950 p-7 text-white shadow-sm transition hover:shadow-lg md:p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <BadgePercent
                  size={28}
                  strokeWidth={2.2}
                />
              </div>

              <p className="mb-2 text-sm font-bold text-blue-400">
                결합 혜택 점검
              </p>

              <h3 className="text-2xl font-bold leading-snug">
                통신과 결제 인프라
                <br />
                고정비 절감
              </h3>

              <p className="mt-5 leading-relaxed text-gray-300">
                통신과 결제 인프라를 함께 점검해 적용 가능한 결합 혜택과
                매월 절감 가능한 비용을 상담을 통해 안내해드립니다.
              </p>

              <a
                href="#contact"
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                절감 가능 금액 확인하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 전체 상품 이동 */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          카드단말기를 찾고 계신가요?
        </h2>

        <p className="mb-10 text-center text-gray-500 md:mb-12">
          매장 환경에 맞는 카드단말기 상품을 확인해보세요.
        </p>

        <div className="text-center">
          <a
            href="/card-terminal"
            className="inline-block rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
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
