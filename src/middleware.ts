import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_TOKEN_NAME = "session_token";
const EXPIRE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_TOKEN_NAME);

  // 보호된 라우트에 대한 세션 검증
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/mypage") ||
    request.nextUrl.pathname.startsWith("/api/bookmarks");

  if (isProtectedRoute && !sessionCookie?.value) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 1. response를 가로채서 다음 미들웨어나 핸들러로 보냄
  const response = NextResponse.next();

  // 2. 세션이 있다면 만료시간(sliding) 연장
  if (sessionCookie?.value) {
    response.cookies.set({
      name: SESSION_TOKEN_NAME,
      value: sessionCookie.value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + EXPIRE_DURATION),
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
