// Captures public website interactions into the shared interaction store
// for the Integrated Dashboard.

import type { InteractionCapturePayload } from "@/types/interactions";
import { appendInteraction } from "@/lib/interactionStore";

export function captureInteraction(payload: InteractionCapturePayload): void {
  if (typeof window === "undefined") return;
  appendInteraction(payload);
}
