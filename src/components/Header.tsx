"use client";

import PokemonSearchInput from "@/components/PokemonSearchInput";
import { cn } from "@/libs/utils";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky w-full">
      <div className="bg-red-500 h-14" />
      <div className="bg-black h-14 flex items-center justify-center">
        <h1 className="text-white font-semibold text-2xl">포켓몬 DB</h1>
      </div>
      <div className="bg-white h-14 flex justify-center items-center px-1">
        <PokemonSearchInput
          className={cn(pathname === "/" ? "visible" : "hidden")}
        />
      </div>
    </header>
  );
}
