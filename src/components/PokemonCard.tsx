import { cn } from "@/libs/utils";
import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, MouseEvent } from "react";
import HeartIcon from "./icons/HeartIcon";

interface PokemonCardProps extends Omit<ComponentProps<typeof Link>, "href"> {
  pokemon: Pokemon;
  isBookmarked?: boolean;
  onBookmarkToggle?: (pokemonId: number) => void;
}

export default function PokemonCard({
  pokemon,
  isBookmarked = false,
  onBookmarkToggle,
  className,
  ...props
}: PokemonCardProps) {
  const handleBookmarkClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(pokemon.id);
  };

  return (
    <Link
      {...props}
      href={`/${pokemon.id}`}
      className={cn(
        "flex flex-col relative gap-1 overflow-hidden justify-center items-center px-8 py-10 border-b-4 border-r-4 border-gray-800 rounded-xl bg-neutral-50 cursor-pointer hover:scale-105 transition-transform",
        className,
      )}
      prefetch={false}
    >
      <div className="w-full absolute top-0">
        <div className="h-2 bg-red-500" />
        <div className="h-2 bg-black" />
      </div>

      <button
        onClick={handleBookmarkClick}
        className="absolute top-4 right-4 z-10 p-1 hover:scale-110 transition-transform cursor-pointer"
        type="button"
      >
        <HeartIcon
          isFilled={isBookmarked}
          className={cn(
            "size-7",
            isBookmarked ? "text-red-500" : "text-gray-400 hover:text-red-500",
          )}
        />
      </button>

      <Image
        src={pokemon.frontImageUrl}
        alt={`${pokemon.name}-image`}
        width={90}
        height={90}
      />

      <span className="text-lg font-medium">{pokemon.name}</span>

      <div className="w-full absolute bottom-0">
        <div className="h-2 bg-black" />
        <div className="h-2 bg-red-500" />
      </div>
    </Link>
  );
}

