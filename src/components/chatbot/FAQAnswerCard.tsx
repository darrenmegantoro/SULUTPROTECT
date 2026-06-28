"use client";

import { ExternalLink } from "lucide-react";
import type { RelatedCTA } from "@/types/faq";

type FAQAnswerCardProps = {
  content: string;
  source?: string;
  reference?: string;
  cta?: RelatedCTA;
};

// Renders an assistant answer using the section 18 response format:
// [Answer] / Rujukan: [Source], [Reference] / CTA.
export default function FAQAnswerCard({
  content,
  source,
  reference,
  cta,
}: FAQAnswerCardProps) {
  const rujukan = [source, reference].filter(Boolean).join(", ");

  return (
    <div className="space-y-3 text-sm leading-relaxed text-headlineBlack">
      <p className="whitespace-pre-line">{content}</p>

      {rujukan ? (
        <p className="text-xs text-captionGray">
          <span className="font-semibold text-bodyTextGray">Rujukan:</span>{" "}
          {rujukan}
        </p>
      ) : null}

      {cta ? (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-subtle bg-navyCore px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navyDeep"
        >
          {cta.label}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}
