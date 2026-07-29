import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "배송안내 | 사장님찬스",
  description: "사장님찬스 카드단말기 상품의 배송 정책을 안내드립니다.",
  alternates: {
    canonical: "https://sajangchance.com/shipping",
  },
};

export default function ShippingPage() {
  return (
    <PolicyLayout
      title="배송안내"
      description="사장님찬스 카드단말기 상품의 배송 정책을 안내드립니다."
    >
      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">배송 안내</h2>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm md:text-base">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="w-32 bg-gray-50 px-4 py-4 text-left font-semibold text-gray-900 md:w-44 md:px-6">
                    배송비
                  </th>

                  <td className="px-4 py-4 text-gray-700 md:px-6">
                    전 상품 무료배송
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <th className="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-900 md:px-6">
                    출고 기준
                  </th>

                  <td className="px-4 py-4 leading-7 text-gray-700 md:px-6">
                    평일 오후 3시 이전 결제 완료 주문은 당일 출고를
                    원칙으로 합니다.
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <th className="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-900 md:px-6">
                    배송 기간
                  </th>

                  <td className="px-4 py-4 leading-7 text-gray-700 md:px-6">
                    출고 후 평균 1~3영업일 정도 소요됩니다.
                    <br />
                    도서산간 지역과 제주 지역은 배송 기간이 추가될 수
                    있습니다.
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <th className="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-900 md:px-6">
                    배송 지역
                  </th>

                  <td className="px-4 py-4 text-gray-700 md:px-6">
                    대한민국 전 지역
                  </td>
                </tr>

                <tr>
                  <th className="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-900 md:px-6">
                    배송 문의
                  </th>

                  <td className="px-4 py-4 leading-7 text-gray-700 md:px-6">
                    고객센터 010-7908-3099
                    <br />
                    이메일 562-88@naver.com
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 md:p-8">
          <h2 className="text-xl font-bold text-blue-700">출고 안내</h2>

          <div className="mt-4 space-y-3 leading-7 text-gray-700">
            <p>
              결제가 완료된 주문부터 순차적으로 상품을 준비하여
              출고합니다.
            </p>

            <p>
              재고 상황이나 주문량 증가로 당일 출고가 어려운 경우에는
              고객님께 별도로 안내드립니다.
            </p>

            <p>
              주말과 공휴일에 결제된 주문은 다음 영업일부터 순차적으로
              출고됩니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">배송 유의사항</h2>

          <ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-gray-700">
            <li>모든 상품은 무료배송으로 제공됩니다.</li>

            <li>
              배송 기간은 택배사의 물량 및 지역 사정에 따라 달라질 수
              있습니다.
            </li>

            <li>
              주문서의 수령인 정보와 배송지 주소를 정확하게 입력해
              주시기 바랍니다.
            </li>

            <li>
              주소 또는 연락처 오기재로 발생한 배송 지연과 반송 비용은
              구매자에게 부담될 수 있습니다.
            </li>

            <li>
              상품이 발송된 이후에는 배송지 변경이나 주문 취소가 제한될
              수 있습니다.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl bg-gray-50 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900">고객센터</h2>

          <p className="mt-3 leading-7 text-gray-700">
            배송과 관련해 궁금한 사항은 아래 연락처로 문의해 주세요.
          </p>

          <div className="mt-5 space-y-2 font-semibold text-gray-900">
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