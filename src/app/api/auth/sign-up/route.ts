import { UsedEmailError } from "@/errors/auth-error";
import { SignUpSchema } from "@/schemas/sign-up-schema";
import { authService } from "@/services/auth-services";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const SignUpServerSchema = SignUpSchema.pick({ email: true, password: true });

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const { email, password } = SignUpServerSchema.parse(json);

    await authService.signUp(email, password);

    return NextResponse.json({}, { status: 201 });
  } catch (e) {
    if (e instanceof UsedEmailError) {
      return NextResponse.json(
        { message: "Email already used" },
        { status: 409 }
      );
    }

    // zod validation error
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
