"use client";

import PokemonCard from "@/components/PokemonCard";
import useVirtualList from "@/hooks/useVirtualList";
import { api } from "@/libs/axios";
import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import { Pokemon } from "@/types/pokemon";
import { useEffect, useRef, useState } from "react";

const ROW_HEIGHT_PX = 210 + 10; //card heght + margin
const POKEMON_COUNT = 1000;
const BUFFER = 5;

const getItemsPerRow = (width: number) => {
  if (width > 900) {
    return 5;
  } else if (width > 740) {
    return 4;
  } else if (width > 600) {
    return 3;
  } else if (width > 405) {
    return 2;
  } else {
    return 1;
  }
};

export default function VirtualListTestPage() {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    api.get<PokemonList>("/api/pokemon").then((res) => {
      const uniquePokemons = Array.from({ length: POKEMON_COUNT }, (_, i) => ({
        ...res.data.pokemons[0],
        id: res.data.pokemons[0].id + i,
        name: `${res.data.pokemons[0].name}-${i}`,
      }));
      setAllPokemons(uniquePokemons);
    });
  }, []);

  const outerContainerRef = useRef<HTMLDivElement>(null);

  const {
    handleOuterContainerScroll,
    innerContainerHeight,
    slidingWindowTranslatePx,
    visibleRows,
  } = useVirtualList<Pokemon>({
    allItems: allPokemons,
    rowHeightPx: ROW_HEIGHT_PX,
    itemsPerRow: outerContainerRef.current
      ? getItemsPerRow(outerContainerRef.current.clientWidth)
      : 1,
    buffer: BUFFER,
    outerContainerRef,
  });

  return (
    // Outer
    <div
      className="flex flex-col gap-2 h-[100vh] overflow-y-scroll w-full p-10"
      ref={outerContainerRef}
      onScroll={handleOuterContainerScroll}
    >
      {/* Inner */}
      <div
        className="relative w-full"
        style={{ height: `${innerContainerHeight}px` }}
      >
        {/* Sliding window */}
        <div
          className="absolute w-full top-0 left-0 flex flex-col items-center gap-2.5 "
          style={{
            transform: `translateY(${slidingWindowTranslatePx}px)`,
          }}
        >
          {visibleRows ? (
            visibleRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="flex flex-wrap justify-start gap-2.5 mb-2.5"
              >
                {row.map((pokemon) => (
                  <PokemonCard
                    pokemon={pokemon}
                    key={pokemon.id}
                    className="w-40"
                  />
                ))}
              </div>
            ))
          ) : (
            <span>포켓몬 정보를 불러오지 못했습니다.</span>
          )}
        </div>
      </div>
    </div>
  );
}
