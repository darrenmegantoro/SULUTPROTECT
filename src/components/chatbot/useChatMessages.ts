"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage as ChatMessageType } from "@/types/faq";
import {
  formatAuthorityAnswer,
  formatStructuredApisAnswer,
  getChatbotResponse,
} from "@/lib/faqSearch";
import { uid } from "@/lib/utils";
import { FRAUD_DEFINITION, mentionsFraud } from "@/data/glossary";
import { captureInteraction } from "@/lib/interactionCapture";
import { mapApisSource } from "@/lib/interactionNormalize";
import { analyzeQuery, resolveAuthorityRoute } from "@/lib/apisRouting";
import { APIS_GREETING } from "@/data/apis";

export const WELCOME_TEXT = APIS_GREETING;

export const FALLBACK_TEXT =
  "Maaf, APIS belum menemukan jawaban yang cukup sesuai di basis FAQ. Anda dapat mencoba menggunakan kata kunci lain, membuka FAQ, atau mengisi Formulir Panduan Pengaduan agar sistem membantu mengarahkan kanal yang tepat.";

export const CLARIFICATION_TEXT =
  "Saya menemukan beberapa topik yang mungkin terkait. Silakan pilih salah satu pertanyaan berikut:";

export const SUGGESTED_QUESTIONS = [
  "Apakah ada batas waktu untuk menyampaikan pengaduan kepada Bank Indonesia?",
  "Apakah saya harus mengadu ke Penyelenggara terlebih dahulu sebelum ke Bank Indonesia?",
  "Apa tanda pengaduan salah alamat ke Bank Indonesia?",
  "Bagaimana membedakan apakah saya harus mengadu ke BI, OJK, atau polisi?",
  "Apa yang harus saya lakukan jika merasa menjadi korban transfer dana terindikasi fraud?",
];

const LONG_ANSWER_THRESHOLD = 400;

function isLongAssistantMessage(message: ChatMessageType): boolean {
  if (message.role !== "assistant") return false;
  if (message.variant === "welcome" || message.variant === "clarification") {
    return false;
  }
  return message.content.length >= LONG_ANSWER_THRESHOLD;
}

export function useChatScroll(
  messages: ChatMessageType[],
  options?: { panelOpen?: boolean; alignToWelcome?: boolean }
) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestAssistantRef = useRef<HTMLDivElement>(null);
  const firstAssistantRef = useRef<HTMLDivElement>(null);

  const latestAssistantId =
    messages.length > 0 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1].id
      : null;

  const firstAssistantId =
    messages.find((message) => message.role === "assistant")?.id ?? null;

  const scrollAssistantToStart = (
    ref: React.RefObject<HTMLDivElement | null>,
    behavior: ScrollBehavior = "auto"
  ) => {
    ref.current?.scrollIntoView({ block: "start", behavior });
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    if (lastMessage.role === "assistant") {
      if (
        lastMessage.variant === "welcome" ||
        (messages.length === 1 && lastMessage.role === "assistant")
      ) {
        scrollAssistantToStart(firstAssistantRef, "auto");
        return;
      }

      if (isLongAssistantMessage(lastMessage)) {
        scrollAssistantToStart(latestAssistantRef, "smooth");
        return;
      }
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!options?.panelOpen || options.alignToWelcome === false) return;

    const frame = requestAnimationFrame(() => {
      scrollAssistantToStart(firstAssistantRef, "auto");
    });

    return () => cancelAnimationFrame(frame);
  }, [options?.panelOpen, options?.alignToWelcome, messages]);

  return {
    scrollRef,
    latestAssistantRef,
    firstAssistantRef,
    latestAssistantId,
    firstAssistantId,
  };
}

function createWelcomeMessage(): ChatMessageType {
  return {
    id: uid("msg"),
    role: "assistant",
    content: WELCOME_TEXT,
    variant: "welcome",
  };
}

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    createWelcomeMessage(),
  ]);

  const sendQuestion = useCallback((rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question) return;

    const userMessage: ChatMessageType = {
      id: uid("msg"),
      role: "user",
      content: question,
    };

    const result = getChatbotResponse(question);
    let assistantMessage: ChatMessageType;

    if (result.type === "answer") {
      let structured = result.structured;
      if (mentionsFraud(result.item.pertanyaan, result.item.jawaban)) {
        structured = {
          ...structured,
          penjelasan: `${structured.penjelasan}\n\n${FRAUD_DEFINITION}`,
        };
      }
      assistantMessage = {
        id: uid("msg"),
        role: "assistant",
        content: formatStructuredApisAnswer(structured),
        source: result.item.basisHukumUtama,
        reference: result.item.basisHukumUtama,
        structuredAnswer: structured,
        relatedCTA: result.cta,
        answerSource: result.answerSource,
        variant: "answer",
      };
    } else if (result.type === "authority") {
      assistantMessage = {
        id: uid("msg"),
        role: "assistant",
        content: formatAuthorityAnswer(result.authority),
        authorityAnswer: result.authority,
        suggestedActions: result.suggestedActions,
        relatedQuestions: result.relatedQuestions,
        answerSource: result.answerSource,
        variant: "authority",
      };
    } else if (result.type === "mixed") {
      let structured = result.structured;
      if (mentionsFraud(result.item.pertanyaan, result.item.jawaban)) {
        structured = {
          ...structured,
          penjelasan: `${structured.penjelasan}\n\n${FRAUD_DEFINITION}`,
        };
      }
      assistantMessage = {
        id: uid("msg"),
        role: "assistant",
        content: `${formatAuthorityAnswer(result.authority)}\n\n---\n\n${formatStructuredApisAnswer(structured)}`,
        authorityAnswer: result.authority,
        structuredAnswer: structured,
        suggestedActions: result.suggestedActions,
        relatedQuestions: result.relatedQuestions,
        answerSource: result.answerSource,
        variant: "mixed",
      };
    } else if (result.type === "clarification") {
      assistantMessage = {
        id: uid("msg"),
        role: "assistant",
        content: result.content,
        relatedQuestions: result.relatedQuestions,
        answerSource: result.answerSource,
        variant: "clarification",
      };
    } else {
      assistantMessage = {
        id: uid("msg"),
        role: "assistant",
        content: FALLBACK_TEXT,
        variant: "fallback",
      };
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    const recommendation =
      result.type === "answer"
        ? "Dijawab dari FAQ"
        : result.type === "authority"
          ? "Arahan kewenangan"
          : result.type === "mixed"
            ? "FAQ + arahan kewenangan"
            : result.type === "clarification"
              ? "Klarifikasi domain"
              : "Tidak ditemukan di FAQ";

    const signals = analyzeQuery(question);
    const authorityRoute = resolveAuthorityRoute(signals);

    captureInteraction({
      channel: "APIS",
      category:
        result.type === "answer"
          ? result.item.kategori
          : result.type === "authority" || result.type === "mixed"
            ? "Arahan kewenangan"
            : undefined,
      query: question,
      matchedFaqId:
        result.type === "answer" || result.type === "mixed"
          ? String(result.item.id)
          : undefined,
      matchedFaqQuestion:
        result.type === "answer" || result.type === "mixed"
          ? result.item.pertanyaan
          : undefined,
      matchedAuthorityRouteId: authorityRoute?.id,
      apisSource:
        result.type !== "fallback"
          ? mapApisSource(result.answerSource)
          : undefined,
      recommendation,
      isCompleted: result.type !== "fallback",
      needsKnowledgeReview:
        result.type === "fallback" || recommendation === "Tidak ditemukan di FAQ",
    });
  }, []);

  const reset = useCallback(() => {
    setMessages([createWelcomeMessage()]);
  }, []);

  const isFresh = messages.length <= 1;

  return { messages, sendQuestion, reset, isFresh };
}
