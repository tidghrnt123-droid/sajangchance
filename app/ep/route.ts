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
    title: "약정 위약금 없는 최신 토스 단말기 세트 무료 제공",
    price: 100,
    link: `${SITE_URL}/front2`,
    imageLink: `${SITE_URL}/images/front2SJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "front2-printer",
    title:
      "토스 프론트2 영수증프린터 세트 할인 특가 1000원! 토스 단말기세트",
    price: 1000,
    link: `${SITE_URL}/front2-printer`,
    imageLink: `${SITE_URL}/images/front2-printerSJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "front2-terminal2",
    title:
      "토스프론트2 토스터미널2 토스 단말기 세트",
    price: 139000,
    link: `${SITE_URL}/front2-terminal2`,
    imageLink: `${SITE_URL}/images/front2-terminal2SJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "wireless",
    title:
      "LTE 배달 플리마켓 오픈마켓 무선 카드단말기 휴대용 결제단말기",
    price: 100,
    link: `${SITE_URL}/wireless`,
    imageLink: `${SITE_URL}/images/wirelessSJ.png`,
    categoryName1: "카드단말기",
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