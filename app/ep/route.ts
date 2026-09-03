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
    title:
      "약정,월 사용료 없는 토스 프론트2 카드단말기 토스단말기 영수증프린터 무료증정",
    price: 100,
    link: `${SITE_URL}/front2?utm_source=naver&utm_medium=cpc&utm_campaign=toss_front2`,
    imageLink: `${SITE_URL}/images/front2SJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "front2-printer",
    title:
      "토스 프론트2 영수증프린터 세트 할인 특가 1000원! 토스 단말기세트",
    price: 1000,
    link: `${SITE_URL}/front2-printer?utm_source=naver&utm_medium=cpc&utm_campaign=toss_printer`,
    imageLink: `${SITE_URL}/images/front2-printerSJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "front2-terminal2",
    title:
      "토스프론트2 토스터미널2 토스 단말기 세트 영수증출력가능",
    price: 49000,
    link: `${SITE_URL}/front2-terminal2?utm_source=naver&utm_medium=cpc&utm_campaign=toss_terminal2`,
    imageLink: `${SITE_URL}/images/front2-terminal2SJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "wireless",
    title:
      "LTE 무선 카드단말기 휴대용 결제단말기 배달,행사장,푸드트럭,플리마켓,오픈마켓",
    price: 100,
    link: `${SITE_URL}/wireless?utm_source=naver&utm_medium=cpc&utm_campaign=wireless_terminal`,
    imageLink: `${SITE_URL}/images/wirelessSJ.png`,
    categoryName1: "카드단말기",
    shipping: 0,
  },

  {
    id: "a175-study",
    title:
      "2026년 최신 공부폰 세이프 공부폰 SKT 키즈폰 데이터차단폰 공신폰",
    price: 100,
    link: `${SITE_URL}/phone/a175-study?utm_source=naver&utm_medium=cpc&utm_campaign=study_phone`,
    imageLink: `${SITE_URL}/images/phone-a175-study.png`,
    categoryName1: "휴대폰",
    shipping: 0,
  },

  {
    id: "a175",
    title:
      "삼성 갤럭시 A17 법인폰,키즈폰,업무폰 SKT 기기값 무료",
    price: 100,
    link: `${SITE_URL}/phone/a175?utm_source=naver&utm_medium=cpc&utm_campaign=a175`,
    imageLink: `${SITE_URL}/images/phone-a175.png`,
    categoryName1: "휴대폰",
    shipping: 0,
  },

  {
    id: "m140",
    title:
      "어르신 1등 폴더 AT-M140 스타일 폴더폰2, 효도폰",
    price: 100,
    link: `${SITE_URL}/phone/m140?utm_source=naver&utm_medium=cpc&utm_campaign=m140`,
    imageLink: `${SITE_URL}/images/phone-m140.png`,
    categoryName1: "휴대폰",
    shipping: 0,
  },

  {
    id: "aroot-a1",
    title:
      "알뜰통신사 에이루트 에이원 AM-F2000N 폴더폰,효도폰,어르신폰",
    price: 100,
    link: `${SITE_URL}/phone/aroot-a1?utm_source=naver&utm_medium=cpc&utm_campaign=aroot_a1`,
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

  const epContent = [headers.join("\t"), ...rows].join("\n");

  return new Response(epContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}