import { Phone, FileText, PackageSearch } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          {/* 로고 */}
          <a href="/" className="flex shrink-0 flex-col items-start">
            <Image
              src="/images/logo-main.png"
              alt="사장님찬스"
              width={180}
              height={50}
              priority
            />

            <p className="ml-1 mt-1 text-xs text-gray-500">
              카드단말기 · POS · PG 전문
            </p>
          </a>

          {/* PC 메뉴 */}
          <nav className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
            <a
              href="/card-terminal"
              className="transition hover:text-blue-600"
            >
              카드단말기
            </a>

            <a
              href="/#contact"
              className="transition hover:text-blue-600"
            >
              상담신청
            </a>

            <a
              href="/order-check"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-600 px-4 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <PackageSearch size={18} strokeWidth={2.4} />
              주문·배송조회
            </a>
          </nav>

          {/* 우측 버튼 */}
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <a
              href="tel:01079083099"
              aria-label="전화하기"
              className="flex h-10 w-10 items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 md:h-auto md:w-auto md:px-4 md:py-2 md:text-base"
            >
              <Phone size={18} strokeWidth={2.5} />
              <span className="hidden md:inline">전화하기</span>
            </a>

            <a
              href="https://pf.kakao.com/_xcxhFen/chat"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="카카오톡 상담"
              className="flex h-10 w-10 items-center justify-center gap-2 rounded-xl bg-yellow-400 text-sm font-semibold text-black transition hover:bg-yellow-500 md:h-auto md:w-auto md:px-4 md:py-2 md:text-base"
            >
              <Image
                src="/images/kakao.png"
                alt="카카오톡"
                width={24}
                height={24}
                className="shrink-0"
              />
              <span className="hidden md:inline">카카오톡</span>
            </a>

            <a
              href="/#contact"
              aria-label="문의하기"
              className="flex h-10 w-10 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 md:h-auto md:w-auto md:px-4 md:py-2 md:text-base"
            >
              <FileText size={18} strokeWidth={2.5} />
              <span className="hidden md:inline">문의하기</span>
            </a>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      <div className="sticky top-20 z-40 border-b bg-white md:hidden">
        <div className="grid grid-cols-3 text-center text-sm">
          <a
            href="/card-terminal"
            className="border-b-2 border-blue-600 py-3 font-semibold text-blue-600"
          >
            카드단말기
          </a>

          <a
            href="/#contact"
            className="py-3 font-medium text-gray-700"
          >
            상담신청
          </a>

          <a
            href="/order-check"
            className="py-3 font-semibold text-blue-600"
          >
            주문·배송조회
          </a>
        </div>
      </div>
    </>
  );
}