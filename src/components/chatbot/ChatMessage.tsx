"use client";

import { User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/faq";
import { cn } from "@/lib/utils";
import FAQAnswerCard from "./FAQAnswerCard";
import SuggestedQuestions from "./SuggestedQuestions";
import ApisAvatar from "./ApisAvatar";

type ChatMessageProps = {
  message: ChatMessageType;
  onSelectQuestion: (question: string) => void;
};

// Renders a single chat bubble for either the user or the assistant.
export default function ChatMessage({
  message,
  onSelectQuestion,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-2">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-navyCore px-3.5 py-2.5 text-sm text-white">
          {message.content}
        </div>
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navyDeep text-white">
          <User className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <ApisAvatar size="sm" className="mt-0.5 ring-navyCore/20" />
      <div
        className={cn(
          "max-w-[85%] rounded-2xl rounded-tl-sm border border-hairlineDivider bg-white px-3.5 py-3 shadow-sm"
        )}
      >
        {message.variant === "answer" ||
        message.variant === "authority" ||
        message.variant === "mixed" ? (
          <FAQAnswerCard
            content={message.content}
            structuredAnswer={message.structuredAnswer}
            authorityAnswer={message.authorityAnswer}
            answerSource={message.answerSource}
            suggestedActions={message.suggestedActions}
            source={message.source}
            reference={message.reference}
            cta={message.relatedCTA}
          />
        ) : message.variant === "fallback" ? (
          <div className="space-y-3">
            <p className="whitespace-pre-line text-sm leading-relaxed text-headlineBlack">
              {message.content}
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="/faq"
                className="inline-flex items-center rounded-subtle border border-navyCore px-3 py-1.5 text-xs font-semibold text-navyCore hover:bg-offWhiteSection"
              >
                Buka FAQ
              </a>
              <a
                href="/formulir-panduan-pengaduan"
                className="inline-flex items-center rounded-subtle bg-navyCore px-3 py-1.5 text-xs font-semibold text-white hover:bg-navyDeep"
              >
                Formulir Panduan Pengaduan
              </a>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-line text-sm leading-relaxed text-headlineBlack">
            {message.content}
          </p>
        )}

        {message.relatedQuestions && message.relatedQuestions.length > 0 ? (
          <SuggestedQuestions
            className="mt-3"
            questions={message.relatedQuestions}
            onSelect={onSelectQuestion}
          />
        ) : null}
      </div>
    </div>
  );
}
