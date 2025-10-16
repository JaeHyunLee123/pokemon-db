import PokemonList from "@/components/PokemonList";

export default async function Home() {
  return (
    <div className="flex flex-col p-10 gap-2">
      <PokemonList />
    </div>
  );
}
