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
  leadType?: string;
  target?: "_blank" | "_self";
};

export default function MetaLeadLink({
  href,
  productId,
  productName,
  children,
  className = "",
  leadType = "contact",
  target = "_blank",
}: MetaLeadLinkProps) {
  const handleClick = () => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_ids: [productId],
        content_name: productName,
        content_type: "product",
        lead_type: leadType,
      });

      console.log(
        "[Meta Pixel] Lead sent:",
        productId,
        productName,
        leadType
      );
    }
  };

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}