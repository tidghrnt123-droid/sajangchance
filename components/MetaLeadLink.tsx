"use client";

import { ReactNode } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

type MetaLeadLinkProps = {
  href: string;
  productId: string;
  productName: string;
  children: ReactNode;
  className?: string;
};

export default function MetaLeadLink({
  href,
  productId,
  productName,
  children,
  className = "",
}: MetaLeadLinkProps) {
  const handleClick = () => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_ids: [productId],
        content_name: productName,
        content_type: "product",
        lead_type: "kakao_chat",
      });

      console.log(
        "[Meta Pixel] Lead sent:",
        productId,
        productName
      );
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}