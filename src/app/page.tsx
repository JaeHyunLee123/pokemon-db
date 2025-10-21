import PokemonList from "@/components/PokemonList";

export default async function Home() {
  return (
    <div className="p-10 flex justify-center">
      <PokemonList />
    </div>
  );
}
