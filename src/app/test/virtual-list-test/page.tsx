"use client";

import PokemonCard from "@/components/PokemonCard";
import { api } from "@/libs/axios";
import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import { Pokemon } from "@/types/pokemon";
import { UIEventHandler, useEffect, useMemo, useRef, useState } from "react";

const ROW_HEIGHT_PX = 210 + 10; //card heght + margin
const POKEMON_COUNT = 1000;
const BUFFER = 5;

const getItemsPerRow = (width: number) => {
  if (width > 900) {
    return 5;
  } else if (width > 740) {
    return 4;
  } else if (width > 570) {
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

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  //The view port (outer container)
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    setContainerHeight(containerRef.current.clientHeight);
    setContainerWidth(containerRef.current.clientWidth);
  }, [containerRef.current?.clientHeight, containerRef.current?.clientWidth]);

  const { visibleRows, startRowIndex, innerContainerHeight } = useMemo(() => {
    if (!containerHeight || allPokemons.length === 0) {
      return {
        visibleRows: [],
        startRowIndex: 0,
        innerContainerHeight: 0,
      };
    }

    const itemsPerRow = getItemsPerRow(containerWidth);
    const totalRows = Math.ceil(allPokemons.length / itemsPerRow);
    const innerContainerHeight = totalRows * ROW_HEIGHT_PX;

    const newStartIndex = Math.floor(scrollTop / ROW_HEIGHT_PX);
    const visibleRowCount = Math.ceil(containerHeight / ROW_HEIGHT_PX);

    const startRowIndex = Math.max(0, newStartIndex - BUFFER);
    const endRowIndex = Math.min(
      totalRows,
      newStartIndex + visibleRowCount + BUFFER,
    );

    const startItemIndex = startRowIndex * itemsPerRow;
    const endItemIndex = endRowIndex * itemsPerRow;

    const slicedItems = allPokemons.slice(startItemIndex, endItemIndex);

    const groupedRows: Pokemon[][] = [];
    for (let i = 0; i < slicedItems.length; i += itemsPerRow) {
      groupedRows.push(slicedItems.slice(i, i + itemsPerRow));
    }
    return {
      visibleRows: groupedRows,
      startRowIndex: newStartIndex,
      innerContainerHeight,
    };
  }, [allPokemons, containerHeight, scrollTop, containerWidth]);

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
        style={{ height: `${innerContainerHeight}px` }}
      >
        {/* Sliding window */}
        <div
          className="absolute w-full top-0 left-0 flex flex-col items-center gap-2.5 "
          style={{
            transform: `translateY(${startRowIndex * ROW_HEIGHT_PX}px)`,
          }}
        >
          {visibleRows ? (
            visibleRows.map((row, rowIndex) => (
              <div
                key={`row-${startRowIndex + rowIndex}`}
                className="flex flex-wrap justify-start gap-2.5 mb-2.5"
              >
                {row.map((pokemon) => (
                  <PokemonCard pokemon={pokemon} key={pokemon.id} />
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
