import { deleteSession, getSession } from "@/libs/session";
import { NextResponse } from "next/server";
import { getPostHogClient } from "@/libs/posthog-server";

export async function POST() {
  try {
    const session = await getSession();
    await deleteSession();

    if (session) {
      const posthog = getPostHogClient();
      posthog.capture({ distinctId: String(session.userId), event: "user_logged_out" });
      await posthog.shutdown();
    }

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "unexpected server error" },
      { status: 500 },
    );
  }
}
