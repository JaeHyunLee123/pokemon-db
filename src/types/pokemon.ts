import { Pokemon as PokemonGenerated } from "@/generated/prisma";

export type Pokemon = Pick<PokemonGenerated, "id" | "name" | "frontImageUrl">;

export type PokemonDetail = Omit<PokemonGenerated, "createdAt" | "updatedAt">;
