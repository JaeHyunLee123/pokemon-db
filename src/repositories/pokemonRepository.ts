import prisma from "@/libs/prisma";
import { Pokemon } from "@/types/pokemon";

export const pokemonRepository = {
  async findList(cursor = 1, name?: string): Promise<Pokemon[]> {
    const pokemons = await prisma.pokemon.findMany({
      where: name
        ? {
            name: {
              contains: name,
              mode: "insensitive", // 대소문자 구분 없이 검색
            },
          }
        : undefined,
      orderBy: {
        id: "asc",
      },
      cursor: {
        id: cursor,
      },
      take: 20,
      skip: 0,
      select: {
        id: true,
        name: true,
        frontImageUrl: true,
      },
    });

    return pokemons;
  },
};
