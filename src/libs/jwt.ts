import { SESSION_SECRET_KEY } from "@/constants";
import { SignJWT, jwtVerify } from "jose";
import { VerifyFailError } from "@/errors/auth-error";

const ENCODE_ALGORITHM = "HS256";
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
    const { payload } = await jwtVerify<{ userId: number }>(
      session,
      encodedKey,
      {
        algorithms: [ENCODE_ALGORITHM],
      },
    );
    return payload;
  } catch (error) {
    // throw error to be handled by caller
    throw new VerifyFailError();
  }
}
