import "server-only";
import { SESSION_SECRET_KEY } from "@/constants";
import { SignJWT, jwtVerify } from "jose";
import { VerifyFailError } from "@/errors/auth-error";
import { cookies } from "next/headers";

const ENCODE_ALGORITHM = "HS256";
const EXPIRE_DURATION = 7 * 24 * 60 * 60 * 1000; //7days
const SESSION_TOKEN_NAME = "session_token";

const encodedKey = new TextEncoder().encode(SESSION_SECRET_KEY);

export async function encrypt(userId: number) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: ENCODE_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: [ENCODE_ALGORITHM],
    });
    return payload;
  } catch (error) {
    console.error(error);
    throw new VerifyFailError();
  }
}

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
