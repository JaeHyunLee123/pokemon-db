import { pokemonService } from "@/services/pokemon-services";
import { NextResponse } from "next/server";

// GET /api/pokemon/[id]
export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/pokemon/[id]">
) {
  const { id } = await ctx.params;

  try {
    const pokemon = await pokemonService.getById(Number(id));
    return NextResponse.json(pokemon);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch Pokemon" },
      { status: 500 }
    );
  }
}
