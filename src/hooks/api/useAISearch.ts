import { api } from "@/libs/axios";
import { Pokemon } from "@/types/pokemon";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { AxiosError } from "axios";
import { AISearchResponse } from "@/types/api-response-types/pokemon-api-response-type";

type useAISearchOptions = Omit<
  UseMutationOptions<Pokemon[], Error, string>,
  "mutationFn" | "onSuccess" | "onError"
>;

export default function useAISearch(options?: useAISearchOptions) {
  const triggerToast = useToast();

  return useMutation({
    mutationFn: async (query: string) => {
      const res = await api.post<AISearchResponse>("/api/search/ai", { query });
      
      if (res.data.error) {
        throw new Error(res.data.error);
      }
      
      return res.data.pokemons;
    },
    onSuccess: (data) => {
      triggerToast("success", "검색 완료", "요청하신 조건에 부합하는 포켓몬 목록을 가져왔습니다.");
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.status === 400) {
          triggerToast(
            "error",
            "잘못된 요청",
            "검색어를 입력해주세요."
          );
        } else {
          triggerToast(
            "error",
            "검색 실패",
            "AI 검색 서버에 문제가 발생했습니다. 잠시후 다시 시도해주세요."
          );
        }
      } else {
        triggerToast(
            "error",
            "검색 실패",
            "알 수 없는 에러가 발생했습니다."
          );
      }
    },
    ...options
  });
}
