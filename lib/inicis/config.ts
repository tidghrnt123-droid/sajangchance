type InicisConfig = {
  mid: string;
  hashKey: string;
  siteUrl: string;

  // 승인·취소 API 확장 시 사용
  signKey?: string;
  apiKey?: string;
  apiIv?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }

  return value;
}

export function getInicisConfig(): InicisConfig {
  const siteUrl = requireEnv("NEXT_PUBLIC_SITE_URL").replace(/\/+$/, "");

  return {
    mid: requireEnv("INICIS_MID"),
    hashKey: requireEnv("INICIS_HASH_KEY"),
    siteUrl,

    signKey: process.env.INICIS_SIGN_KEY?.trim(),
    apiKey: process.env.INICIS_API_KEY?.trim(),
    apiIv: process.env.INICIS_API_IV?.trim(),
  };
}