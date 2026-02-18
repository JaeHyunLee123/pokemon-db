import { NextRequest, NextResponse } from "next/server";
import { pokemonService } from "@/services/pokemon-services";

// GET /api/pokemon?cursor=1&name=pi
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = Number(searchParams.get("cursor") || 1);
  const name = searchParams.get("name") || undefined;

  try {
    const pokemons = await pokemonService.getList(cursor, name);
    return NextResponse.json(pokemons);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch Pokemon list" },
      { status: 500 },
    );
  }
}
