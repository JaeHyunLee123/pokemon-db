"use client";

import { cn } from "@/libs/utils";
import { ComponentProps } from "react";

export default function Button({
  className,
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "bg-neutral-50 px-4 py-2 rounded-lg cursor-pointer border border-black disabled:bg-neutral-300 disabled:text-neutral-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
