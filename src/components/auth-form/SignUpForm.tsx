"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { cn } from "@/libs/utils";
import { SignUpSchema, type SignUp } from "@/schemas/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";

export default function SignUpForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = (form: SignUp) => {
    //TODO: api 연결
    console.log(form);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <Input
        label="이메일"
        placeholder="example@example.com"
        type="email"
        aria-label="email-input"
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="비밀번호"
        type="password"
        aria-label="password-input"
        errorMessage={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="비밀번호확인"
        type="password"
        aria-label="password-confirm-input"
        errorMessage={errors.passwordConfirm?.message}
        {...register("passwordConfirm")}
      />
      <Button type="submit" aria-label="sign-up-button">
        회원가입
      </Button>
    </form>
  );
}
