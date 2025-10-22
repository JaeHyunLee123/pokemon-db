import PokemonList from "@/components/PokemonList";
import { pokemonService } from "@/services/pokemon-services";

export default async function Home() {
  const initialPokemonList = await pokemonService.getList();

  return (
    <div className="p-10 flex justify-center">
      <PokemonList initialPokemonData={initialPokemonList} />
    </div>
  );
}
