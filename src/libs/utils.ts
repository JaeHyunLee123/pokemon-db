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
  const names: string[] = pokemonNames as string[];
  const selected = new Set<string>();

  const maxCount = Math.min(count, maxPokemonId);

  while (selected.size < maxCount) {
    const randomIndex = Math.floor(Math.random() * maxPokemonId);
    selected.add(names[randomIndex]);
  }

  return Array.from(selected);
}
