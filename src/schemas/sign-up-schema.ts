import z from "zod";

export const SignUpSchema = z
  .object({
    email: z.email("이메일 형식으로 입력해주세요."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .max(64, "비밀번호는 최대 64자까지 가능합니다."),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다",
  });

export type SignUp = z.infer<typeof SignUpSchema>;
