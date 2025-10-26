import { POKEMON_TYPE_KR, TYPE_COLORS } from "@/constants";
import { cn } from "@/libs/utils";

type Size = "sm" | "md" | "lg";

interface TypeBadgeProps {
  type: string;
  size?: Size;
  className?: string;
}

export default function TypeBadge({
  type,
  size = "md",
  className = "",
}: TypeBadgeProps) {
  const key = (type ?? "").toLowerCase();
  const color = TYPE_COLORS[key] ?? TYPE_COLORS.unknown;

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs rounded-md"
      : size === "lg"
      ? "px-4 py-1.5 text-sm rounded-lg"
      : "px-3 py-1 text-sm rounded-md"; // md

  const displayText = POKEMON_TYPE_KR[key] ?? "알 수 없음";

  return (
    <div
      role="status"
      aria-label={`타입: ${displayText}`}
      className={cn(color, sizeClasses, "inline-flex items-center", className)}
    >
      <span>{displayText}</span>
    </div>
  );
}
