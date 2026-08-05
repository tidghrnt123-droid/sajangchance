import { getInicisConfig } from "./config";

import {
  createInicisCheckFake,
  createInicisTimestamp,
} from "./hash";

import type {
  InicisPaymentRequest,
  InicisPaymentResponse,
} from "./types";

const INICIS_PAYMENT_SCRIPT_URL =
  "https://paypro.inicis.com/std/payment/js/INIPayPro_v2.js";

export function createInicisPayment(
  request: InicisPaymentRequest
): InicisPaymentResponse {
  const config = getInicisConfig();

  const orderId = request.orderId.trim();
  const amount = String(request.amount);
  const goodsName = request.goodsName.trim();
  const buyerName = request.buyerName.trim();

  const buyerTel = request.buyerTel.replace(
    /[^0-9]/g,
    ""
  );

  const buyerEmail =
    request.buyerEmail?.trim() ?? "";

  if (!orderId) {
    throw new Error("이니시스 주문번호가 없습니다.");
  }

  if (
    !Number.isInteger(request.amount) ||
    request.amount <= 0
  ) {
    throw new Error("결제금액이 올바르지 않습니다.");
  }

  if (!goodsName) {
    throw new Error("상품명이 없습니다.");
  }

  if (!buyerName) {
    throw new Error("구매자명이 없습니다.");
  }

  if (!buyerTel) {
    throw new Error("구매자 연락처가 없습니다.");
  }

  const timestamp = createInicisTimestamp();

  const checkFake = createInicisCheckFake({
    amount,
    orderId,
    timestamp,
    hashKey: config.hashKey,
  });

  const nextUrl =
    `${config.siteUrl}/api/payment/inicis/result` +
    `?order=${encodeURIComponent(orderId)}`;

  const notiUrl =
    `${config.siteUrl}/api/payment/inicis/notify`;

  const useEscrow =
    request.paymentType === "BANK" ||
    request.paymentType === "VBANK";

  const fields: Record<string, string> = {
    P_MID: config.mid,
    P_OID: orderId,

    // CARD / BANK / VBANK 중 고객이 선택한 수단
    P_PAY_TYPE: request.paymentType,

    P_DEVICE_TYPE: request.deviceType,
    P_IDCCODE: "Y",

    P_AMT: amount,
    P_GOODS: goodsName,
    P_UNAME: buyerName,

    P_NEXT_URL: nextUrl,
    P_NOTI_URL: notiUrl,

    P_MOBILE: buyerTel,
    P_EMAIL: buyerEmail,

    P_CHARSET: "UTF-8",

    P_TIMESTAMP: timestamp,
    P_CHKFAKE: checkFake,

    // 결제 결과에서 주문번호 식별
    P_NOTI: orderId,
  };

  /*
   * 계좌이체와 가상계좌만 에스크로 요청
   * 신용카드는 일반결제로 요청
   */
  if (useEscrow) {
    fields.P_RESERVED = JSON.stringify({
      useescrow: "Y",
      email: buyerEmail,
      phonenum: buyerTel,
    });
  }

  return {
    scriptUrl: INICIS_PAYMENT_SCRIPT_URL,
    fields,
  };
}