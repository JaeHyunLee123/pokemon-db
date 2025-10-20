import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";

export default function useInfinitePokemon(
  searchParam?: string,
  options?: UseInfiniteQueryOptions<
    PokemonList,
    Error,
    InfiniteData<PokemonList>,
    readonly unknown[],
    number | undefined
  >
) {
  return useInfiniteQuery({
    queryKey: ["pokemon", searchParam ?? ""],
    queryFn: async ({ pageParam }) => {
      const res = await axios.get("/api/pokemon", {
        params: {
          cursor: pageParam,
          name: searchParam && searchParam.length > 0 ? searchParam : undefined,
        },
      });

      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextCursor) {
        return null;
      }

      return lastPage.nextCursor;
    },
    initialPageParam: 1,
    ...options,
  });
}
