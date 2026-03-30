import { useQueries, UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/libs/axios";
import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import { Pokemon } from "@/types/pokemon";

type UseGetPokemonsByNamesOptions = Omit<
  UseQueryOptions<Pokemon | null, Error, Pokemon | null, readonly string[]>,
  "queryKey" | "queryFn"
>;

/**
 * 스피드 퀴즈 시작 전, 주어진 배열의 포켓몬 데이터를 한 번에 병렬로 가져오는 훅
 * @param names 조회할 포켓몬 이름 배열
 * @param options 선택적 쿼리 옵션
 */
export default function useGetPokemonsByNames(
  names: string[],
  options?: UseGetPokemonsByNamesOptions,
) {
  const pokemonQueries = useQueries({
    queries: names.map((name) => ({
      ...options,
      queryKey: ["pokemon", name],
      queryFn: async () => {
        const res = await api.get<PokemonList>("/api/pokemon", {
          params: { name },
        });
        // 배열 첫 번째 포켓몬만 단일로 추출
        return res.data.pokemons[0] ?? null;
      },
      // 기본적으로 퀴즈 도중 불필요한 재요청 방지를 위해 Infinity 적용하되,
      // 외부에서 넘긴 staleTime이 있으면 해당 값을 우선시함
      staleTime: options?.staleTime ?? Infinity,
      // 배열에 이름이 존재하는지 여부와 외부에서 전달한 enabled 값을 모두 만족할 때만 활성화
      enabled: names.length > 0 && (options?.enabled ?? true),
    })),
  });

  // 모든 쿼리가 성공적으로 로드되었는지 확인
  const isAllLoaded =
    names.length > 0 && pokemonQueries.every((q) => q.isSuccess);

  return {
    pokemonQueries,
    isAllLoaded,
  };
}
