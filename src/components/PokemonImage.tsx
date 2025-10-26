"use client";

import { cn } from "@/libs/utils";
import Image from "next/image";
import { MouseEventHandler, useState } from "react";

const POKEMON_DEFAULT_IMAGE_SIZE = 150;

const CARD_PADDING_PIXEL = 10;

interface PokemonImageProps {
  frontImageUrl: string;
  backImageUrl: string;
  pokemonName: string;
  imageSize?: number;
  className?: string;
}

export default function PokemonImage({
  frontImageUrl,
  backImageUrl,
  pokemonName,
  imageSize = POKEMON_DEFAULT_IMAGE_SIZE,
  className = "",
}: PokemonImageProps) {
  const [isFront, setIsFront] = useState(true);

  const handleImageClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    setIsFront((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "relative cursor-pointer flex p-1 items-center justify-center border-b-4 border-r-4 border-gray-800 rounded-xl bg-neutral-50",
        className
      )}
      style={{
        width: imageSize + CARD_PADDING_PIXEL,
        height: imageSize + CARD_PADDING_PIXEL,
      }}
      onClick={handleImageClick}
    >
      <Image
        alt={`${pokemonName}-front-image`}
        width={imageSize}
        height={imageSize}
        src={frontImageUrl}
        className={cn(
          "absolute transform-3d backface-hidden transition-transform duration-1000",
          isFront ? "rotate-y-0" : "rotate-y-180"
        )}
        priority
      />
      <Image
        alt={`${pokemonName}-back-image`}
        width={imageSize}
        height={imageSize}
        src={backImageUrl}
        className={cn(
          "absolute transform-3d backface-hidden transition-transform duration-1000",
          isFront ? "rotate-y-180" : "rotate-y-0"
        )}
        loading="eager"
      />
    </div>
  );
}
