import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import FloatingButtons from "@/components/FloatingButtons";
import VisitTracker from "@/components/VisitTracker";
import ConversionTracker from "@/components/ConversionTracker";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.sajangchance.com"
  ),

  title:
    "매장 인터넷·CCTV·카드단말기 한번에 | 사장님찬스",

  description:
    "매장 오픈에 필요한 인터넷, CCTV, 카드단말기, 인터넷전화까지 한 번에 비교·설치. SK·KT·LG 맞춤 상담과 가입 혜택을 사장님찬스에서 확인하세요.",

  keywords: [
    "사장님찬스",
    "매장 인터넷",
    "사업장 인터넷",
    "매장 CCTV",
    "사업장 CCTV",
    "카드단말기",
    "매장 카드단말기",
    "인터넷 CCTV 카드단말기",
    "신규 매장 인터넷",
    "신규 사업장 인터넷",
    "인터넷 CCTV",
    "인터넷 카드단말기",
    "사업장 인터넷 CCTV",
    "인터넷전화",
    "매장 인터넷전화",
    "SK 인터넷",
    "KT 인터넷",
    "LG 인터넷",
  ],

  verification: {
    other: {
      "naver-site-verification":
        "976ac79db2344518106432f0693de560b4ae8e43",
    },
  },

  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],

    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title:
      "매장 인터넷·CCTV·카드단말기 한번에 | 사장님찬스",

    description:
      "매장 인터넷, CCTV, 카드단말기, 인터넷전화까지 한 번에 비교하고 설치하세요. SK·KT·LG 맞춤 상담과 가입 혜택을 확인하세요.",

    url: "https://www.sajangchance.com/",

    siteName: "사장님찬스",

    locale: "ko_KR",

    type: "website",

    images: [
      {
        url: "/images/og-image1.png",
        width: 1200,
        height: 630,
        alt: "사장님찬스 매장 인터넷 CCTV 카드단말기 올인원",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "매장 인터넷·CCTV·카드단말기 한번에 | 사장님찬스",

    description:
      "매장 인터넷, CCTV, 카드단말기, 인터넷전화까지 한 번에 비교하고 설치하세요.",

    images: [
      "/images/og-image1.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* =========================
            Meta Pixel noscript
        ========================= */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{
              display: "none",
            }}
            src="https://www.facebook.com/tr?id=28514603764813743&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>

      <body className="min-h-full flex flex-col pb-[76px] md:pb-0">
        {children}

        <FloatingButtons />

        {/* =========================
            자사몰 방문자 + 문의 전환 추적
        ========================= */}
        <Suspense fallback={null}>
          <VisitTracker />
          <ConversionTracker />
        </Suspense>

        {/* =========================
            Meta Pixel
        ========================= */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {
              if(f.fbq)return;

              n=f.fbq=function(){
                n.callMethod
                  ? n.callMethod.apply(n,arguments)
                  : n.queue.push(arguments)
              };

              if(!f._fbq)f._fbq=n;

              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];

              t=b.createElement(e);
              t.async=!0;
              t.src=v;

              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s);

            }(
              window,
              document,
              'script',
              'https://connect.facebook.net/en_US/fbevents.js'
            );

            fbq(
              'init',
              '28514603764813743'
            );

            fbq(
              'track',
              'PageView'
            );
          `}
        </Script>

        {/* =========================
            네이버 검색광고 전환추적
        ========================= */}
        <Script
          src="https://wcs.naver.net/wcslog.js"
          strategy="afterInteractive"
        />

        <Script
          id="naver-wcs"
          strategy="afterInteractive"
        >
          {`
            if (!window.wcs_add) {
              window.wcs_add = {};
            }

            window.wcs_add["wa"] =
              "s_2ae89fa200da";

            if (!window._nasa) {
              window._nasa = {};
            }

            if (window.wcs) {
              window.wcs.inflow();
              window.wcs_do();
            }
          `}
        </Script>
      </body>
    </html>
  );
}