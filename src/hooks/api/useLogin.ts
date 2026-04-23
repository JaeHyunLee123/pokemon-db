import useToast from "@/hooks/useToast";
import { api } from "@/libs/axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

type UseLoginOptions = Omit<
  UseMutationOptions<unknown, AxiosError, { email: string; password: string }>,
  "mutationFn" | "onSuccess" | "onError"
>;

export default function useLogin(options?: UseLoginOptions) {
  const triggerToast = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      await api.post("/api/auth/login", { email, password });
    },
    onSuccess: (_, variables) => {
      posthog.identify(variables.email, { email: variables.email });
      triggerToast("success", "로그인 성공", "로그인에 성공했습니다.");
      router.push("/");
    },
    onError: (e) => {
      if (e.status === 400) {
        triggerToast("error", "로그인 실패", "올바르지 않은 형식입니다.");
      } else if (e.status === 401) {
        triggerToast(
          "error",
          "로그인 실패",
          "이메일이나 비밀번호가 올바르지 않습니다.",
        );
      } else {
        triggerToast(
          "error",
          "로그인 실패",
          "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
    },
    ...options,
  });
}
