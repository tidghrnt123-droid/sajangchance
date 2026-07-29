import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "교환·반품 안내 | 사장님찬스",
  description: "사장님찬스 교환 및 반품 안내",
  alternates: {
    canonical: "https://sajangchance.com/refund",
  },
};

export default function RefundPage() {
  return (
    <PolicyLayout
      title="교환·반품 안내"
      description="교환 및 반품, 환불 정책을 안내드립니다."
    >
      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">
            교환 및 반품 가능 기간
          </h2>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm md:text-base">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="w-40 bg-gray-50 px-6 py-4 text-left font-semibold">
                    신청 기간
                  </th>
                  <td className="px-6 py-4">
                    상품 수령일로부터 7일 이내
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <th className="bg-gray-50 px-6 py-4 text-left font-semibold">
                    상품 불량 및 오배송
                  </th>
                  <td className="px-6 py-4">
                    판매자가 배송비를 부담하여 교환 또는 환불을 진행합니다.
                  </td>
                </tr>

                <tr>
                  <th className="bg-gray-50 px-6 py-4 text-left font-semibold">
                    단순 변심
                  </th>
                  <td className="px-6 py-4">
                    상품 수령 후 7일 이내 신청 가능하며,
                    왕복 배송비는 구매자가 부담합니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 md:p-8">
          <h2 className="text-xl font-bold text-blue-700">
            교환 및 반품이 가능한 경우
          </h2>

          <ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-gray-700">
            <li>상품에 하자가 있는 경우</li>
            <li>주문한 상품과 다른 상품이 배송된 경우</li>
            <li>상품 수령 후 7일 이내이며 미사용 상태인 경우</li>
            <li>상품의 포장 및 구성품이 모두 보존되어 있는 경우</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-red-100 bg-red-50 p-6 md:p-8">
          <h2 className="text-xl font-bold text-red-700">
            교환 및 반품이 불가능한 경우
          </h2>

          <ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-gray-700">
            <li>
              상품을 개봉하거나 사용하여 상품의 가치가 현저히 감소한 경우
            </li>

            <li>
              카드단말기의 등록, 개통, 설치 또는 사용이 시작된 경우
            </li>

            <li>
              고객의 부주의로 상품 또는 구성품이 훼손·분실된 경우
            </li>

            <li>
              상품 박스, 구성품, 설명서 등이 누락된 경우
            </li>

            <li>
              구매자의 책임 있는 사유로 상품의 가치가 감소한 경우
            </li>

            <li>
              시간의 경과로 재판매가 어려운 상태가 된 경우
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">
            환불 안내
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-gray-700">
            <p>
              반품 상품이 정상적으로 회수 및 검수 완료된 이후 환불이
              진행됩니다.
            </p>

            <p>
              카드 승인 취소는 카드사 정책에 따라 영업일 기준 3~7일 정도
              소요될 수 있습니다.
            </p>

            <p>
              환불 진행 과정에서 추가 확인이 필요한 경우 고객센터를 통해
              별도로 안내드립니다.
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-gray-50 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            고객센터
          </h2>

          <div className="mt-5 space-y-2 font-semibold">
            <p>
              전화 :
              <a
                href="tel:01079083099"
                className="ml-2 text-blue-600 hover:underline"
              >
                010-7908-3099
              </a>
            </p>

            <p>
              이메일 :
              <a
                href="mailto:562-88@naver.com"
                className="ml-2 text-blue-600 hover:underline"
              >
                562-88@naver.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </PolicyLayout>
  );
}