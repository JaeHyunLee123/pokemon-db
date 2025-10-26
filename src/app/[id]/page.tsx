import PokemonImageCard from "@/components/PokemonImageCard";
import { pokemonService } from "@/services/pokemon-services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pokemonDetail = await pokemonService.getById(Number(id));

  if (!pokemonDetail) {
    return <div>서버에 에러가 발생했습니다. 잠시 후 다시 시도해주세요.</div>;
  }

  const { name, frontImageUrl, backImageUrl, description, types } =
    pokemonDetail;

  return (
    <div className="flex flex-col items-center p-10 gap-2">
      <PokemonImageCard
        frontImageUrl={frontImageUrl}
        backImageUrl={backImageUrl}
        pokemonName={name}
      />
      <h1 className="text-2xl">{name}</h1>

      <p>{description}</p>

      <div className="flex items-center justify-center gap-1">
        {types.map((type, i) => (
          <span key={i}>{type}</span>
        ))}
      </div>
    </div>
  );
}
