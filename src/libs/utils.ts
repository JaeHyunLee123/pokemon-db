import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import pokemonNames from "@/constants/pokemonNames.json";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const DEFAULT_MAX_POKEMON_ID = 100;

/**
 * 주어진 숫자만큼 중복되지 않는 랜덤 포켓몬 이름을 추출합니다.
 * @param count 추출할 포켓몬 개수 (기본값: 10)
 * @returns 중복 없는 랜덤 포켓몬 이름 배열
 */
export function getRandomPokemons(
  count: number = 10,
  maxPokemonId = DEFAULT_MAX_POKEMON_ID,
): string[] {
  const namesPool: string[] = (pokemonNames as string[]).slice(0, maxPokemonId);

  // Fisher-Yates shuffle
  for (let i = namesPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [namesPool[i], namesPool[j]] = [namesPool[j], namesPool[i]];
  }

  return namesPool.slice(0, Math.min(count, namesPool.length));
}
