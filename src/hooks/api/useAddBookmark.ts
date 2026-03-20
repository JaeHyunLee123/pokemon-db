import { api } from "@/libs/axios";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

type UseAddBookmarkOptions = Omit<
  UseMutationOptions<{ isBookmarked: boolean }, Error, number>,
  "mutationFn"
>;

export default function useAddBookmark(options?: UseAddBookmarkOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pokemonId: number) => {
      const res = await api.post(`/api/bookmarks/${pokemonId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    ...options,
  });
}
