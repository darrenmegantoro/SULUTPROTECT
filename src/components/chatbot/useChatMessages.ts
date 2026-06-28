"use client";

import { useCallback, useState } from "react";
import type { ChatMessage as ChatMessageType } from "@/types/faq";
import { getChatbotResponse } from "@/lib/faqSearch";
import { summarizeAnswer, uid } from "@/lib/utils";
import { FRAUD_DEFINITION, mentionsFraud } from "@/data/glossary";
import { focusLabel } from "@/data/faq";
import { captureInteraction } from "@/lib/interactionCapture";

export const WELCOME_TEXT =
  "Halo, saya Asisten. Saya dapat membantu Anda mencari informasi dari FAQ terkait pengaduan Konsumen, dokumen, batas waktu, kanal BI Bicara, LAPS SJK, dan proses penanganan pengaduan oleh Bank Indonesia.";

export const FALLBACK_TEXT =
  "Maaf, saya belum menemukan jawaban yang sesuai di FAQ. Silakan coba gunakan kata kunci lain, buka halaman FAQ, atau hubungi BI Bicara untuk memperoleh edukasi lebih lanjut.";

export const CLARIFICATION_TEXT =
  "Saya menemukan beberapa topik yang mungkin terkait. Silakan pilih salah satu pertanyaan berikut:";

export const SUGGESTED_QUESTIONS = [
  "Apa saja jenis pengaduan Konsumen?",
  "Apakah harus mengadu ke Penyelenggara dulu?",
  "Berapa batas waktu pengaduan ke BI?",
  "Dokumen apa yang perlu disiapkan?",
  "Kapan diarahkan ke LAPS SJK?",
  "Apa yang harus dilakukan jika menjadi korban fraud?",
];

function createWelcomeMessage(): ChatMessageType {
  return {
    id: uid("msg"),
    role: "assistant",
    content: WELCOME_TEXT,
    variant: "welcome",
  };
}

// Shared retrieval-based chat state used by the floating panel and the
// dedicated /asisten page. Each consumer gets its own independent instance.
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
      const summary = summarizeAnswer(result.item.answer);
      // Surface the fraud definition when the matched FAQ is fraud-related.
      const content = mentionsFraud(result.item.question, result.item.answer)
        ? `${summary}\n\n${FRAUD_DEFINITION}`
        : summary;
      assistantMessage = {
        id: uid("msg"),
        role: "assistant",
        content,
        source: result.item.source,
        reference: result.item.reference || undefined,
        relatedCTA: result.cta,
        variant: "answer",
      };
    } else if (result.type === "clarification") {
      assistantMessage = {
        id: uid("msg"),
        role: "assistant",
        content: CLARIFICATION_TEXT,
        relatedQuestions: result.relatedQuestions,
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

    // Capture a privacy-safe interaction record for admin monitoring.
    captureInteraction({
      channel: "Asisten",
      category: result.type === "answer" ? focusLabel(result.item.focus) : undefined,
      query: question,
      resultRecommendation:
        result.type === "answer"
          ? "Dijawab dari FAQ"
          : result.type === "clarification"
            ? "Klarifikasi pertanyaan"
            : "Tidak ditemukan di FAQ",
    });
  }, []);

  const reset = useCallback(() => {
    setMessages([createWelcomeMessage()]);
  }, []);

  const isFresh = messages.length <= 1;

  return { messages, sendQuestion, reset, isFresh };
}
