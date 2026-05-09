import { NextRequest } from "next/server";
import { openai, SYSTEM_PROMPT, FALLBACK_MESSAGE } from "@/lib/openai";
import { detectCrisis, getCrisisResponse } from "@/lib/safety";
import { getSession, isSessionExpired } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";
import { SendMessageRequest } from "@/types";
import type { Message as PrismaMessage } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  const body: SendMessageRequest = await req.json();
  const { sessionId, content } = body;

  if (!sessionId || !content?.trim()) {
    return Response.json(
      { error: "sessionId と content は必須です" },
      { status: 400 }
    );
  }

  const session = await getSession(sessionId);
  if (!session) {
    return Response.json({ error: "セッションが見つかりません" }, { status: 404 });
  }
  if (isSessionExpired(session.expiresAt)) {
    return Response.json(
      { error: "セッションの有効期限が切れています" },
      { status: 410 }
    );
  }

  // Track first_message KPI (before inserting, length 0 means this is the first)
  if (session.messages.length === 0) {
    trackEvent("first_message");
  }

  await prisma.message.create({
    data: { sessionId, role: "user", content: content.trim() },
  });

  const history = session.messages.map((m: PrismaMessage) => ({
    role: m.role,
    content: m.content,
  }));

  let aiContent: string;
  if (detectCrisis(content.trim())) {
    trackEvent("crisis_detected");
    aiContent = getCrisisResponse();
  } else {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
          { role: "user", content: content.trim() },
        ],
        max_tokens: 200,
        temperature: 0.7,
      });
      aiContent = completion.choices[0]?.message?.content ?? FALLBACK_MESSAGE;
    } catch {
      // OpenAI failure → soft fallback, session remains intact
      aiContent = FALLBACK_MESSAGE;
    }
  }

  const assistantMessage = await prisma.message.create({
    data: { sessionId, role: "assistant", content: aiContent },
  });

  return Response.json({ message: assistantMessage });
}
