export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE_URL = "https://sajangchance.com";

type EpProduct = {
  id: string;
  title: string;
  price: number;
  link: string;
  imageLink: string;
  categoryName1: string;
  shipping: number;
};

const products: EpProduct[] = [
  {
    id: "front2",
    title: "토스 프론트2 카드단말기",
    price: 100,
    link: `${SITE_URL}/front2`,
    imageLink: `${SITE_URL}/images/front2SJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "front2-printer",
    title: "토스 프론트2 영수증프린터 세트",
    price: 1000,
    link: `${SITE_URL}/front2-printer`,
    imageLink: `${SITE_URL}/images/front2-printerSJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "front2-terminal2",
    title: "토스 프론트2 토스 터미널2 세트",
    price: 139000,
    link: `${SITE_URL}/front2-terminal2`,
    imageLink: `${SITE_URL}/images/front2-terminal2SJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "wireless",
    title: "LTE 무선 카드단말기 휴대용 결제단말기",
    price: 100,
    link: `${SITE_URL}/wireless`,
    imageLink: `${SITE_URL}/images/wirelessSJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "a175-study",
    title: "2026년 최신 공부폰 세이프 공부폰 SKT 키즈폰 데이터차단폰 공신폰",
    price: 100,
    link: `${SITE_URL}/phone/a175-study`,
    imageLink: `${SITE_URL}/images/phone-a175-study.png`,
    categoryName1: "휴대폰",
    shipping: 0,
  },

  {
    id: "a175",
    title: "삼성 갤럭시 A17 법인폰,키즈폰,업무폰 SKT 기기값 무료",
    price: 100,
    link: `${SITE_URL}/phone/a175`,
    imageLink: `${SITE_URL}/images/phone-a175.png`,
    categoryName1: "휴대폰",
    shipping: 0,
  },

  {
    id: "m140",
    title: "어르신 1등 폴더 AT-M140 스타일 폴더폰2, 효도폰",
    price: 100,
    link: `${SITE_URL}/phone/m140`,
    imageLink: `${SITE_URL}/images/phone-m140.png`,
    categoryName1: "휴대폰",
    shipping: 0,
  },

  {
    id: "aroot-a1",
    title: "알뜰통신사 에이루트 에이원 AM-F2000N 폴더폰,효도폰,어르신폰",
    price: 100,
    link: `${SITE_URL}/phone/aroot-a1`,
    imageLink: `${SITE_URL}/images/phone-aroot-a1.png`,
    categoryName1: "휴대폰",
    shipping: 0,
  },
];

function cleanField(value: string | number): string {
  return String(value)
    .replace(/\t/g, " ")
    .replace(/\r?\n/g, " ")
    .trim();
}

export async function GET() {
  const headers = [
    "id",
    "title",
    "price_pc",
    "link",
    "image_link",
    "category_name1",
    "shipping",
  ];

  const rows = products.map((product) =>
    [
      product.id,
      product.title,
      product.price,
      product.link,
      product.imageLink,
      product.categoryName1,
      product.shipping,
    ]
      .map(cleanField)
      .join("\t")
  );

  const epContent = [
    headers.join("\t"),
    ...rows,
  ].join("\n");

  return new Response(epContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=300, s-maxage=300",
    },
  });
}