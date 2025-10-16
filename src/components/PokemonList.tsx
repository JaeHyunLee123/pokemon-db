"use client";

import type { PokemonList as PokemonListType } from "@/types/api-response-types/pokemon-api-response-type";
import { Pokemon } from "@/types/pokemon";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    axios
      .get<PokemonListType>("/api/pokemon?cursor=1&name=이상")
      .then((res) => {
        setPokemons(res.data.pokemons);
      });
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-1">
      {pokemons.map((pokemon) => (
        <span key={pokemon.id}>{pokemon.name}</span>
      ))}
    </div>
  );
}
