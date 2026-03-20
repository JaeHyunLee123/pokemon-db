import { api } from "@/libs/axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type UseDeleteBookmarkOptions = Omit<
  UseMutationOptions<{ isBookmarked: boolean }, Error, number>,
  "mutationFn"
>;

export default function useDeleteBookmark(options?: UseDeleteBookmarkOptions) {
  return useMutation({
    mutationFn: async (pokemonId: number) => {
      const res = await api.delete(`/api/bookmarks/${pokemonId}`);
      return res.data;
    },

    ...options,
  });
}
