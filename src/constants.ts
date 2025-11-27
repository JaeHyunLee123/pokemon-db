export const pokemonPageSize = 20;

export const POKEMON_TYPE_KR: Record<string, string> = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  grass: "풀",
  electric: "전기",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  dark: "악",
  steel: "강철",
  fairy: "페어리",
} as const;

export const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400 text-black",
  fire: "bg-red-500 text-white",
  water: "bg-blue-500 text-white",
  grass: "bg-emerald-500 text-white",
  electric: "bg-amber-400 text-black",
  ice: "bg-cyan-200 text-black",
  fighting: "bg-orange-600 text-white",
  poison: "bg-purple-600 text-white",
  ground: "bg-amber-700 text-white",
  flying: "bg-sky-200 text-black",
  psychic: "bg-pink-500 text-white",
  bug: "bg-lime-600 text-white",
  rock: "bg-stone-500 text-white",
  ghost: "bg-indigo-800 text-white",
  dragon: "bg-violet-700 text-white",
  dark: "bg-neutral-800 text-white",
  steel: "bg-slate-400 text-black",
  fairy: "bg-pink-300 text-black",
  // fallback key
  unknown: "bg-gray-200 text-black",
} as const;

const SECRET_KEY = process.env.SESSION_SECRET;
