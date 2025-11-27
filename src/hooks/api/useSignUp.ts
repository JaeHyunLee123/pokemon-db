import useToast from "@/hooks/useToast";
import { api } from "@/libs/axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

type useSignUpOptions = Omit<
  UseMutationOptions<unknown, Error, { email: string; password: string }>,
  "mutationFn" | "onSuccess" | "onError"
>;

export default function useSignUp(options?: useSignUpOptions) {
  const triggerToast = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      await api.post("/api/auth/sign-up", { email, password });
    },
    onSuccess: () => {
      triggerToast("success", "회원가입 성공", "회원가입에 성공했습니다.");
      router.push("/login");
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.status === 409) {
          triggerToast(
            "error",
            "이미 사용중인 이메일",
            "이미 사용중인 이메일입니다. 다른 이메일로 회원가입 해주세요."
          );
        } else if (e.status === 400) {
          triggerToast(
            "error",
            "올바르지 않은 형식",
            "올바르지 않은 형식입니다. 모든 정보를 입력해주세요."
          );
        } else {
          triggerToast(
            "error",
            "알 수 없는 에러",
            "알 수 없는 에러가 발생했습니다. 잠시후 다시 시도해주세요."
          );
        }
      } else {
        triggerToast(
          "error",
          "알 수 없는 에러",
          "알 수 없는 에러가 발생했습니다. 잠시후 다시 시도해주세요."
        );
      }
    },
    ...options,
  });
}
