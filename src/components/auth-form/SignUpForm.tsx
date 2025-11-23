"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { cn } from "@/libs/utils";
import { ComponentProps } from "react";

export default function SignUpForm({
  className,
  ...props
}: ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-2", className)} {...props}>
      <Input label="이메일" placeholder="example@example.com" type="email" />
      <Input label="비밀번호" type="password" />
      <Input label="비밀번호확인" type="password" />
      <Button>회원가입</Button>
    </form>
  );
}
