import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js middleware convention
 * See: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * NextAuth v5 with `strategy: "jwt"` stores the session in a single cookie. The name
 * differs between plain http (dev) and https (production), so both are checked.
 */

const PROTECTED_PREFIXES = ["/admin", "/guru", "/manajemen", "/notifikasi"];

const ROLE_ACCESS = {
  admin: ["/admin", "/manajemen", "/guru", "/notifikasi"],
  guru: ["/guru", "/manajemen", "/notifikasi"],
  manajemen: ["/manajemen", "/guru", "/notifikasi"],
};

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasAccess(role: string, pathname: string): boolean {
  const allowedPaths = ROLE_ACCESS[role as keyof typeof ROLE_ACCESS];
  if (!allowedPaths) return false;
  return allowedPaths.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "authjs.session-token",
  });

  if (!token?.id) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  const role = token.role as string;
  if (!hasAccess(role, pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("error", "access_denied");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/guru/:path*",
    "/manajemen/:path*",
    "/notifikasi/:path*",
  ],
};
