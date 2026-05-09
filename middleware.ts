/**
 * Next.js middleware — protects dashboard routes.
 *
 * If a request hits /dashboard/* and there is no nextq_jwt cookie,
 * redirect to /login.
 *
 * Note: localStorage is not accessible in middleware (it runs on the Edge).
 * We mirror the JWT into a cookie on login so middleware can read it.
 * The cookie is written by the client-side authContext after a successful auth.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIX = "/dashboard";
const LOGIN_PATH = "/login";
const JWT_COOKIE = "nextq_jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(JWT_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
