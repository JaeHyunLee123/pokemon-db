"use client";

import Loading from "@/components/common/Loading";
import PokemonCard from "@/components/PokemonCard";
import useInfinitePokemon from "@/hooks/api/useInfinitePokemon";
import useSearchStore from "@/hooks/stores/useSearchStore";
import { useDebounce } from "@/hooks/useDebounce";
import useObserver from "@/hooks/useObserver";
import useVirtualList from "@/hooks/useVirtualList";
import { PokemonList as PokemonListType } from "@/types/api-response-types/pokemon-api-response-type";
import { InfiniteData } from "@tanstack/react-query";
import React, { useMemo, useRef } from "react";

const ROW_HEIGHT_PX = 210 + 10; //card heght + margin

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

interface PokemonListProps {
  initialPokemonData: PokemonListType;
}

export default function PokemonList({ initialPokemonData }: PokemonListProps) {
  const { search } = useSearchStore();
  const debouncedSearchParam = useDebounce(search);

  const initialInfiniteData: InfiniteData<PokemonListType, number | undefined> =
    React.useMemo(
      () => ({
        pageParams: [1],
        pages: [initialPokemonData],
      }),
      [initialPokemonData],
    );

  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfinitePokemon(debouncedSearchParam, {
      initialData: debouncedSearchParam ? undefined : initialInfiniteData,
    });

  const allItems = useMemo(() => {
    if (!data) return [];

    return data.pages
      .flat()
      .map((page) => page.pokemons)
      .flat();
  }, [data]);

  const outerContainerRef = useRef<HTMLDivElement>(null);

  const {
    handleOuterContainerScroll,
    innerContainerHeight,
    slidingWindowTranslatePx,
    visibleRows,
  } = useVirtualList({
    allItems,
    rowHeightPx: ROW_HEIGHT_PX,
    itemsPerRow: outerContainerRef.current
      ? getItemsPerRow(outerContainerRef.current.clientWidth)
      : 1,
    buffer: 10,
    outerContainerRef,
  });

  const onObserverIntersection = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const observerRef = useObserver(onObserverIntersection);

  if (isPending) {
    return <Loading />;
  }

  return (
    <div
      className="flex flex-col gap-2 h-[100vh] overflow-y-scroll w-full p-10"
      ref={outerContainerRef}
      onScroll={handleOuterContainerScroll}
    >
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
          {visibleRows.map((row, rowIndex) => (
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
          ))}
          {hasNextPage ? (
            isFetchingNextPage ? (
              <Loading />
            ) : (
              <div ref={observerRef} />
            )
          ) : (
            <span className="text-lg">
              조건에 맞는 데이터가 더 이상 없습니다.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
