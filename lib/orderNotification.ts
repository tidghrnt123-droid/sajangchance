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
  const webhookUrl =
    process.env.ORDER_NOTIFY_WEBHOOK_URL;

  const notifyToken =
    process.env.ORDER_NOTIFY_TOKEN;

  if (!webhookUrl) {
    throw new Error(
      "ORDER_NOTIFY_WEBHOOK_URL이 설정되지 않았습니다."
    );
  }

  if (!notifyToken) {
    throw new Error(
      "ORDER_NOTIFY_TOKEN이 설정되지 않았습니다."
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: notifyToken,
      ...order,
      paidAt: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `주문 이메일 알림 HTTP 오류: ${response.status} ${text}`
    );
  }

  let result: {
    ok?: boolean;
    message?: string;
  } = {};

  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(
      `Apps Script 응답 해석 실패: ${text}`
    );
  }

  if (result.ok !== true) {
    throw new Error(
      `Apps Script 주문 알림 실패: ${
        result.message || "알 수 없는 오류"
      }`
    );
  }

  console.log(
    "ORDER EMAIL SENT:",
    order.orderId
  );
}