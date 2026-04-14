import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_TOKEN_NAME, EXPIRE_DURATION } from "@/constants";
import { decrypt, encrypt } from "@/libs/jwt";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_TOKEN_NAME);

  // 보호된 라우트에 대한 패턴
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/mypage") ||
    request.nextUrl.pathname.startsWith("/api/bookmarks");

  let payload = null;

  // 1. 세션 쿠키가 존재한다면 복호화하여 JWT 유효성을 엄격하게 검증
  if (sessionCookie?.value) {
    try {
      payload = await decrypt(sessionCookie.value);
    } catch {
      payload = null;
    }
  }

  // 2. 보호된 라우트이면서 유효한 JWT payload가 없는 경우
  if (isProtectedRoute && !payload) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();

  // 3. 세션 슬라이딩: 유효한 세션이 있다면 JWT 재발급(새 만료기한 확보)하여 응답 쿠키에 반영
  if (payload && typeof payload === "object" && "userId" in payload) {
    const newSessionToken = await encrypt(payload.userId as number);
    response.cookies.set({
      name: SESSION_TOKEN_NAME,
      value: newSessionToken,
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
