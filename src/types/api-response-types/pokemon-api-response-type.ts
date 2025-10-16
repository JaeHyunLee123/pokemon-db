import { Pokemon } from "@/types/pokemon";

export interface PokemonList {
  nextCursor: number;
  pokemons: Pokemon[];
}
