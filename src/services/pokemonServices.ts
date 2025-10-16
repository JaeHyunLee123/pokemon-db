import { pokemonRepository } from "@/repositories/pokemonRepository";
import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import { PokemonDetail } from "@/types/pokemon";

export const pokemonService = {
  /**
   * 포켓몬 목록 조회 (커서 기반 페이지네이션 + 이름 검색)
   */
  async getList(cursor = 1, name?: string): Promise<PokemonList> {
    const safeCursor = cursor > 0 ? cursor : 1;

    const pokemons = await pokemonRepository.findList(safeCursor, name);

    // nextCursor 계산
    const lastPokemon = pokemons[pokemons.length - 1];
    const nextCursor = lastPokemon ? lastPokemon.id + 1 : safeCursor;

    return {
      nextCursor,
      pokemons,
    };
  },

  /**
   * 포켓몬 상세 조회
   */
  async getById(id: number): Promise<PokemonDetail | null> {
    if (!id || id <= 0) throw new Error("Invalid Pokemon ID");

    const pokemon = await pokemonRepository.findById(id);

    if (!pokemon) {
      throw new Error(`Pokemon with id ${id} not found`);
    }

    return pokemon;
  },
};
