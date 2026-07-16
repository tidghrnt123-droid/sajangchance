"use client";

import { MessageCircle, PackageSearch } from "lucide-react";
import { usePathname } from "next/navigation";

const KAKAO_CHAT_URL = "https://pf.kakao.com/_xcxhFen/chat";

export default function FloatingButtons() {
  const pathname = usePathname();

  const hiddenPaths = [
    "/admin",
    "/checkout",
    "/payment",
  ];

  const shouldHide = hiddenPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldHide) {
    return null;
  }

  return (
    <>
      {/* PC: 우측 하단 세로 버튼 */}
      <div className="fixed bottom-7 right-7 z-[100] hidden flex-col gap-3 md:flex">
        <a
          href={KAKAO_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="카카오톡 문의"
          className="flex min-w-[178px] items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-5 py-4 font-bold text-[#191919] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <MessageCircle size={21} strokeWidth={2.4} />
          카카오톡 문의
        </a>

        <a
          href="/order-check"
          aria-label="주문 배송 조회"
          className="flex min-w-[178px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
        >
          <PackageSearch size={21} strokeWidth={2.4} />
          주문·배송조회
        </a>
      </div>

      {/* 모바일: 화면 하단 가로 버튼 */}
      <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="카카오톡 문의"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-3 py-3.5 text-sm font-bold text-[#191919]"
          >
            <MessageCircle size={19} strokeWidth={2.4} />
            카카오톡 문의
          </a>

          <a
            href="/order-check"
            aria-label="주문 배송 조회"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3.5 text-sm font-bold text-white"
          >
            <PackageSearch size={19} strokeWidth={2.4} />
            주문·배송조회
          </a>
        </div>
      </div>
    </>
  );
}