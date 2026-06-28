"use client";

import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/faq";
import { cn } from "@/lib/utils";
import FAQAnswerCard from "./FAQAnswerCard";
import SuggestedQuestions from "./SuggestedQuestions";

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
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-navyCore/30 bg-white text-navyCore">
        <Bot className="h-4 w-4" aria-hidden="true" />
      </span>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl rounded-tl-sm border border-hairlineDivider bg-white px-3.5 py-3 shadow-sm"
        )}
      >
        {message.variant === "answer" ? (
          <FAQAnswerCard
            content={message.content}
            source={message.source}
            reference={message.reference}
            cta={message.relatedCTA}
          />
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
