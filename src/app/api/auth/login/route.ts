import { IncorrectPasswordError, NoUserError } from "@/errors/auth-error";
import { authService } from "@/services/auth-services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");
  const password = searchParams.get("password");

  if (!(email && password)) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    await authService.login(email, password);
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    if (e instanceof NoUserError) {
      return NextResponse.json({ message: "No User" }, { status: 404 });
    }

    if (e instanceof IncorrectPasswordError) {
      return NextResponse.json(
        { message: "incorrect password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "unknown server error" },
      { status: 500 }
    );
  }
}
