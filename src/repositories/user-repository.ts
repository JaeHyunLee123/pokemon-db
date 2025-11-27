import prisma from "@/libs/prisma";

export const userRepository = {
  async findUserById(id: number) {
    await prisma.user.findUnique({
      where: {
        id,
      },
    });
  },

  async findUserByEmail(email: string) {
    await prisma.user.findUnique({
      where: {
        email,
      },
    });
  },
};
