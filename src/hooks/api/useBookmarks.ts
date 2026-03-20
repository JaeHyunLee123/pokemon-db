import { api } from "@/libs/axios";
import { Pokemon } from "@/types/pokemon";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseBookmarksOptions = Omit<
  UseQueryOptions<Pokemon[], Error>,
  "queryKey" | "queryFn"
>;

export default function useBookmarks(options?: UseBookmarksOptions) {
  return useQuery<Pokemon[], Error>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const res = await api.get("/api/bookmarks");
      return res.data;
    },
    ...options,
  });
}
