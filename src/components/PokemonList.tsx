"use client";

import Loading from "@/components/common/Loading";
import PokemonCard from "@/components/PokemonCard";
import useInfinitePokemon from "@/hooks/api/useInfinitePokemon";
import useSearchStore from "@/hooks/stores/useSearchStore";
import { useDebounce } from "@/hooks/useDebounce";
import useObserver from "@/hooks/useObserver";
import { PokemonList as PokemonListType } from "@/types/api-response-types/pokemon-api-response-type";
import { InfiniteData } from "@tanstack/react-query";
import React from "react";

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
      [initialPokemonData]
    );

  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfinitePokemon(debouncedSearchParam, {
      initialData: debouncedSearchParam ? undefined : initialInfiniteData,
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
    <div className="flex flex-col justify-start items-center gap-10 max-w-4xl">
      <section className="gap-2 flex items-start justify-center flex-wrap w-full">
        {data ? (
          data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.pokemons.map((pokemon) => (
                <PokemonCard pokemon={pokemon} key={pokemon.id} />
              ))}
            </React.Fragment>
          ))
        ) : (
          <h1 className="text-2xl">에러 발생</h1>
        )}
      </section>

      {hasNextPage ? (
        isFetchingNextPage ? (
          <Loading />
        ) : (
          <div ref={observerRef} />
        )
      ) : (
        <span className="text-lg">조건에 맞는 데이터가 더 이상 없습니다.</span>
      )}
    </div>
  );
}
