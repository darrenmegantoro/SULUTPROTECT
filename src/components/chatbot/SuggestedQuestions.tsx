"use client";

import { cn } from "@/lib/utils";

type SuggestedQuestionsProps = {
  questions: string[];
  onSelect: (question: string) => void;
  title?: string;
  className?: string;
};

// Renders a wrapped list of clickable question chips. Reused for both the
// welcome suggestions and the low-confidence clarification chips.
export default function SuggestedQuestions({
  questions,
  onSelect,
  title,
  className,
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {title ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-captionGray">
          {title}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {questions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="rounded-full border border-navyLight/40 bg-white px-3 py-1.5 text-left text-xs font-medium text-navyCore transition-colors hover:border-navyCore hover:bg-offWhiteSection"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
