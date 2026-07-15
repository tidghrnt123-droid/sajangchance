import { supabaseServer } from "@/lib/supabaseServer";

export default async function OrdersPage() {
  const { data: orders } = await supabaseServer
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        주문관리
      </h1>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th>주문번호</th>
            <th>고객명</th>
            <th>연락처</th>
            <th>상품</th>
            <th>금액</th>
            <th>상태</th>
          </tr>

        </thead>

        <tbody>

          {orders?.map((order)=>(
            <tr key={order.id}>

              <td>{order.order_no}</td>

              <td>{order.buyer_name}</td>

              <td>{order.buyer_phone}</td>

              <td>{order.product_name}</td>

              <td>{order.amount.toLocaleString()}원</td>

              <td>{order.payment_status}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </main>
  );
}