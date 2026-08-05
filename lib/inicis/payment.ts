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

/**
 * KG이니시스 INIPay PRO 결제창 호출에 필요한 데이터를 생성합니다.
 *
 * 실제 결제창 호출은 브라우저에서:
 * EDGEStdPay.requestPayment(fields)
 *
 * 형태로 진행합니다.
 */
export function createInicisPayment(
  request: InicisPaymentRequest
): InicisPaymentResponse {
  const config = getInicisConfig();

  const orderId = request.orderId.trim();
  const amount = String(request.amount);
  const goodsName = request.goodsName.trim();
  const buyerName = request.buyerName.trim();
  const buyerTel = request.buyerTel.replace(/[^0-9]/g, "");
  const buyerEmail = request.buyerEmail?.trim() ?? "";

  if (!orderId) {
    throw new Error("이니시스 주문번호가 없습니다.");
  }

  if (!Number.isInteger(request.amount) || request.amount <= 0) {
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

  return {
    scriptUrl: INICIS_PAYMENT_SCRIPT_URL,

    fields: {
      // 필수값
      P_MID: config.mid,
      P_OID: orderId,
      P_PAY_TYPE: "CARD:BANK:VBANK",
      P_DEVICE_TYPE: request.deviceType,
      P_IDCCODE: "Y",
      P_AMT: amount,
      P_GOODS: goodsName,
      P_UNAME: buyerName,
      P_NEXT_URL: nextUrl,

      // 가상계좌 입금통보 등에 사용
      P_NOTI_URL: notiUrl,

      // 구매자 정보
      P_MOBILE: buyerTel,
      P_EMAIL: buyerEmail,

      // 문자 인코딩
      P_CHARSET: "UTF-8",

      // 금액 위변조 검증
      P_TIMESTAMP: timestamp,
      P_CHKFAKE: checkFake,

      // 인증 결과에서 주문을 식별하기 위한 가맹점 데이터
      P_NOTI: orderId,
    },
  };
}