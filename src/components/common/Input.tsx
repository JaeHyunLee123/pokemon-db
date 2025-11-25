import { cn } from "@/libs/utils";
import { ComponentProps, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
  type,
  ...props
}: InputProps) {
  const [isPasswordHide, setIsPasswordHide] = useState(type === "password");

  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <input
          className={cn(
            "bg-neutral-50 p-2 focus:outline-none border-t border-l border-b-2 border-r-2 border-black flex-1",
            inputClassName
          )}
          type={
            isPasswordHide ? "password" : type === "password" ? "text" : type
          }
          {...props}
        />
        {type === "password" ? (
          <button
            onClick={() => {
              setIsPasswordHide((prev) => !prev);
            }}
            type={"button"}
          >
            {isPasswordHide ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        ) : null}
      </div>
      <span className="text-xs text-red-500">{errorMessage}</span>
    </label>
  );
}
