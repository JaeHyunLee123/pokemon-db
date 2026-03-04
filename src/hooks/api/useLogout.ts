import useToast from "@/hooks/useToast";
import { api } from "@/libs/axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

type UseLogoutOptions = Omit<
  UseMutationOptions<unknown, AxiosError>,
  "mutationFn" | "onSuccess" | "onError"
>;

export default function useLogout(options?: UseLogoutOptions) {
  const triggerToast = useToast();

  return useMutation({
    mutationFn: async () => {
      await api.post("/api/auth/logout");
    },
    onSuccess: () => {
      triggerToast("success", "로그아웃 성공", "로그인 아웃에 성공했습니다.");
      window.location.reload();
    },
    onError: () => {
      triggerToast(
        "error",
        "로그아웃 실패",
        "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
    },
    ...options,
  });
}
