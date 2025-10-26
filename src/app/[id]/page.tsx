import PokemonImage from "@/components/PokemonImage";
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

  const { name, frontImageUrl, backImageUrl } = pokemonDetail;

  return (
    <div className="flex flex-col items-center p-10">
      <PokemonImage
        frontImageUrl={frontImageUrl}
        backImageUrl={backImageUrl}
        pokemonName={name}
      />
      {`Detail of ${name}`}
    </div>
  );
}
