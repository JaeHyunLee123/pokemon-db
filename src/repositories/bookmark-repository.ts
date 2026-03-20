import prisma from "@/libs/prisma";

export const bookmarkRepository = {
  async findBookmark(userId: number, pokemonId: number) {
    return prisma.pokemonBookmark.findUnique({
      where: {
        pokemonId_userId: {
          pokemonId,
          userId,
        },
      },
    });
  },

  async createBookmark(userId: number, pokemonId: number) {
    return prisma.pokemonBookmark.create({
      data: {
        userId,
        pokemonId,
      },
    });
  },

  async deleteBookmark(userId: number, pokemonId: number) {
    return prisma.pokemonBookmark.delete({
      where: {
        pokemonId_userId: {
          pokemonId,
          userId,
        },
      },
    });
  },

  async findBookmarksByUserId(userId: number) {
    return prisma.pokemonBookmark.findMany({
      where: {
        userId,
      },
      include: {
        pokemon: {
          select: {
            id: true,
            name: true,
            frontImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
