import { api } from "@/libs/axios";
import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import { Pokemon } from "@/types/pokemon";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetPokemonByNameOptions = Omit<
  UseQueryOptions<Pokemon | null, Error, Pokemon | null, readonly string[]>,
  "queryKey" | "queryFn"
>;

export default function useGetPokemonByName(
  name: string,
  options?: UseGetPokemonByNameOptions,
) {
  return useQuery({
    ...options,
    queryKey: ["pokemon", name],
    queryFn: async () => {
      const res = await api.get<PokemonList>("/api/pokemon", {
        params: {
          name,
        },
      });

      return res.data.pokemons[0] ?? null;
    },
    // name이 있을 때만 기본적으로 페칭되도록 처리
    enabled: !!name && (options?.enabled ?? true),
  });
}
