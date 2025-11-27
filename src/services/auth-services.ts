import {
  IncorrectPasswordError,
  NoUserError,
  UsedEmailError,
} from "@/errors/auth-error";
import { UnknownError } from "@/errors/common-error";
import { authRepository } from "@/repositories/auth-repository";
import { Prisma } from "@/generated/prisma";
import bcrypt from "bcrypt";
import { userRepository } from "@/repositories/user-repository";
import { createSession } from "@/libs/session";

const SALT_ROUND = 10;

export const authService = {
  async signUp(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

    try {
      await authRepository.signUp(email, hashedPassword);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
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

  async login(email: string, password: string) {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new NoUserError();
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new IncorrectPasswordError();
    }

    await createSession(user.id);
  },
};
