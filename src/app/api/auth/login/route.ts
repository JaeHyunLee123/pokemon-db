import { IncorrectPasswordError, NoUserError } from "@/errors/auth-error";
import { LoginFormSchema } from "@/schemas/login-schema";
import { authService } from "@/services/auth-services";
import { NextRequest, NextResponse } from "next/server";
import { loginRateLimiter } from "@/libs/rate-limiter";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    await loginRateLimiter.consume(ip);
    
    const json = await req.json();

    const { email, password } = LoginFormSchema.parse(json);

    await authService.login(email, password);
    return NextResponse.json({}, { status: 200 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "remainingPoints" in e) {
        // RateLimiter Error object has remainingPoints
        return NextResponse.json(
            { message: "Too Many Requests" },
            { status: 429 },
        );
    }

    // zod validation error
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 },
      );
    }

    if (e instanceof NoUserError || e instanceof IncorrectPasswordError) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "unknown server error" },
      { status: 500 },
    );
  }
}
