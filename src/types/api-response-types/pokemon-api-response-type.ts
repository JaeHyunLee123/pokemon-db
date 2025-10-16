import { Pokemon } from "@/types/pokemon";

export interface PokemonList {
  nextCursor: number | undefined;
  pokemons: Pokemon[];
}
