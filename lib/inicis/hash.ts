import crypto from "crypto";

/**
 * KG이니시스에서 사용하는 13자리 밀리초 타임스탬프
 */
export function createInicisTimestamp(): string {
  return Date.now().toString();
}

/**
 * 중복되지 않는 주문번호 생성
 * KG이니시스 P_OID는 최대 40byte
 */
export function createInicisOrderId(): string {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `SC${timestamp}${random}`.slice(0, 40);
}

type CreateCheckFakeParams = {
  amount: string | number;
  orderId: string;
  timestamp: string;
  hashKey: string;
};

/**
 * KG이니시스 금액 위변조 검증값 생성
 *
 * 공식 조합 순서:
 * P_AMT + P_OID + P_TIMESTAMP + HashKey
 */
export function createInicisCheckFake({
  amount,
  orderId,
  timestamp,
  hashKey,
}: CreateCheckFakeParams): string {
  const normalizedAmount = String(amount).replace(/,/g, "").trim();
  const normalizedOrderId = orderId.trim();
  const normalizedTimestamp = timestamp.trim();
  const normalizedHashKey = hashKey.trim();

  if (!normalizedAmount || !/^\d+$/.test(normalizedAmount)) {
    throw new Error("결제금액은 숫자만 입력해야 합니다.");
  }

  if (!normalizedOrderId) {
    throw new Error("주문번호가 없습니다.");
  }

  if (!normalizedTimestamp) {
    throw new Error("타임스탬프가 없습니다.");
  }

  if (!normalizedHashKey) {
    throw new Error("INICIS_HASH_KEY 환경변수가 없습니다.");
  }

  const source =
    normalizedAmount +
    normalizedOrderId +
    normalizedTimestamp +
    normalizedHashKey;

  return crypto
    .createHash("sha512")
    .update(source, "utf8")
    .digest("base64");
}

/**
 * 문자열 SHA-512 HEX 생성
 * 추후 취소·에스크로·INIAPI 연동에서 재사용
 */
export function createSha512Hex(value: string): string {
  return crypto.createHash("sha512").update(value, "utf8").digest("hex");
}