import { prisma } from "./prisma";

const SESSION_TTL_HOURS = 24;

export function getSessionExpiresAt(): Date {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_TTL_HOURS);
  return expiresAt;
}

export async function createSession() {
  return prisma.chatSession.create({
    data: {
      expiresAt: getSessionExpiresAt(),
    },
  });
}

export async function getSession(sessionId: string) {
  return prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function deleteSession(sessionId: string) {
  return prisma.chatSession.delete({
    where: { id: sessionId },
  });
}

export async function deleteExpiredSessions() {
  const result = await prisma.chatSession.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
  return result.count;
}

export function isSessionExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
