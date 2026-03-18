import PokemonList from "@/components/PokemonList";
import { pokemonService } from "@/services/pokemon-services";
import AISearchForm from "@/components/AISearchForm";

export default async function Home() {
  const initialPokemonList = await pokemonService.getList();

  return (
    <div className="p-10 flex justify-center relative min-h-[calc(100vh-112px)]">
      <PokemonList initialPokemonData={initialPokemonList} />
      
      {/* 플로팅 팝업 폼 */}
      <AISearchForm />
    </div>
  );
}
