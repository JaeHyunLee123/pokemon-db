"use client";

import PokemonCard from "@/components/PokemonCard";
import useInfinitePokemon from "@/hooks/api/useInfinitePokemon";
import useObserver from "@/hooks/useObserver";
import React from "react";

export default function PokemonList() {
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfinitePokemon();

  const onObserverIntersection = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const observerRef = useObserver(onObserverIntersection);

  if (isPending) {
    return <span className="text-xl">로딩중...</span>;
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
          <span className="text-lg">로딩중...</span>
        ) : (
          <div ref={observerRef} />
        )
      ) : (
        <span className="text-lg">조건에 맞는 데이터가 더 이상 없습니다.</span>
      )}
    </div>
  );
}
