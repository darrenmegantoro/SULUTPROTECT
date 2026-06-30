"use client";

import type { StructuredApisAnswer } from "@/types/faqBloom";
import type { RelatedCTA } from "@/types/faq";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type FAQAnswerCardProps = {
  content?: string;
  structured?: StructuredApisAnswer;
  structuredAnswer?: StructuredApisAnswer;
  source?: string;
  reference?: string;
  cta?: RelatedCTA;
};

export default function FAQAnswerCard({
  content,
  structured,
  structuredAnswer,
  source,
  reference,
  cta,
}: FAQAnswerCardProps) {
  const answer = structured ?? structuredAnswer;
  if (answer) {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-headlineBlack">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navyCore">
            Jawaban singkat
          </p>
          <p className="mt-1">{answer.jawabanSingkat}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navyCore">
            Penjelasan
          </p>
          <p className="mt-1 whitespace-pre-line">{answer.penjelasan}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navyCore">
            Langkah yang dapat dilakukan
          </p>
          <p className="mt-1 whitespace-pre-line">{answer.langkah}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navyCore">
            Dasar pengetahuan
          </p>
          <p className="mt-1 whitespace-pre-line text-bodyTextGray">
            {answer.dasarPengetahuan}
          </p>
        </div>

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

        <div className="flex flex-wrap gap-2 border-t border-hairlineDivider pt-3">
          <Link
            href="/faq"
            className="inline-flex items-center rounded-subtle border border-navyCore px-3 py-1.5 text-xs font-semibold text-navyCore hover:bg-offWhiteSection"
          >
            Buka FAQ
          </Link>
          <Link
            href="/formulir-panduan-pengaduan"
            className="inline-flex items-center rounded-subtle bg-navyCore px-3 py-1.5 text-xs font-semibold text-white hover:bg-navyDeep"
          >
            Formulir Panduan Pengaduan
          </Link>
        </div>
      </div>
    );
  }

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
