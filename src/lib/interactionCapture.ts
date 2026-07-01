// Captures public website interactions into the shared interaction store.

import type { InteractionCapturePayload } from "@/types/interactions";
import { createInteraction } from "@/lib/interactionStore";

export function captureInteraction(payload: InteractionCapturePayload): void {
  if (typeof window === "undefined") return;
  createInteraction(payload);
}
