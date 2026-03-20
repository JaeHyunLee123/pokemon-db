import { NoSessionError } from "@/errors/auth-error";
import { getSession } from "@/libs/session";
import { bookmarkService } from "@/services/bookmark-services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) throw new NoSessionError();

    const { id } = await params;
    const pokemonId = parseInt(id);

    if (isNaN(pokemonId)) {
      return NextResponse.json(
        { message: "Invalid Pokemon ID" },
        { status: 400 },
      );
    }

    const result = await bookmarkService.addBookmark(session.userId, pokemonId);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    if (e instanceof NoSessionError) {
      return NextResponse.json({ message: "No session" }, { status: 401 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) throw new NoSessionError();

    const { id } = await params;
    const pokemonId = parseInt(id);

    if (isNaN(pokemonId)) {
      return NextResponse.json(
        { message: "Invalid Pokemon ID" },
        { status: 400 },
      );
    }

    const result = await bookmarkService.removeBookmark(
      session.userId,
      pokemonId,
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    if (e instanceof NoSessionError) {
      return NextResponse.json({ message: "No session" }, { status: 401 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
