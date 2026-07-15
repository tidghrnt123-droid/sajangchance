import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

  return <>{children}</>;
}