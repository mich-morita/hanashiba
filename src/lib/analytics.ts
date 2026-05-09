import { prisma } from "./prisma";
import { AnalyticsEventType } from "@/types";

// Analytics failures must never surface to the user.
export async function trackEvent(event: AnalyticsEventType): Promise<void> {
  try {
    await prisma.analyticsEvent.create({ data: { event } });
  } catch {
    // intentionally silent
  }
}
