export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm leading-7">
        <div className="flex flex-wrap gap-5 font-semibold mb-6">
          <a href="/card-terminal">카드단말기</a>
          <a href="/#contact">상담예약</a>
        </div>

        <div className="space-y-2 text-gray-300">
          <p>
            <span className="font-semibold text-white">사장님찬스</span> | 카드단말기 · 매장 결제 솔루션
          </p>

          <p>
            주식회사 호 | 대표: 권준호
          </p>

          <p>
            사업자등록번호: 562-88-03099
          </p>

          <p>
            주소: 경기도 김포시 김포한강10로 133번길 126, 에이동 1층 110-에이03호
          </p>

          <p>
            E-mail: 562-88@naver.com | Tel. 010-7908-3099 | 정보관리 책임자: 권준호
          </p>

          <p className="pt-4">
            모든 거래에 대한 책임과 배송, 교환, 환불 민원 등의 처리는 주식회사 호에서 진행합니다.
          </p>

          <p>
            자세한 문의는 E-mail: 562-88@naver.com, 유선: 010-7908-3099 으로 가능합니다.
          </p>

          <p className="pt-4">
            통신판매업신고번호: 2025-경기김포-7309호
          </p>
        </div>

        <p className="mt-8 text-gray-400">
          Copyright © 2026 사장님찬스. All rights reserved.
        </p>
      </div>
    </footer>
  );
}