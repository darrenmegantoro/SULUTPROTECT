/** Public display name for the FAQ-based interactive complaint assistant. */
export const APIS_NAME = "Asisten Pengaduan Interaktif Sulut (APIS)";

/** Short label for compact UI (floating button, CTAs). */
export const APIS_SHORT = "APIS";

export const APIS_ASK_LABEL = `Tanya ${APIS_SHORT}`;

/** Public avatar for APIS (launcher, headers, chat bubbles). */
export const APIS_AVATAR_PATH = "/images/apis-avatar.png";

/** Maps stored interaction channel values to display labels. */
export function formatInteractionChannel(channel: string): string {
  if (channel === "Asisten") return APIS_NAME;
  return channel;
}
