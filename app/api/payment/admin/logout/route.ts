import { NextResponse } from "next/server";
import { getAdminSessionCookieName } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const response = NextResponse.redirect(
    new URL("/admin", request.url),
    303
  );

  response.cookies.set(getAdminSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });

  return response;
}