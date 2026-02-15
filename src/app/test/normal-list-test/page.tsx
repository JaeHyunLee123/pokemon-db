"use client";

import PokemonCard from "@/components/PokemonCard";
import { api } from "@/libs/axios";
import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import { Pokemon } from "@/types/pokemon";
import { useEffect, useState } from "react";

const POKEMON_COUNT = 1000;

export default function NormalListTest() {
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

  return (
    <section className="gap-2 flex items-start justify-center flex-wrap max-w-4xl">
      {allPokemons.map((pokemon) => (
        <PokemonCard pokemon={pokemon} key={pokemon.id} className="w-40" />
      ))}
    </section>
  );
}
