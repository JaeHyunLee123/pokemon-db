import { NoSessionError, NoUserError } from "@/errors/auth-error";
import { userService } from "@/services/user-services";
import { UserResponse } from "@/types/api-response-types/user-api-resonse-type";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { email, id, createdAt, updatedAt } =
      await userService.findUserBySession();

    const responseUser: UserResponse = { email, id, createdAt, updatedAt };

    return NextResponse.json(responseUser);
  } catch (e) {
    console.error(e);
    if (e instanceof NoSessionError) {
      return NextResponse.json({ message: "No session" }, { status: 401 });
    }

    if (e instanceof NoUserError) {
      return NextResponse.json({ message: "No user" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Unknown server error" },
      { status: 500 }
    );
  }
}
