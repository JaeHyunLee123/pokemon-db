import { UsedEmailError } from "@/errors/auth-error";
import { UnknownError } from "@/errors/common-error";
import { authRepository } from "@/repositories/auth-repository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";

const SALT_ROUND = 10;

export const authService = {
  async signUp(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

    try {
      await authRepository.signUp(email, hashedPassword);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new UsedEmailError();
        } else {
          throw new UnknownError(e);
        }
      } else {
        throw new UnknownError(e);
      }
    }
  },
};
