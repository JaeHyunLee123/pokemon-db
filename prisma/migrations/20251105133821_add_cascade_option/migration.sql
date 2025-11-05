-- DropForeignKey
ALTER TABLE "public"."PokemonBookmark" DROP CONSTRAINT "PokemonBookmark_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PokemonBookmark" DROP CONSTRAINT "PokemonBookmark_userId_fkey";

-- AddForeignKey
ALTER TABLE "PokemonBookmark" ADD CONSTRAINT "PokemonBookmark_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonBookmark" ADD CONSTRAINT "PokemonBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
