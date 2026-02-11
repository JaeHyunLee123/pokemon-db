"use client";

import PokemonCard from "@/components/PokemonCard";
import { api } from "@/libs/axios";
import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import { Pokemon } from "@/types/pokemon";
import { UIEventHandler, useEffect, useMemo, useRef, useState } from "react";

const POKEMON_CARD_HEIGHT_PX = 206 + 10; //card heght + margin
const POKEMON_COUNT = 1000;
const INNER_CONTAINER_HEIGHT = POKEMON_CARD_HEIGHT_PX * POKEMON_COUNT;
const BUFFER = 5;

export default function VirtualListTestPage() {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    api.get<PokemonList>("/api/pokemon").then((res) => {
      setAllPokemons(Array(POKEMON_COUNT).fill(res.data.pokemons[0]));
    });
  }, []);

  //1. 전체화면 버추얼 리스트

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  //The view port (outer container)
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setScrollTop(e.currentTarget.scrollTop);
  };

  const { visiblePokemons, startIndex } = useMemo(() => {
    if (!containerHeight || allPokemons.length === 0) {
      return { visiblePokemons: [], startIndex: 0 };
    }

    const newStartIndex = Math.floor(scrollTop / POKEMON_CARD_HEIGHT_PX);
    const visibleCount = Math.ceil(containerHeight / POKEMON_CARD_HEIGHT_PX);

    const start = Math.max(0, newStartIndex - BUFFER);
    const end = Math.min(
      allPokemons.length,
      newStartIndex + visibleCount + BUFFER,
    );

    return {
      visiblePokemons: allPokemons.slice(start, end),
      startIndex: start,
    };
  }, [allPokemons, containerHeight, scrollTop]);

  useEffect(() => {
    if (!containerRef.current) return;
    setContainerHeight(containerRef.current?.clientHeight);

    // console.log("height:" + containerRef.current?.clientHeight);
    // console.log("count:" + visiblePokemons.length);
  }, [containerRef.current?.clientHeight]);

  //2. 반응형 버추얼 리스트

  return (
    // Outer
    <div
      className="flex flex-col gap-2 h-[100vh] overflow-y-scroll w-full p-10"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {/* Inner */}
      <div
        className="relative w-full"
        style={{ height: `${INNER_CONTAINER_HEIGHT}px` }}
      >
        {/* Sliding window */}
        <div
          className="absolute w-full top-0 left-0"
          style={{
            transform: `translateY(${startIndex * POKEMON_CARD_HEIGHT_PX}px)`,
          }}
        >
          {visiblePokemons ? (
            visiblePokemons.map((pokemon, i) => (
              <PokemonCard
                key={startIndex + i}
                pokemon={{ ...pokemon, name: pokemon.name + (startIndex + i) }}
                className="mb-2.5"
              />
            ))
          ) : (
            <span>포켓몬 정보를 불러오지 못했습니다.</span>
          )}
        </div>
      </div>
    </div>
  );
}
