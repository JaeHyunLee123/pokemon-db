import useSearchStore from "@/hooks/stores/useSearchStore";
import { cn } from "@/libs/utils";

interface PokemonSearchInputProps {
  className?: string;
}

export default function PokemonSearchInput({
  className,
}: PokemonSearchInputProps) {
  const { setSearch, search } = useSearchStore();

  return (
    <input
      className={cn(
        "bg-neutral-50 rounded p-2 max-w-md w-full border focus:outline-none ",
        className
      )}
      placeholder="포켓몬 이름으로 검색해보세요!"
      value={search}
      onChange={(e) => {
        setSearch(e.currentTarget.value);
      }}
    />
  );
}
