import { NextRequest, NextResponse } from "next/server";
import { pokemonService } from "@/services/pokemon-services";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Search query is missing" },
        { status: 400 }
      );
    }

    const pokemons = await pokemonService.searchByAI(query);

    return NextResponse.json({ pokemons });
  } catch (error: any) {
    console.error("AI Search Error:", error);

    if (error.message === "GEMINI_API_KEY is not configured") {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error while searching" },
      { status: 500 }
    );
  }
}
