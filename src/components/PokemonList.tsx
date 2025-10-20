"use client";

import PokemonCard from "@/components/PokemonCard";
import useInfinitePokemon from "@/hooks/api/useInfinitePokemon";
import React from "react";

export default function PokemonList() {
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfinitePokemon();

  const handleFetchButtonClick: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();

    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (isPending) {
    return <h1 className="text-2xl">로딩중...</h1>;
  }

  return (
    <div className="flex flex-col justify-start items-center gap-10">
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
      <button
        onClick={handleFetchButtonClick}
        className="bg-white rounded-xl border-4 border-black p-2"
        disabled={isFetchingNextPage || !hasNextPage}
      >
        더 불러오기
      </button>
    </div>
  );
}
