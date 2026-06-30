"use client";

import type { StructuredApisAnswer } from "@/types/faqBloom";
import type { RelatedCTA } from "@/types/faq";
import type { AuthorityStructuredAnswer } from "@/lib/apisRouting";
import type { AuthorityAction } from "@/data/authorityRouting";
import type { ApisAnswerSource } from "@/lib/apisRouting";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FAQAnswerCardProps = {
  content?: string;
  structured?: StructuredApisAnswer;
  structuredAnswer?: StructuredApisAnswer;
  authorityAnswer?: AuthorityStructuredAnswer;
  answerSource?: ApisAnswerSource;
  suggestedActions?: AuthorityAction[];
  source?: string;
  reference?: string;
  cta?: RelatedCTA;
};

function sourceLabel(answerSource?: ApisAnswerSource): string {
  switch (answerSource) {
    case "authority":
      return "Arahan berdasarkan klasifikasi kewenangan";
    case "mixed":
      return "Jawaban FAQ + arahan kewenangan";
    case "faq":
      return "Jawaban berdasarkan FAQ";
    default:
      return "Jawaban berdasarkan FAQ";
  }
}

function AuthoritySections({ answer }: { answer: AuthorityStructuredAnswer }) {
  const sections = [
    { title: "Ringkasan", content: answer.ringkasan },
    { title: "Kewenangan yang kemungkinan relevan", content: answer.kewenangan },
    { title: "Mengapa", content: answer.mengapa },
    { title: "Langkah awal yang dapat dilakukan", content: answer.langkah },
    { title: "Catatan", content: answer.catatan },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="text-xs font-semibold uppercase tracking-wide text-navyCore">
            {section.title}
          </p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">
            {section.content}
          </p>
        </div>
      ))}
    </div>
  );
}

function FaqSections({ answer }: { answer: StructuredApisAnswer }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navyCore">
          Jawaban singkat
        </p>
        <p className="mt-1 text-sm">{answer.jawabanSingkat}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navyCore">
          Penjelasan
        </p>
        <p className="mt-1 whitespace-pre-line text-sm">{answer.penjelasan}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navyCore">
          Langkah yang dapat dilakukan
        </p>
        <p className="mt-1 whitespace-pre-line text-sm">{answer.langkah}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navyCore">
          Dasar pengetahuan
        </p>
        <p className="mt-1 whitespace-pre-line text-sm text-bodyTextGray">
          {answer.dasarPengetahuan}
        </p>
      </div>
    </div>
  );
}

export default function FAQAnswerCard({
  content,
  structured,
  structuredAnswer,
  authorityAnswer,
  answerSource,
  suggestedActions,
  source,
  reference,
  cta,
}: FAQAnswerCardProps) {
  const faqAnswer = structured ?? structuredAnswer;
  const label = sourceLabel(answerSource);

  if (authorityAnswer || faqAnswer) {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-headlineBlack">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-captionGray">
          {label}
        </p>

        {authorityAnswer ? <AuthoritySections answer={authorityAnswer} /> : null}

        {authorityAnswer && faqAnswer ? (
          <div className="border-t border-hairlineDivider pt-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-captionGray">
              Jawaban berdasarkan FAQ
            </p>
            <FaqSections answer={faqAnswer} />
          </div>
        ) : faqAnswer ? (
          <FaqSections answer={faqAnswer} />
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

        <div className="flex flex-wrap gap-2 border-t border-hairlineDivider pt-3">
          {suggestedActions?.map((action) => (
            <Link
              key={action.label}
              href={action.route}
              className={cn(
                "inline-flex items-center rounded-subtle px-3 py-1.5 text-xs font-semibold transition-colors",
                action.type === "primary"
                  ? "bg-navyCore text-white hover:bg-navyDeep"
                  : "border border-navyCore bg-white text-navyCore hover:bg-offWhiteSection"
              )}
            >
              {action.label}
            </Link>
          ))}
          {!suggestedActions?.length ? (
            <>
              <Link
                href="/faq"
                className="inline-flex items-center rounded-subtle border border-navyCore bg-white px-3 py-1.5 text-xs font-semibold text-navyCore hover:bg-offWhiteSection"
              >
                Buka FAQ
              </Link>
              <Link
                href="/formulir-panduan-pengaduan"
                className="inline-flex items-center rounded-subtle bg-navyCore px-3 py-1.5 text-xs font-semibold text-white hover:bg-navyDeep"
              >
                Formulir Panduan Pengaduan
              </Link>
            </>
          ) : null}
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
          <span className="font-semibold text-bodyTextGray">Rujukan:</span> {rujukan}
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
