import { NextRequest } from "next/server";
import { createSession } from "@/lib/session";
import { trackEvent } from "@/lib/analytics";
import { CreateSessionResponse } from "@/types";

export async function POST(_req: NextRequest) {
  const session = await createSession();

  // Fire-and-forget — do not await to keep response fast
  trackEvent("session_start");

  const response: CreateSessionResponse = {
    sessionId: session.id,
    expiresAt: session.expiresAt,
  };

  return Response.json(response, { status: 201 });
}
