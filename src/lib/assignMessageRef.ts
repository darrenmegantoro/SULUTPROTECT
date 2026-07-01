import type { MutableRefObject, RefObject } from "react";

export function assignMessageRef(
  node: HTMLDivElement | null,
  messageId: string,
  latestAssistantId: string | null,
  firstAssistantId: string | null,
  latestAssistantRef: RefObject<HTMLDivElement | null>,
  firstAssistantRef: RefObject<HTMLDivElement | null>
) {
  if (messageId === latestAssistantId) {
    (latestAssistantRef as MutableRefObject<HTMLDivElement | null>).current =
      node;
  }
  if (messageId === firstAssistantId) {
    (firstAssistantRef as MutableRefObject<HTMLDivElement | null>).current =
      node;
  }
}
