import type {
  InicisApproveRequest,
  InicisApproveResponse,
} from "./types";

const ALLOWED_IDC_NAMES = new Set(["fc", "ks", "stg"]);

function parseFormEncodedResponse(
  responseText: string
): Record<string, string> {
  const params = new URLSearchParams(responseText);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

export async function approveInicisPayment({
  authTid,
  amount,
  mid,
  idcName,
}: InicisApproveRequest): Promise<InicisApproveResponse> {
  const normalizedAuthTid = authTid.trim();
  const normalizedAmount = amount.replace(/,/g, "").trim();
  const normalizedMid = mid.trim();
  const normalizedIdcName = idcName.trim().toLowerCase();

  if (!normalizedAuthTid) {
    throw new Error("이니시스 인증거래번호가 없습니다.");
  }

  if (!normalizedAmount || !/^\d+$/.test(normalizedAmount)) {
    throw new Error("이니시스 승인 금액이 올바르지 않습니다.");
  }

  if (!normalizedMid) {
    throw new Error("이니시스 MID가 없습니다.");
  }

  /*
   * KG이니시스가 인증 결과로 전달한 P_IDCNAME을 사용합니다.
   * 승인 서버 주소를 임의의 외부 주소로 바꾸지 못하도록 허용값을 제한합니다.
   */
  if (!ALLOWED_IDC_NAMES.has(normalizedIdcName)) {
    throw new Error("허용되지 않은 이니시스 IDC 정보입니다.");
  }

  const approveUrl =
    `https://${normalizedIdcName}` +
    "paypro.inicis.com/payment/v1/rest/payAppl.ini";

  const requestBody = new URLSearchParams({
    P_MID: normalizedMid,
    P_AUTH_TID: normalizedAuthTid,
    P_AMT: normalizedAmount,
    P_CHARSET: "UTF-8",
  });

  const response = await fetch(approveUrl, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: requestBody.toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `이니시스 승인 서버 통신에 실패했습니다. HTTP ${response.status}`
    );
  }

  const parsed = parseFormEncodedResponse(responseText);

  return {
    P_STATUS: parsed.P_STATUS ?? "",
    P_RMESG: parsed.P_RMESG,
    P_MID: parsed.P_MID,
    P_OID: parsed.P_OID,
    P_AUTH_TID: parsed.P_AUTH_TID,
    P_APPL_TID: parsed.P_APPL_TID,
    P_APPL_DT: parsed.P_APPL_DT,
    P_APPL_TM: parsed.P_APPL_TM,
    P_AMT: parsed.P_AMT,
    P_TYPE: parsed.P_TYPE,
  };
}