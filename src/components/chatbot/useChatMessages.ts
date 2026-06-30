"use client";

import { useCallback, useState } from "react";
import type { ChatMessage as ChatMessageType } from "@/types/faq";
import {
  formatStructuredApisAnswer,
  getChatbotResponse,
} from "@/lib/faqSearch";
import { uid } from "@/lib/utils";
import { FRAUD_DEFINITION, mentionsFraud } from "@/data/glossary";
import { captureInteraction } from "@/lib/interactionCapture";
import { APIS_NAME } from "@/data/apis";

export const WELCOME_TEXT = `Halo, saya ${APIS_NAME}. Saya dapat membantu Anda mencari informasi dari FAQ terkait pengaduan Konsumen, dokumen, batas waktu, kanal BI Bicara, LAPS SJK, dan proses penanganan pengaduan oleh Bank Indonesia.`;

export const FALLBACK_TEXT =
  "Maaf, APIS belum menemukan jawaban yang cukup sesuai di basis FAQ. Anda dapat mencoba menggunakan kata kunci lain, membuka FAQ, atau mengisi Formulir Panduan Pengaduan agar sistem membantu mengarahkan kanal yang tepat.";

export const CLARIFICATION_TEXT =
  "Saya menemukan beberapa topik yang mungkin terkait. Silakan pilih salah satu pertanyaan berikut:";

export const SUGGESTED_QUESTIONS = [
  "Apakah ada batas waktu untuk menyampaikan pengaduan kepada Bank Indonesia?",
  "Apakah saya harus mengadu ke Penyelenggara terlebih dahulu sebelum ke Bank Indonesia?",
  "Dokumen apa yang perlu disiapkan untuk pengaduan kerugian kepada Bank Indonesia?",
  "Kapan Konsumen dapat meminta fasilitasi kepada Bank Indonesia?",
  "Jika sengketa saya terjadi dengan bank yang diawasi OJK, ke mana saya harus mengadu lebih dahulu?",
  "Apa yang harus saya lakukan jika merasa menjadi korban transfer dana terindikasi fraud?",
];

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

    captureInteraction({
      channel: "Asisten",
      category:
        result.type === "answer" ? result.item.kategori : undefined,
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
