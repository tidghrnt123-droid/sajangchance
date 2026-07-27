"use client";

import {
  MessageCircle,
  PackageSearch,
  ShoppingCart,
  Phone,
} from "lucide-react";
import { usePathname } from "next/navigation";

const KAKAO_CHAT_URL = "https://pf.kakao.com/_xcxhFen/chat";

const productPages: Record<
  string,
  {
    checkoutUrl: string;
    price: string;
  }
> = {
  "/front2": {
    checkoutUrl: "/checkout/front2",
    price: "100원",
  },
  "/front2-printer": {
    checkoutUrl: "/checkout/front2-printer",
    price: "39,000원",
  },
  "/front2-terminal2": {
    checkoutUrl: "/checkout/front2-terminal2",
    price: "139,000원",
  },
  "/wireless": {
    checkoutUrl: "/checkout/wireless",
    price: "100원",
  },
};

export default function FloatingButtons() {
  const pathname = usePathname();

  const hiddenPaths = ["/admin", "/checkout", "/payment"];

  if (hiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const currentProduct = productPages[pathname];
  const isProductPage = !!currentProduct;

  return (
    <>
      {/* PC */}
      <div className="fixed bottom-7 right-7 z-[100] hidden flex-col gap-3 md:flex">
        {/* 구매하기 */}
        {isProductPage && (
          <a
            href={currentProduct.checkoutUrl}
            className="flex min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-5 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
          >
            <ShoppingCart size={21} />
            {currentProduct.price} 구매하기
          </a>
        )}

        {/* 주문조회 */}
        <a
          href="/order-check"
          className="flex min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-black hover:shadow-xl"
        >
          <PackageSearch size={21} />
          주문·배송조회
        </a>

        {/* 카카오 */}
        <a
          href={KAKAO_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-5 py-4 font-bold text-[#191919] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <MessageCircle size={21} />
          카카오톡 문의
        </a>

        {/* 상담신청 */}
        {isProductPage && (
          <a
            href="/#contact"
            className="flex min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-gray-100 px-5 py-4 font-bold text-gray-800 shadow-lg transition hover:-translate-y-1 hover:bg-gray-200 hover:shadow-xl"
          >
            <Phone size={21} />
            상담 신청
          </a>
        )}
      </div>

      {/* 모바일 */}
      <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          {isProductPage && (
            <>
              <a
                href={currentProduct.checkoutUrl}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3.5 text-sm font-bold text-white"
              >
                <ShoppingCart size={18} />
                구매하기
              </a>

              <a
                href="/order-check"
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-3.5 text-sm font-bold text-white"
              >
                <PackageSearch size={18} />
                주문조회
              </a>

              <a
                href={KAKAO_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-3 py-3.5 text-sm font-bold text-[#191919]"
              >
                <MessageCircle size={18} />
                카카오톡
              </a>

              <a
                href="/#contact"
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-3 py-3.5 text-sm font-bold text-gray-800"
              >
                <Phone size={18} />
                상담신청
              </a>
            </>
          )}

          {!isProductPage && (
            <>
              <a
                href={KAKAO_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-3 py-3.5 text-sm font-bold text-[#191919]"
              >
                <MessageCircle size={18} />
                카카오톡
              </a>

              <a
                href="/order-check"
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-3.5 text-sm font-bold text-white"
              >
                <PackageSearch size={18} />
                주문조회
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}