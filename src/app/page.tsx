import PokemonCard from "@/components/PokemonCard";
import { pokemonService } from "@/services/pokemon-services";

export default async function Home() {
  const { pokemons } = await pokemonService.getList();

  return (
    <div className="p-10 gap-2 flex items-start justify-start flex-wrap bg-neutral-300 ">
      {pokemons.map((pokemon) => (
        <PokemonCard pokemon={pokemon} key={pokemon.id} />
      ))}
    </div>
  );
}
