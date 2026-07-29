export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* 메뉴 */}
        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
          <a href="/card-terminal" className="hover:text-blue-400">
            카드단말기
          </a>

          <a href="/#contact" className="hover:text-blue-400">
            상담예약
          </a>

          <a href="/shipping" className="hover:text-blue-400">
            배송안내
          </a>

          <a href="/refund" className="hover:text-blue-400">
            교환·반품
          </a>

          <a href="/payment" className="hover:text-blue-400">
            결제안내
          </a>

          <a href="/terms" className="hover:text-blue-400">
            이용약관
          </a>

          <a href="/privacy" className="hover:text-blue-400">
            개인정보처리방침
          </a>
        </div>

        <div className="space-y-2 text-sm leading-7 text-gray-300">
          <p>
            <span className="font-semibold text-white">사장님찬스</span>
            {" "}| 카드단말기 · POS · PG 전문
          </p>

          <p>
            주식회사 호 | 대표 : 권준호
          </p>

          <p>
            사업자등록번호 : 562-88-03099
            {" "}|
            {" "}통신판매업신고번호 : 2025-경기김포-7309호
          </p>

          <p>
            주소 : 경기도 김포시 김포한강10로133번길 126,
            A동 1층 110-A03호
          </p>

          <p>
            고객센터 : 010-7908-3099
            {" "}|
            {" "}E-mail : 562-88@naver.com
          </p>

          <p>
            운영시간 : 평일 09:00 ~ 18:00
            (주말 및 공휴일 휴무)
          </p>

          <p className="pt-4 text-gray-400">
            모든 거래에 대한 책임과 배송, 교환, 환불은
            주식회사 호에서 책임지고 처리합니다.
          </p>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6 text-xs text-gray-500">
          Copyright © 2026 사장님찬스. All rights reserved.
        </div>
      </div>
    </footer>
  );
}