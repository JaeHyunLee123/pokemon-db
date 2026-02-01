import prisma from "@/libs/prisma";

export const userRepository = {
  async findUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  },

  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  },
};
