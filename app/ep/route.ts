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
    title: "토스 프론트2",
    price: 100,
    link: `${SITE_URL}/front2`,

    // 실제 대표 이미지 주소로 확인 필요
    imageLink: `${SITE_URL}/images/SCTOP.png`,

    categoryName1: "카드단말기",
    shipping: 0,
  },
  {
    id: "front2-printer",
    title: "프론트2 영수증 프린터 세트",
    price: 39000,
    link: `${SITE_URL}/front2-printer`,

    // 아래 경로를 실제 대표 이미지 파일명으로 변경
    imageLink: `${SITE_URL}/images/SCTOP.png`,

    categoryName1: "카드단말기",
    shipping: 0,
  },
  {
    id: "front2-terminal2",
    title: "프론트2 토스 터미널2 세트",
    price: 139000,
    link: `${SITE_URL}/front2-terminal2`,

    // 아래 경로를 실제 대표 이미지 파일명으로 변경
    imageLink: `${SITE_URL}/images/SCTOP.png`,

    categoryName1: "카드단말기",
    shipping: 0,
  },
  {
    id: "wireless",
    title: "무선 카드단말기",
    price: 100,
    link: `${SITE_URL}/wireless`,
    imageLink: `${SITE_URL}/images/lte1.png`,
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

  const epContent = [headers.join("\t"), ...rows].join("\n");

  return new Response(epContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=300, s-maxage=300",
    },
  });
}