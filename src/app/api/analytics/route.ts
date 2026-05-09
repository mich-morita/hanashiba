import { NextRequest } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEventType } from "@/types";

// Only client-initiated events are accepted here.
// Server-initiated events (session_start, first_message, session_end) are tracked inside their own routes.
const CLIENT_EVENTS: AnalyticsEventType[] = ["return_visit"];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = body?.event as AnalyticsEventType;

  if (!CLIENT_EVENTS.includes(event)) {
    return Response.json({ error: "Invalid event" }, { status: 400 });
  }

  await trackEvent(event);
  return Response.json({ success: true });
}
