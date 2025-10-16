import { pokemonRepository } from "@/repositories/pokemonRepository";

export default async function Home() {
  const pokemons = await pokemonRepository.findList(5, "구리");

  return (
    <div className="flex flex-col p-10 gap-2">
      {pokemons.map((pokemon) => (
        <span key={pokemon.id}>{pokemon.name}</span>
      ))}
    </div>
  );
}
