"use client";

import {
  MessageCircle,
  PackageSearch,
  ShoppingCart,
  Phone,
  MessagesSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";

const KAKAO_CHAT_URL = "https://pf.kakao.com/_xcxhFen/chat";
const PHONE_NUMBER = "01079083099";

/* =========================
   구매 가능한 상품
   카드단말기 + 휴대폰
========================= */
const productPages: Record<
  string,
  {
    checkoutUrl: string;
    price: string;
  }
> = {
  /* 카드단말기 */
  "/front2": {
    checkoutUrl: "/checkout/front2",
    price: "100원",
  },

  "/front2-printer": {
    checkoutUrl: "/checkout/front2-printer",
    price: "1,000원",
  },

  "/front2-terminal2": {
    checkoutUrl: "/checkout/front2-terminal2",
    price: "139,000원",
  },

  "/wireless": {
    checkoutUrl: "/checkout/wireless",
    price: "100원",
  },

  /* 휴대폰 */
  "/phone/a175": {
    checkoutUrl: "/checkout/a175",
    price: "100원",
  },

  "/phone/a175-study": {
    checkoutUrl: "/checkout/a175-study",
    price: "100원",
  },

  "/phone/m140": {
    checkoutUrl: "/checkout/m140",
    price: "100원",
  },

  "/phone/aroot-a1": {
    checkoutUrl: "/checkout/aroot-a1",
    price: "100원",
  },
};

/* =========================
   페이지별 이름
   카카오 문의 기록에 사용
========================= */
const pageNames: Record<string, string> = {
  "/": "사장님찬스 메인",

  "/card-terminal": "카드단말기 목록",

  "/front2": "토스 프론트2",
  "/front2-printer": "토스 프론트2 + 영수증 프린터",
  "/front2-terminal2": "토스 프론트2 + 토스 터미널2",
  "/wireless": "무선 카드단말기",

  "/phone": "휴대폰 목록",
  "/phone/a175": "갤럭시 A175",
  "/phone/a175-study": "갤럭시 A175 공부폰",
  "/phone/m140": "AT-M140 폴더폰",
  "/phone/aroot-a1": "에이루트 A1",
};

export default function FloatingButtons() {
  const pathname = usePathname();

  const hiddenPaths = ["/admin", "/checkout", "/payment"];

  if (hiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const currentProduct = productPages[pathname];
  const isProductPage = !!currentProduct;

  const currentPageName =
    pageNames[pathname] || pathname || "알 수 없는 페이지";

  /* =========================
     카카오 클릭 기록
  ========================= */
  const handleKakaoClick = () => {
    const data = {
      pageName: currentPageName,
      pathname,
      pageUrl: window.location.href,
      clickedAt: new Date().toISOString(),
    };

    try {
      fetch("/api/kakao-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  };

  return (
    <>
      {/* =========================
          PC
      ========================= */}
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

        {/* 전화하기 */}
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
        >
          <Phone size={21} />
          전화하기
        </a>

        {/* 카카오톡 */}
        <a
          href={KAKAO_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleKakaoClick}
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
            <MessagesSquare size={21} />
            상담 신청
          </a>
        )}

        {/* 상품페이지가 아닐 때만 주문조회 */}
        {!isProductPage && (
          <a
            href="/order-check"
            className="flex min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-black hover:shadow-xl"
          >
            <PackageSearch size={21} />
            주문·배송조회
          </a>
        )}
      </div>

      {/* =========================
          모바일
      ========================= */}
      <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          {isProductPage ? (
            <>
              {/* 1. 구매하기 */}
              <a
                href={currentProduct.checkoutUrl}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3.5 text-sm font-bold text-white"
              >
                <ShoppingCart size={18} />
                구매하기
              </a>

              {/* 2. 전화하기 */}
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-3.5 text-sm font-bold text-white"
              >
                <Phone size={18} />
                전화하기
              </a>

              {/* 3. 카카오톡 */}
              <a
                href={KAKAO_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleKakaoClick}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-3 py-3.5 text-sm font-bold text-[#191919]"
              >
                <MessageCircle size={18} />
                카카오톡
              </a>

              {/* 4. 상담신청 */}
              <a
                href="/#contact"
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-3 py-3.5 text-sm font-bold text-gray-800"
              >
                <MessagesSquare size={18} />
                상담신청
              </a>
            </>
          ) : (
            <>
              {/* 일반 페이지 - 카카오 */}
              <a
                href={KAKAO_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleKakaoClick}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-3 py-3.5 text-sm font-bold text-[#191919]"
              >
                <MessageCircle size={18} />
                카카오톡
              </a>

              {/* 일반 페이지 - 주문조회 */}
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