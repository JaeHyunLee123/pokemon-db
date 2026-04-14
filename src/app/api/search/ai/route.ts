import { NextRequest, NextResponse } from "next/server";
import { pokemonService } from "@/services/pokemon-services";
import z from "zod";
import { searchAiRateLimiter } from "@/libs/rate-limiter";
import { getClientIp } from "@/libs/get-ip";

const AISearchSchema = z.object({
  query: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    await searchAiRateLimiter.consume(ip);

    const body = await req.json();
    const { query } = AISearchSchema.parse(body);

    const pokemons = await pokemonService.searchByAI(query);

    return NextResponse.json({ pokemons });
  } catch (error: unknown) {
    console.error("AI Search Error:", error);

    if (error && typeof error === "object" && "remainingPoints" in error) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid search query limit" },
        { status: 400 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "GEMINI_API_KEY is not configured"
    ) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 503
    ) {
      return NextResponse.json(
        { error: "Service Unavailable (High Demand)" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error while searching" },
      { status: 500 },
    );
  }
}
