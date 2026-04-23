import { UsedEmailError } from "@/errors/auth-error";
import { SignUpSchema } from "@/schemas/sign-up-schema";
import { authService } from "@/services/auth-services";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { signUpRateLimiter } from "@/libs/rate-limiter";
import { getClientIp } from "@/libs/get-ip";
import { getPostHogClient } from "@/libs/posthog-server";

const SignUpServerSchema = SignUpSchema.pick({ email: true, password: true });

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    await signUpRateLimiter.consume(ip);

    const json = await req.json();

    const { email, password } = SignUpServerSchema.parse(json);

    await authService.signUp(email, password);

    const posthog = getPostHogClient();
    posthog.identify({ distinctId: email, properties: { email } });
    posthog.capture({ distinctId: email, event: "user_signed_up", properties: { email } });
    await posthog.shutdown();

    return NextResponse.json({}, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof UsedEmailError) {
      return NextResponse.json(
        { message: "Email already used" },
        { status: 409 },
      );
    }

    if (e && typeof e === "object" && "remainingPoints" in e) {
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

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
