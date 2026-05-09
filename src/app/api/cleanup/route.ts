import { NextRequest } from "next/server";
import { deleteExpiredSessions } from "@/lib/session";

// Vercel Cron Job で叩かれるエンドポイント
// vercel.json: { "crons": [{ "path": "/api/cleanup", "schedule": "0 * * * *" }] }
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletedCount = await deleteExpiredSessions();

  return Response.json({ deletedCount });
}
