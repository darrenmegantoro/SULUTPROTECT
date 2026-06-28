"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ChatbotContextValue = {
  isOpen: boolean;
  // A question queued to be auto-sent when the panel opens.
  pendingQuestion: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  // Open the panel and auto-send the given question (used by FAQ items and
  // Guided Form result cards via their "Tanya Asisten" buttons).
  openWithQuestion: (question: string) => void;
  clearPendingQuestion: () => void;
};

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const openWithQuestion = useCallback((question: string) => {
    setPendingQuestion(question);
    setIsOpen(true);
  }, []);

  const clearPendingQuestion = useCallback(() => setPendingQuestion(null), []);

  const value = useMemo<ChatbotContextValue>(
    () => ({
      isOpen,
      pendingQuestion,
      open,
      close,
      toggle,
      openWithQuestion,
      clearPendingQuestion,
    }),
    [isOpen, pendingQuestion, open, close, toggle, openWithQuestion, clearPendingQuestion]
  );

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
}

export function useChatbot(): ChatbotContextValue {
  const ctx = useContext(ChatbotContext);
  if (!ctx) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return ctx;
}
