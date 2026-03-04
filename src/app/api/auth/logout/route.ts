import { deleteSession } from "@/libs/session";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await deleteSession();

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "unexpected server error" },
      { status: 500 },
    );
  }
}
