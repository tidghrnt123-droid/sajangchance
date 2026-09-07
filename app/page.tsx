import type { Metadata } from "next";
import AllInOneLandingPage from "./all-in-one/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "매장 인터넷·CCTV·카드단말기 한번에 | 사장님찬스",

  description:
    "매장 오픈에 필요한 인터넷, CCTV, 카드단말기, 인터넷전화까지 한 번에 비교·설치. SK·KT·LG 맞춤 상담과 가입 혜택을 사장님찬스에서 확인하세요.",

  alternates: {
    canonical: "https://www.sajangchance.com/",
  },

  openGraph: {
    title: "매장 인터넷·CCTV·카드단말기 한번에 | 사장님찬스",

    description:
      "매장 인터넷, CCTV, 카드단말기, 인터넷전화까지 한 번에 비교하고 설치하세요.",

    url: "https://www.sajangchance.com/",

    siteName: "사장님찬스",

    locale: "ko_KR",

    type: "website",

    images: [
      {
        url: "/images/og-image1.png",
        width: 1200,
        height: 630,
        alt: "사장님찬스 매장 인터넷 CCTV 카드단말기",
      },
    ],
  },
};

export default function Home() {
  return <AllInOneLandingPage />;
}