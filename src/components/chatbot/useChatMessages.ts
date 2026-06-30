"use client";

import { useCallback, useState } from "react";
import type { ChatMessage as ChatMessageType } from "@/types/faq";
import {
  formatAuthorityAnswer,
  formatStructuredApisAnswer,
  getChatbotResponse,
} from "@/lib/faqSearch";
import { uid } from "@/lib/utils";
import { FRAUD_DEFINITION, mentionsFraud } from "@/data/glossary";
import { captureInteraction } from "@/lib/interactionCapture";
import { APIS_NAME } from "@/data/apis";

export const WELCOME_TEXT = `Halo, saya ${APIS_NAME}. Saya dapat membantu Anda mencari informasi dari FAQ terkait pengaduan Konsumen, dokumen, batas waktu, kanal BI Bicara, LAPS SJK, dan proses penanganan pengaduan oleh Bank Indonesia. Saya juga dapat memberikan arahan awal jika permasalahan berada di luar ruang lingkup Bank Indonesia.`;

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

    captureInteraction({
      channel: "Asisten",
      category:
        result.type === "answer"
          ? result.item.kategori
          : result.type === "authority" || result.type === "mixed"
            ? "Arahan kewenangan"
            : undefined,
      query: question,
      resultRecommendation:
        result.type === "answer"
          ? "Dijawab dari FAQ"
          : result.type === "authority"
            ? "Arahan kewenangan"
            : result.type === "mixed"
              ? "FAQ + arahan kewenangan"
              : result.type === "clarification"
                ? "Klarifikasi domain"
                : "Tidak ditemukan di FAQ",
    });
  }, []);

  const reset = useCallback(() => {
    setMessages([createWelcomeMessage()]);
  }, []);

  const isFresh = messages.length <= 1;

  return { messages, sendQuestion, reset, isFresh };
}
