import { NextRequest } from "next/server";
import { deleteSession, getSession } from "@/lib/session";
import { trackEvent } from "@/lib/analytics";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const session = await getSession(sessionId);
  if (!session) {
    return Response.json({ error: "セッションが見つかりません" }, { status: 404 });
  }

  trackEvent("session_end");
  await deleteSession(sessionId);

  return Response.json({ success: true });
}
