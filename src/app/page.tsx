import { pokemonService } from "@/services/pokemon-services";
import Image from "next/image";

export default async function Home() {
  const pokemons = await pokemonService.getList(5, "구리");

  const pokemonDetail = await pokemonService.getById(1);

  return (
    <div className="flex flex-col p-10 gap-2">
      {pokemons.pokemons.map((pokemon) => (
        <span key={pokemon.id}>{pokemon.name}</span>
      ))}
      <div>
        <h1 className="font-bold text-xl">{`name: ${pokemonDetail?.name}`}</h1>
        <p>{pokemonDetail?.description}</p>
        <Image
          src={pokemonDetail?.frontImageUrl || ""}
          width={100}
          height={100}
          alt={`image of ${pokemonDetail?.name}`}
        />
        {pokemonDetail
          ? pokemonDetail.types.map((type, i) => (
              <span key={i} className="mr-1">
                {type}
              </span>
            ))
          : null}
      </div>
    </div>
  );
}
