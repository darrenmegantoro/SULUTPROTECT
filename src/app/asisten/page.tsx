"use client";

import { useState } from "react";
import { RotateCcw, Send } from "lucide-react";
import ChatMessage from "@/components/chatbot/ChatMessage";
import SuggestedQuestions from "@/components/chatbot/SuggestedQuestions";
import {
  useChatMessages,
  SUGGESTED_QUESTIONS,
  useChatScroll,
} from "@/components/chatbot/useChatMessages";
import { APIS_NAME } from "@/data/apis";
import ApisAvatar from "@/components/chatbot/ApisAvatar";
import { assignMessageRef } from "@/lib/assignMessageRef";

export default function AsistenPage() {
  const { messages, sendQuestion, reset, isFresh } = useChatMessages();
  const [input, setInput] = useState("");
  const { scrollRef, latestAssistantRef, firstAssistantRef, latestAssistantId, firstAssistantId } =
    useChatScroll(messages);

  const handleSend = (value: string) => {
    sendQuestion(value);
    setInput("");
  };

  return (
    <section className="bg-offWhiteSection py-10 sm:py-14">
      <div className="container-bi max-w-3xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <ApisAvatar size="xl" className="ring-navyCore/15" />
          <div>
            <h1 className="text-2xl font-bold text-headlineBlack sm:text-[28px]">
              {APIS_NAME}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-bodyTextGray">
              Ajukan pertanyaan berdasarkan FAQ SULUT PROTECT untuk mendapatkan
              informasi awal mengenai pengaduan Konsumen.
            </p>
          </div>
        </div>

        <div className="mt-6 flex h-[min(640px,calc(100vh-16rem))] flex-col overflow-hidden rounded-xl border border-hairlineDivider bg-white shadow-card">
          {/* Header */}
          <div className="flex items-center justify-between bg-navyCore px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <ApisAvatar size="md" />
              <div className="leading-tight">
                <p className="text-sm font-bold">{APIS_NAME}</p>
                <p className="text-[11px] text-white/70">
                  Jawaban berdasarkan FAQ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Atur ulang percakapan"
              title="Atur ulang percakapan"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Atur ulang
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="chat-scroll flex-1 space-y-4 overflow-y-auto bg-offWhiteSection px-4 py-5"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onSelectQuestion={handleSend}
                ref={(node) =>
                  assignMessageRef(
                    node,
                    message.id,
                    latestAssistantId,
                    firstAssistantId,
                    latestAssistantRef,
                    firstAssistantRef
                  )
                }
              />
            ))}

            {isFresh ? (
              <SuggestedQuestions
                title="Pertanyaan yang sering diajukan"
                questions={SUGGESTED_QUESTIONS}
                onSelect={handleSend}
              />
            ) : null}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2 border-t border-hairlineDivider bg-white px-3 py-3"
          >
            <label htmlFor="asisten-page-input" className="sr-only">
              Tulis pertanyaan Anda
            </label>
            <input
              id="asisten-page-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan Anda..."
              className="min-w-0 flex-1 rounded-full border border-hairlineDivider px-4 py-2.5 text-sm text-headlineBlack placeholder:text-captionGray focus-visible:border-navyCore"
            />
            <button
              type="submit"
              aria-label="Kirim pertanyaan"
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navyCore text-white transition-colors hover:bg-navyDeep disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
