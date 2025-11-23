import { cn } from "@/libs/utils";
import { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  inputClassName?: string;
  errorMessage?: string;
  label?: string;
}

export default function Input({
  className,
  label,
  inputClassName,
  errorMessage,
  ...props
}: InputProps) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-sm">{label}</span>
      <input
        className={cn(
          "bg-neutral-50 p-2 focus:outline-none border-t border-l border-b-2 border-r-2 border-black",
          inputClassName
        )}
        {...props}
      />
      <span className="text-xs text-red-500">{errorMessage}</span>
    </label>
  );
}
