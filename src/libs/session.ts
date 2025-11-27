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
    const { payload } = await jwtVerify<{ userId: string }>(
      session,
      encodedKey,
      {
        algorithms: [ENCODE_ALGORITHM],
      }
    );
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

export async function updateSession() {
  const session = (await cookies()).get(SESSION_TOKEN_NAME)?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + EXPIRE_DURATION);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_TOKEN_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}
