"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

type Props = {
  productId: string;
  productName: string;
  value: number;
};

export default function MetaViewContent({
  productId,
  productName,
  value,
}: Props) {
  useEffect(() => {
    let attempts = 0;

    const trackViewContent = () => {
      attempts += 1;

      if (typeof window.fbq === "function") {
        window.fbq("track", "ViewContent", {
          content_ids: [productId],
          contents: [
            {
              id: productId,
              quantity: 1,
              item_price: value,
            },
          ],
          content_name: productName,
          content_type: "product",
          value: value,
          currency: "KRW",
        });

        console.log(
          "[Meta Pixel] ViewContent sent:",
          productId
        );

        return;
      }

      if (attempts < 20) {
        setTimeout(trackViewContent, 250);
      } else {
        console.warn(
          "[Meta Pixel] fbq was not available."
        );
      }
    };

    trackViewContent();
  }, [productId, productName, value]);

  return null;
}