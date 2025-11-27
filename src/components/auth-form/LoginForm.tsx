"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { cn } from "@/libs/utils";
import { ComponentProps } from "react";

export default function LoginForm({
  className,
  ...props
}: ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-2", className)} {...props}>
      <Input
        label="이메일"
        placeholder="example@example.com"
        type="email"
        aria-label="email-input"
      />
      <Input label="비밀번호" type="password" aria-label="password-input" />

      <Button type="submit" aria-label="sign-up-button">
        {"로그인"}
      </Button>
    </form>
  );
}
