import { IncorrectPasswordError, NoUserError } from "@/errors/auth-error";
import { LoginFormSchema } from "@/schemas/login-schema";
import { authService } from "@/services/auth-services";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const { email, password } = LoginFormSchema.parse(json);

    await authService.login(email, password);
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    // zod validation error
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 },
      );
    }

    if (e instanceof NoUserError) {
      return NextResponse.json({ message: "No User" }, { status: 404 });
    }

    if (e instanceof IncorrectPasswordError) {
      return NextResponse.json(
        { message: "incorrect password" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "unknown server error" },
      { status: 500 },
    );
  }
}
