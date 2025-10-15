/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "../src/generated/prisma/index.js";
import axios from "axios";

const prisma = new PrismaClient();

const createPocketmonImageUrl = ({
  id,
  isFront = true,
}: {
  id: number;
  isFront: boolean;
}) => {
  const baseUrl =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
  return isFront ? `${baseUrl}/${id}.png` : `${baseUrl}/back/${id}.png`;
};

async function main() {
  for (let i = 1; i <= 1000; i++) {
    try {
      const [pokemonResponse, speciesResponse] = await Promise.all([
        axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`),
        axios.get(`https://pokeapi.co/api/v2/pokemon-species/${i}`),
      ]);

      const pokemon = pokemonResponse.data;
      const species = speciesResponse.data;

      // ✅ 한국어 이름 찾기 (없으면 영어 이름 fallback)
      const nameEntry = species.names.find(
        (n: any) => n.language.name === "ko"
      );
      const name = nameEntry ? nameEntry.name : species.name;

      // ✅ 한국어 설명 찾기 (없으면 영어 fallback)
      const flavorEntry =
        species.flavor_text_entries.find(
          (f: any) => f.language.name === "ko"
        ) ||
        species.flavor_text_entries.find((f: any) => f.language.name === "en");
      const description = flavorEntry
        ? flavorEntry.flavor_text.replace(/\n|\f/g, " ")
        : "No description available.";

      // ✅ 타입 정보 추출
      const types = pokemon.types.map((t: any) => t.type.name);

      // ✅ 이미지 URL
      const frontImageUrl = createPocketmonImageUrl({ id: i, isFront: true });
      const backImageUrl = createPocketmonImageUrl({ id: i, isFront: false });

      // ✅ Prisma에 저장
      await prisma.pokemon.upsert({
        where: { id: i },
        update: {},
        create: {
          id: i,
          name,
          description,
          types,
          frontImageUrl,
          backImageUrl,
        },
      });

      console.log(`✅ Seeded Pokémon #${i}: ${name}`);
    } catch (_) {
      console.warn(`⚠️ Failed to seed Pokémon #${i}:`);
      continue;
    }
  }
}

main()
  .then(async () => {
    console.log("🎉 Seeding complete!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
