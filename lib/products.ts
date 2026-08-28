export const products = {
  front2: {
    name: "토스 프론트2",
    price: 100,
    itemCode: "front2",
    productType: "TERMINAL",
  },

  "front2-printer": {
    name: "프론트2 + 영수증 프린터",
    price: 1000,
    itemCode: "f2printer",
    productType: "TERMINAL",
  },

  "front2-terminal2": {
    name: "프론트2 + 토스 터미널2",
    price: 49000,
    itemCode: "f2terminal",
    productType: "TERMINAL",
  },

  wireless: {
    name: "무선 카드단말기",
    price: 100,
    itemCode: "wireless",
    productType: "TERMINAL",
  },

  "a175-study": {
    name: "갤럭시 A175 공부폰",
    price: 100,
    itemCode: "a175study",
    productType: "PHONE",
  },

  a175: {
    name: "갤럭시 A175",
    price: 100,
    itemCode: "a175",
    productType: "PHONE",
  },

  m140: {
    name: "AT-M140",
    price: 100,
    itemCode: "m140",
    productType: "PHONE",
  },

  "aroot-a1": {
    name: "에이루트 A1",
    price: 100,
    itemCode: "aroota1",
    productType: "PHONE",
  },
} as const;

export type ProductCode = keyof typeof products;

export type ProductType =
  (typeof products)[ProductCode]["productType"];