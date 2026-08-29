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
  variable:
    "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable:
    "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://sajangchance.com"
  ),

  title:
    "사장님찬스 | 인터넷 · CCTV · 카드단말기 · 휴대폰",

  description:
    "카드단말기, POS, PG 전문 상담",

  keywords: [
    "사장님찬스",
    "카드단말기",
    "무선 카드단말기",
    "토스 프론트2",
    "토스 터미널2",
    "영수증 프린터",
    "POS",
    "PG",
    "카드결제",
    "결제 단말기",
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

    shortcut:
      "/icon.png",

    apple:
      "/icon.png",
  },

  openGraph: {
    title:
      "사장님찬스 | 카드단말기 · POS · PG 전문",

    description:
      "토스 프론트2, 무선 카드단말기, POS, PG 전문 상담",

    url:
      "https://sajangchance.com",

    siteName:
      "사장님찬스",

    locale:
      "ko_KR",

    type:
      "website",

    images: [
      {
        url:
          "/images/og-image1.png",

        width:
          1200,

        height:
          630,

        alt:
          "사장님찬스",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "사장님찬스 | 카드단말기 · POS · PG 전문",

    description:
      "토스 프론트2, 무선 카드단말기, POS, PG 전문 상담",

    images: [
      "/images/og-image1.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Meta Pixel noscript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{
              display:
                "none",
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
        <Suspense
          fallback={null}
        >
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
            AceCounter
        ========================= */}
        <Script
          id="acecounter"
          strategy="afterInteractive"
        >
          {`
            var _AceGID = (function () {

              var Inf = [
                'sajangchance.com',
                'www.sajangchance.com,sajangchance.com',
                'AZ1A105990',
                '1',
                'NaPm,Ncisy',
                '1'
              ];

              var _CI =
                (!_AceGID)
                  ? []
                  : _AceGID.val;

              var _N = 0;

              if (
                _CI
                  .join('.')
                  .indexOf(
                    Inf[2]
                  ) < 0
              ) {
                _CI.push(
                  Inf
                );

                _N =
                  _CI.length;
              }

              return {
                o: _N,
                val: _CI
              };

            })();

            var _AceCounter = (function () {

              var G =
                _AceGID;

              var _sc =
                document.createElement(
                  'script'
                );

              var _sm =
                document.getElementsByTagName(
                  'script'
                )[0];

              if (
                G.o !== 0
              ) {
                var _A =
                  G.val[
                    G.o - 1
                  ];

                var _U =
                  _A[4].replace(
                    /,/g,
                    '_'
                  );

                _sc.src =
                  'https://cr.acecounter.com/ac.js' +
                  '?gc=' +
                  _A[2] +
                  '&py=' +
                  _A[1] +
                  '&up=' +
                  _U +
                  '&rd=' +
                  new Date().getTime();

                _sm.parentNode.insertBefore(
                  _sc,
                  _sm
                );

                return _sc.src;
              }

            })();
          `}
        </Script>
      </body>
    </html>
  );
}