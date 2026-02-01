"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import useLogin from "@/hooks/api/useLogin";
import { cn } from "@/libs/utils";
import { LoginFormSchema, LoginFormType } from "@/schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = (form: LoginFormType) => {
    mutate(form);
  };

  return (
    <form
      className={cn("flex flex-col gap-2", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Input
        label="이메일"
        placeholder="example@example.com"
        type="email"
        aria-label="email-input"
        {...register("email")}
        errorMessage={errors.email?.message}
      />
      <Input
        label="비밀번호"
        type="password"
        aria-label="password-input"
        {...register("password")}
        errorMessage={errors.password?.message}
      />

      <Button type="submit" aria-label="login-button" disabled={isPending}>
        {isPending ? "로딩중" : "로그인"}
      </Button>
    </form>
  );
}
