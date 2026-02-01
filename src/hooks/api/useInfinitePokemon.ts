import { api } from "@/libs/axios";
import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

// ✅ 외부에서 넘길 수 없는 옵션 제거 (내부에서 고정할 값들)
type UseInfinitePokemonOptions = Omit<
  UseInfiniteQueryOptions<
    PokemonList,
    Error,
    InfiniteData<PokemonList>,
    readonly unknown[],
    number | undefined
  >,
  "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
>;

export default function useInfinitePokemon(
  searchParam?: string,
  options?: UseInfinitePokemonOptions
) {
  return useInfiniteQuery({
    queryKey: ["pokemon", searchParam ?? ""], // 외부에서 못 바꾸도록 내부 고정
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get("/api/pokemon", {
        params: {
          cursor: pageParam,
          name: searchParam && searchParam.length > 0 ? searchParam : undefined,
        },
      });

      return res.data as PokemonList;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: 1,
    ...options,
  });
}
