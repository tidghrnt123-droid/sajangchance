type OrderPaidNotification = {
  orderId: string;
  productName: string;
  amount: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string | null;
  businessName?: string | null;
  paymentMethod?: string | null;
  tid?: string | null;
};

export async function sendOrderPaidNotification(
  order: OrderPaidNotification
) {
  const webhookUrl = process.env.ORDER_NOTIFY_WEBHOOK_URL;
  const notifyToken = process.env.ORDER_NOTIFY_TOKEN;

  if (!webhookUrl) {
    console.warn(
      "ORDER_NOTIFY_WEBHOOK_URL이 없어 주문 이메일 알림을 건너뜁니다."
    );
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: notifyToken || "",
      ...order,
      paidAt: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `주문 이메일 알림 전송 실패: ${response.status}`
    );
  }
}
