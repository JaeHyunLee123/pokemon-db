import { NoSessionError } from "@/errors/auth-error";
import { getSession } from "@/libs/session";
import { bookmarkService } from "@/services/bookmark-services";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      throw new NoSessionError();
    }

    const bookmarks = await bookmarkService.getUserBookmarks(session.userId);

    return NextResponse.json(bookmarks);
  } catch (e) {
    console.error(e);
    if (e instanceof NoSessionError) {
      return NextResponse.json({ message: "No session" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Unknown server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      throw new NoSessionError();
    }

    const { pokemonId } = await req.json();

    if (!pokemonId) {
      return NextResponse.json({ message: "Pokemon ID is required" }, { status: 400 });
    }

    const result = await bookmarkService.toggleBookmark(session.userId, pokemonId);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    if (e instanceof NoSessionError) {
      return NextResponse.json({ message: "No session" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Unknown server error" },
      { status: 500 }
    );
  }
}
