import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className="flex flex-col relative gap-1 overflow-hidden justify-center items-center px-8 py-10 border-b-4 border-r-4 border-gray-800 rounded-xl bg-neutral-50 cursor-pointer hover:scale-105 transition-transform">
      <div className="w-full absolute top-0">
        <div className="h-2 bg-red-500" />
        <div className="h-2 bg-black" />
      </div>
      <Image
        src={pokemon.frontImageUrl}
        alt={`${pokemon.name}-image`}
        width={90}
        height={90}
      />
      <Link href={`/${pokemon.id}`}>
        <span className="text-lg font-medium hover:underline hover:font-semibold">
          {pokemon.name}
        </span>
      </Link>

      <div className="w-full absolute bottom-0">
        <div className="h-2 bg-black" />
        <div className="h-2 bg-red-500" />
      </div>
    </div>
  );
}
