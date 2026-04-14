import "server-only";
import { cookies } from "next/headers";
import { SESSION_TOKEN_NAME, EXPIRE_DURATION } from "@/constants";
import { encrypt, decrypt } from "@/libs/jwt";

export async function createSession(userId: number) {
  const session = await encrypt(userId);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_TOKEN_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + EXPIRE_DURATION),
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const session = (await cookies()).get(SESSION_TOKEN_NAME)?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (e) {
    console.error("Session verification failed:", e);
    return null;
  }
}

export async function updateSession() {
  const session = (await cookies()).get(SESSION_TOKEN_NAME)?.value;
  if (!session) return null;
  
  let payload;
  try {
    payload = await decrypt(session);
  } catch (e) {
    console.error("Session slider verification failed:", e);
    return null;
  }

  if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
    return null;
  }

  // 진정한 세션 슬라이딩: 완전히 새로운 JWT 생성
  const newSession = await encrypt(payload.userId as number);
  const expires = new Date(Date.now() + EXPIRE_DURATION);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_TOKEN_NAME, newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_TOKEN_NAME);
}
