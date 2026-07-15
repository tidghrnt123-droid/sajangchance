import crypto from "crypto";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_VALUE = "sajangchance-admin-session";

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET 환경변수가 없습니다.");
  }

  return secret;
}

export function getAdminSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function createAdminSessionToken() {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(SESSION_VALUE)
    .digest("hex");
}

export function verifyAdminSessionToken(token?: string) {
  if (!token) {
    return false;
  }

  const expectedToken = createAdminSessionToken();

  const receivedBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedToken);

  return (
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD 환경변수가 없습니다.");
  }

  const receivedBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(adminPassword);

  return (
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}