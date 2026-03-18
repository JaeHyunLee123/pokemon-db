import { pokemonPageSize } from "@/constants";
import { pokemonRepository } from "@/repositories/pokemon-repository";
import { PokemonList } from "@/types/api-response-types/pokemon-api-response-type";
import { PokemonDetail, Pokemon } from "@/types/pokemon";

export const pokemonService = {
  /**
   * 포켓몬 목록 조회 (커서 기반 페이지네이션 + 이름 검색)
   */
  async getList(cursor = 1, name?: string): Promise<PokemonList> {
    const safeCursor = cursor > 0 ? cursor : 1;

    const pokemons = await pokemonRepository.findList(safeCursor, name);

    // nextCursor 계산
    const lastPokemon = pokemons[pokemons.length - 1];
    const nextCursor =
      pokemons.length >= pokemonPageSize ? lastPokemon.id + 1 : undefined;

    return {
      nextCursor,
      pokemons,
    };
  },

  /**
   * 포켓몬 상세 조회
   */
  async getById(id: number): Promise<PokemonDetail | null> {
    if (!id || id <= 0) throw new Error("Invalid Pokemon ID");

    const pokemon = await pokemonRepository.findById(id);

    if (!pokemon) {
      throw new Error(`Pokemon with id ${id} not found`);
    }

    return pokemon;
  },

  /**
   * AI를 활용한 포켓몬 검색
   */
  async searchByAI(query: string): Promise<Pokemon[]> {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const fs = await import("fs");
    const path = await import("path");

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 1. Load the 1000 pokemon names from static file
    const namesPath = path.join(
      process.cwd(),
      "src",
      "constants",
      "pokemonNames.json"
    );
    if (!fs.existsSync(namesPath)) {
      throw new Error("pokemon names static file missing");
    }
    const namesData = fs.readFileSync(namesPath, "utf8");
    const pokemonNames = JSON.parse(namesData);

    // 2. Prepare Gemini Prompt with Context Injection
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
당신은 포켓몬 전문가입니다. 
사용자의 질문 또는 묘사를 바탕으로 조건에 가장 잘 맞는 포켓몬을 최대 5마리 찾아주세요. 

중요한 조건: 
반드시 아래의 제공된 [DB 포켓몬 이름 목록]에 있는 이름들 중에서만 골라야 합니다! (번역명을 임의로 바꾸지 마세요.)
결과는 오직 배열 안에 포켓몬 이름(문자열)만 넣은 순수 JSON 형식으로 반환해야 합니다. 마크다운이나 다른 설명은 절대 포함하지 마세요.

사용자 질문: "${query}"

[DB 포켓몬 이름 목록 (총 ${pokemonNames.length}개)]:
${pokemonNames.join(", ")}
    `;

    // 3. Request completion (guaranteeing JSON response)
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const textResult = result.response.text();
    let aiNames: string[] = [];

    try {
      aiNames = JSON.parse(textResult);
    } catch {
      console.error("Failed to parse Gemini JSON:", textResult);
      throw new Error("Failed to process AI response");
    }

    if (!Array.isArray(aiNames) || aiNames.length === 0) {
      return [];
    }

    // 4. Query DB for matched pokemons
    const pokemons = await pokemonRepository.findManyByName(aiNames);

    // 5. Order the results to match AI recommendation priority
    const orderedPokemons = aiNames
      .map((name) => pokemons.find((p) => p.name === name))
      .filter((p): p is Pokemon => p !== undefined);

    return orderedPokemons;
  },
};
