"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Send, X } from "lucide-react";
import { useChatbot } from "./ChatbotProvider";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import { useChatMessages, SUGGESTED_QUESTIONS } from "./useChatMessages";
import { APIS_NAME } from "@/data/apis";
import ApisAvatar from "./ApisAvatar";

export default function ChatbotPanel() {
  const { isOpen, close, pendingQuestion, clearPendingQuestion } = useChatbot();
  const { messages, sendQuestion, reset, isFresh } = useChatMessages();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = (value: string) => {
    sendQuestion(value);
    setInput("");
  };

  // Auto-send a question queued via openWithQuestion (FAQ items, result cards).
  useEffect(() => {
    if (isOpen && pendingQuestion) {
      sendQuestion(pendingQuestion);
      clearPendingQuestion();
    }
  }, [isOpen, pendingQuestion, sendQuestion, clearPendingQuestion]);

  // Keep the latest message in view.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label={`${APIS_NAME} — bantuan berbasis FAQ`}
      className="fixed bottom-24 right-4 z-50 flex h-[min(560px,calc(100vh-8rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-hairlineDivider bg-offWhiteSection shadow-panel animate-slide-up sm:right-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-navyCore px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <ApisAvatar size="md" />
          <div className="leading-tight">
            <p className="max-w-[240px] text-xs font-bold leading-snug sm:text-sm">
              {APIS_NAME}
            </p>
            <p className="text-[11px] text-white/70">Jawaban berdasarkan FAQ</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={reset}
            aria-label="Atur ulang percakapan"
            title="Atur ulang percakapan"
            className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={close}
            aria-label={`Tutup ${APIS_NAME}`}
            className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="chat-scroll flex-1 space-y-4 overflow-y-auto px-3.5 py-4"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onSelectQuestion={handleSend}
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
        <label htmlFor="asisten-input" className="sr-only">
          Tulis pertanyaan Anda
        </label>
        <input
          id="asisten-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pertanyaan Anda..."
          className="min-w-0 flex-1 rounded-full border border-hairlineDivider px-4 py-2 text-sm text-headlineBlack placeholder:text-captionGray focus-visible:border-navyCore"
        />
        <button
          type="submit"
          aria-label="Kirim pertanyaan"
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navyCore text-white transition-colors hover:bg-navyDeep disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
