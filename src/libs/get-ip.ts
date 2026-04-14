import { NextRequest } from "next/server";

export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
}
