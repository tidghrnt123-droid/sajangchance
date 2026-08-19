"use client";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

type Props = {
  productId: string;
  productName: string;
  value: number;
  children: React.ReactNode;
};

export default function MetaCheckoutButton({
  productId,
  productName,
  value,
  children,
}: Props) {
  const handleClick = () => {
    window.fbq?.("track", "InitiateCheckout", {
      content_ids: [productId],
      content_name: productName,
      content_type: "product",
      value,
      currency: "KRW",
      num_items: 1,
    });
  };

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700"
    >
      {children}
    </button>
  );
}