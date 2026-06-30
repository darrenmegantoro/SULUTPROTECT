"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Info,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import type {
  DescriptionLink,
  GuidedResult,
  ResultBadgeTone,
  ResultCTA,
} from "@/types/guidedForm";
import { cn } from "@/lib/utils";
import { FRAUD_DEFINITION, mentionsFraud } from "@/data/glossary";
import { useChatbot } from "@/components/chatbot/ChatbotProvider";
import { APIS_ASK_LABEL, APIS_NAME } from "@/data/apis";

type ResultCardProps = {
  result: GuidedResult;
};

const ACCENT_BAR: Record<ResultBadgeTone, string> = {
  positive: "bg-emerald-500",
  warning: "bg-amber-500",
  redirect: "bg-navyCore",
  neutral: "bg-captionGray",
};

function renderLinkedText(text: string, links?: DescriptionLink[]) {
  if (!links?.length) return text;

  let nodes: ReactNode[] = [text];
  for (const link of links) {
    const idx = text.indexOf(link.phrase);
    if (idx === -1) continue;
    const before = text.slice(0, idx);
    const after = text.slice(idx + link.phrase.length);
    return (
      <>
        {before}
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-linkBlue hover:underline"
        >
          {link.phrase}
        </a>
        {after}
      </>
    );
  }
  return text;
}

function renderChecklistLabel(label: string, inlineLink?: DescriptionLink) {
  if (!inlineLink) return label;
  const idx = label.indexOf(inlineLink.phrase);
  if (idx === -1) return label;
  return (
    <>
      {label.slice(0, idx)}
      <a
        href={inlineLink.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-linkBlue hover:underline"
      >
        {inlineLink.phrase}
      </a>
      {label.slice(idx + inlineLink.phrase.length)}
    </>
  );
}

function ctaClass(cta: ResultCTA): string {
  const isSecondary =
    cta.variant === "secondary" || (!cta.variant && Boolean(cta.to));
  if (isSecondary) {
    return "inline-flex items-center gap-1.5 rounded-subtle border border-navyCore bg-white px-4 py-2 text-sm font-semibold text-navyCore transition-colors hover:bg-offWhiteSection";
  }
  return "inline-flex items-center gap-1.5 rounded-subtle bg-navyCore px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navyDeep";
}

export default function ResultCard({ result }: ResultCardProps) {
  const { openWithQuestion } = useChatbot();

  return (
    <div className="overflow-hidden rounded-xl border border-hairlineDivider bg-white shadow-card animate-fade-in">
      <div className={cn("h-1.5 w-full", ACCENT_BAR[result.badgeTone])} />

      <div className="p-6 sm:p-7">
        <h3 className="text-xl font-bold text-headlineBlack">{result.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-bodyTextGray">
          {renderLinkedText(result.description, result.descriptionLinks)}
        </p>

        {mentionsFraud(result.title, result.description) ? (
          <p className="mt-3 rounded-lg border border-hairlineDivider bg-offWhiteSection p-3 text-xs leading-relaxed text-bodyTextGray">
            <span className="font-semibold text-headlineBlack">Definisi:</span>{" "}
            {FRAUD_DEFINITION}
          </p>
        ) : null}

        {result.infoBadge ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-navyCore/5 p-3 text-sm text-navyCore">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{result.infoBadge}</span>
          </div>
        ) : null}

        {result.referralList ? (
          <ul className="mt-4 space-y-2">
            {result.referralList.map((ref) => (
              <li key={ref.label} className="flex gap-2 text-sm text-bodyTextGray">
                <span className="font-semibold text-headlineBlack">{ref.label}</span>
                <span>— {ref.description}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {result.checklist ? (
          <div className="mt-5">
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
              Perlu dokumen
            </p>
            <ul className="space-y-2">
              {result.checklist.map((doc) => (
                <li
                  key={doc.label}
                  className="flex flex-wrap items-start gap-2 text-sm text-bodyTextGray"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-navyCore"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    {renderChecklistLabel(doc.label, doc.inlineLink)}
                  </span>
                  {doc.cta ? (
                    <a
                      href={doc.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-linkBlue hover:underline"
                    >
                      {doc.cta.label}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {result.note ? (
          <p className="mt-4 rounded-lg border border-hairlineDivider bg-offWhiteSection p-3 text-xs leading-relaxed text-bodyTextGray">
            {result.note}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {result.ctas.map((cta) => {
            const className = ctaClass(cta);
            if (cta.href) {
              return (
                <a
                  key={cta.label}
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {cta.label}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              );
            }
            if (cta.to) {
              return (
                <Link key={cta.label} href={cta.to} className={className}>
                  {cta.label}
                </Link>
              );
            }
            if (cta.askAsisten) {
              return (
                <button
                  key={cta.label}
                  type="button"
                  onClick={() => openWithQuestion(result.askQuestion)}
                  className={className}
                >
                  {cta.label}
                </button>
              );
            }
            return null;
          })}
        </div>

        <div className="mt-6 rounded-lg border border-hairlineDivider bg-offWhiteSection p-4">
          <p className="text-sm font-bold text-headlineBlack">Masih butuh penjelasan?</p>
          <p className="mt-1 text-sm text-bodyTextGray">
            Tanyakan kepada {APIS_NAME} atau baca FAQ terkait sebelum melanjutkan.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openWithQuestion(result.askQuestion)}
              className="inline-flex items-center gap-1.5 rounded-subtle bg-navyCore px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navyDeep"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {APIS_ASK_LABEL}
            </button>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 rounded-subtle border border-navyCore bg-white px-3 py-1.5 text-xs font-semibold text-navyCore transition-colors hover:bg-offWhiteSection"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Buka FAQ Terkait
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
