import Image from "next/image";
import { Check, Phone, ShoppingCart } from "lucide-react";

type ProductHeroProps = {
  category?: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  price: string;
  originalPrice?: string;
  checkoutUrl: string;
  features: string[];
};

export default function ProductHero({
  category = "카드단말기",
  title,
  description,
  image,
  imageAlt,
  price,
  originalPrice,
  checkoutUrl,
  features,
}: ProductHeroProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-32 pb-16 md:pt-24 md:pb-20">
      <a
        href="/card-terminal"
        className="inline-flex text-blue-600 font-semibold hover:text-blue-700"
      >
        ← 카드단말기 목록으로
      </a>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* 왼쪽 상품 이미지 */}
        <div className="flex min-h-[420px] items-center justify-center rounded-[32px] border border-gray-200 bg-gray-50 p-6 md:p-10">
          <Image
            src={image}
            alt={imageAlt}
            width={700}
            height={700}
            className="h-auto max-h-[520px] w-full object-contain"
            priority
          />
        </div>

        {/* 오른쪽 상품 정보 */}
        <div className="self-start lg:sticky lg:top-28">
          <p className="mb-3 font-semibold text-blue-600">{category}</p>

          <h1 className="text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
            {title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            {description}
          </p>

          {/* 가격 */}
          <div className="mt-8 border-y border-gray-200 py-7">
            <p className="text-sm font-medium text-gray-500">판매가</p>

            {originalPrice && (
              <p className="mt-2 text-lg text-gray-400 line-through">
                {originalPrice}
              </p>
            )}

            <p className="mt-1 text-4xl font-bold tracking-tight text-blue-600">
              {price}
            </p>
          </div>

          {/* 상품 특징 */}
          <div className="mt-7 rounded-3xl bg-gray-50 p-6">
            <ul className="space-y-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-base font-medium text-gray-800 md:text-lg"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check size={15} strokeWidth={3} />
                  </span>

                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 버튼 */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href={checkoutUrl}
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <ShoppingCart size={21} />
              {price} 구매하기
            </a>

<a
  href="/#contact"
  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-blue-600 bg-white px-6 py-4 text-lg font-bold text-blue-600 transition hover:bg-blue-50 hover:shadow-md"
>
  <Phone size={21} />
  상담 신청
</a>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            상품 및 설치 관련 문의는 상담 신청을 이용해주세요.
          </p>
        </div>
      </div>
    </section>
  );
}