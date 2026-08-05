export type InicisDeviceType = "WEB" | "MOBILE";

export interface InicisPaymentRequest {
  orderId: string;
  amount: number;
  goodsName: string;
  buyerName: string;
  buyerEmail?: string;
  buyerTel: string;
  deviceType: InicisDeviceType;
}

export interface InicisPaymentResponse {
  scriptUrl: string;
  fields: Record<string, string>;
}

export interface InicisAuthenticationResult {
  P_STATUS: string;
  P_RMESG?: string;
  P_MID?: string;
  P_AUTH_TID?: string;
  P_OID?: string;
  P_AMT?: string;
  P_IDCNAME?: string;
  P_NOTI?: string;
  P_CHARSET?: string;
}

export interface InicisApproveRequest {
  authTid: string;
  amount: string;
  mid: string;
  idcName: string;
}

export interface InicisApproveResponse {
  P_STATUS: string;
  P_RMESG?: string;
  P_MID?: string;
  P_OID?: string;
  P_AUTH_TID?: string;
  P_APPL_TID?: string;
  P_APPL_DT?: string;
  P_APPL_TM?: string;
  P_AMT?: string;
  P_TYPE?: string;
}