"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

type Props = {
  orderNo: string;
  productName: string;
  value: number;
};

export default function MetaPurchase({
  orderNo,
  productName,
  value,
}: Props) {
  useEffect(() => {
    const storageKey = `meta_purchase_${orderNo}`;

    // 같은 주문번호로 새로고침했을 때 중복 Purchase 방지
    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    let attempts = 0;

    const sendPurchase = () => {
      attempts += 1;

      if (typeof window.fbq === "function") {
        window.fbq("track", "Purchase", {
          content_ids: [orderNo],
          content_name: productName,
          content_type: "product",
          value,
          currency: "KRW",
          order_id: orderNo,
          num_items: 1,
        });

        sessionStorage.setItem(storageKey, "1");

        console.log(
          "[Meta Pixel] Purchase sent:",
          orderNo,
          productName,
          value
        );

        return;
      }

      if (attempts < 20) {
        setTimeout(sendPurchase, 250);
      } else {
        console.warn(
          "[Meta Pixel] Purchase failed: fbq unavailable"
        );
      }
    };

    sendPurchase();
  }, [orderNo, productName, value]);

  return null;
}