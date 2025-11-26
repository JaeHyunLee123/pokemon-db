import prisma from "@/libs/prisma";

export const authRepository = {
  async signUp(email: string, hashedPassword: string) {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  },
};
