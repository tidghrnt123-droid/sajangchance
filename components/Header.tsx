export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-bold">SC</span>
            </div>

            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 whitespace-nowrap">
                사장님찬스
              </h1>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                카드단말기 전문몰
              </p>
            </div>
          </a>

          <nav className="hidden md:flex gap-8">
            <a href="/card-terminal">카드단말기</a>
            <a href="/#contact">상담신청</a>
          </nav>

          <div className="flex items-center gap-1 md:gap-3 shrink-0">
            <a
              href="tel:01079083099"
              aria-label="전화문의"
              className="w-9 h-9 md:w-auto md:h-auto bg-green-600 hover:bg-green-700 text-white rounded-xl md:px-4 md:py-2 flex items-center justify-center text-sm md:text-base font-semibold transition"
            >
              <span className="md:hidden">☎</span>
              <span className="hidden md:inline">☎ 전화문의</span>
            </a>

            <a
              href="http://pf.kakao.com/_xcxhFen/chat"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="카카오톡 문의"
              className="w-9 h-9 md:w-auto md:h-auto bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl md:px-4 md:py-2 flex items-center justify-center text-sm md:text-base font-semibold transition"
            >
              <span className="md:hidden font-extrabold text-[11px]">TALK</span>
              <span className="hidden md:inline">TALK 카카오톡</span>
            </a>

            <a
              href="/#contact"
              aria-label="상담신청"
              className="w-9 h-9 md:w-auto md:h-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:px-4 md:py-2 flex items-center justify-center text-sm md:text-base font-semibold transition"
            >
              <span className="md:hidden">📄</span>
              <span className="hidden md:inline">📄 무료 상담</span>
            </a>
          </div>
        </div>
      </header>

      <div className="md:hidden sticky top-20 z-40 bg-white border-b">
        <div className="grid grid-cols-3 text-center text-sm">
          <a
            href="/card-terminal"
            className="py-3 border-b-2 border-blue-600 font-semibold text-blue-600"
          >
            카드단말기
          </a>

          <a href="/front2" className="py-3 font-medium text-gray-700">
            토스 프론트2
          </a>

          <a href="/wireless" className="py-3 font-medium text-gray-700">
            무선단말기
          </a>
        </div>
      </div>
    </>
  );
}