"use client";

import { useMemo, useState } from "react";
import { ChevronDown, MessageCircle, Search, ExternalLink } from "lucide-react";
import { FAQ_FOCUS_FILTERS, FAQ_ITEMS, focusLabel } from "@/data/faq";
import { FRAUD_DEFINITION, mentionsFraud } from "@/data/glossary";
import { APIS_ASK_LABEL, APIS_NAME } from "@/data/apis";
import { searchFaq, getRelatedCTA } from "@/lib/faqSearch";
import { captureInteraction } from "@/lib/interactionCapture";
import { cn } from "@/lib/utils";
import { useChatbot } from "@/components/chatbot/ChatbotProvider";
import type { FAQItem } from "@/types/faq";

type FAQSectionProps = {
  // Initial query, typically forwarded from the homepage search bar.
  initialQuery?: string;
};

function FocusBadge({ focus }: { focus: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-navyCore/10 px-2.5 py-0.5 text-[11px] font-semibold text-navyCore">
      {focusLabel(focus)}
    </span>
  );
}

export default function FAQSection({ initialQuery = "" }: FAQSectionProps) {
  const [query, setQuery] = useState(initialQuery);
  const [focus, setFocus] = useState<string>("Semua");
  const [openId, setOpenId] = useState<string | null>(null);
  const { openWithQuestion } = useChatbot();

  const handleToggle = (item: FAQItem) => {
    const willOpen = openId !== item.id;
    setOpenId(willOpen ? item.id : null);
    if (willOpen) {
      // Capture a privacy-safe interaction record for admin monitoring.
      captureInteraction({
        channel: "FAQ",
        category: focusLabel(item.focus),
        query: item.question,
        resultRecommendation: "Membaca FAQ",
      });
    }
  };

  const filteredItems = useMemo<FAQItem[]>(() => {
    // Use fuzzy search when there is a query, otherwise the full ordered list.
    const base = query.trim() ? searchFaq(query) : FAQ_ITEMS;
    return base.filter(
      (item) => focus === "Semua" || item.focus === focus
    );
  }, [query, focus]);

  return (
    <section id="faq" className="bg-white py-14 sm:py-16">
      <div className="container-bi">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-headlineBlack sm:text-[28px]">
            Cari Jawaban di FAQ
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-bodyTextGray">
            Temukan jawaban atas pertanyaan umum terkait pengaduan Konsumen,
            batas waktu, dokumen, proses penanganan, dan kanal tindak lanjut yang
            sesuai.
          </p>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center gap-2 rounded-subtle border border-hairlineDivider bg-white px-3 py-2 shadow-sm">
          <Search
            className="h-5 w-5 shrink-0 text-captionGray"
            aria-hidden="true"
          />
          <label htmlFor="faq-search" className="sr-only">
            Cari FAQ
          </label>
          <input
            id="faq-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari FAQ... contoh: batas waktu, dokumen, fasilitasi, kerugian"
            className="w-full bg-transparent py-1.5 text-sm text-headlineBlack placeholder:text-captionGray focus:outline-none"
          />
        </div>

        {/* Category (focus) filter only — no source filter */}
        <div className="mt-4">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-captionGray">
            Kategori
          </span>
          <div className="flex flex-wrap gap-2">
            {FAQ_FOCUS_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFocus(option.value)}
                aria-pressed={focus === option.value}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  focus === option.value
                    ? "border-navyCore bg-navyCore text-white"
                    : "border-hairlineDivider bg-white text-bodyTextGray hover:border-navyCore"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="mt-5 text-xs text-captionGray">
          Menampilkan {filteredItems.length} dari {FAQ_ITEMS.length} pertanyaan.
        </p>

        {/* Accordion */}
        <div className="mt-3 divide-y divide-hairlineDivider border-y border-hairlineDivider">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-bodyTextGray">
                Tidak ada FAQ yang cocok. Coba kata kunci lain atau tanyakan
                kepada {APIS_NAME}.
              </p>
              {query.trim() ? (
                <button
                  type="button"
                  onClick={() => openWithQuestion(query)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-subtle bg-navyCore px-4 py-2 text-xs font-semibold text-white hover:bg-navyDeep"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {APIS_ASK_LABEL}
                </button>
              ) : null}
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = openId === item.id;
              const cta = getRelatedCTA(item);
              return (
                <div key={item.id}>
                  <h2>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      id={`faq-button-${item.id}`}
                      onClick={() => handleToggle(item)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-headlineBlack sm:text-base">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-navyCore transition-transform",
                          isOpen && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </h2>

                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-button-${item.id}`}
                    hidden={!isOpen}
                    className="pb-5"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <FocusBadge focus={item.focus} />
                      {item.reference ? (
                        <span className="text-[11px] text-captionGray">
                          {item.reference}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm leading-relaxed text-bodyTextGray">
                      {item.answer}
                    </p>

                    {mentionsFraud(item.question, item.answer) ? (
                      <p className="mt-3 rounded-lg border border-hairlineDivider bg-offWhiteSection p-3 text-xs leading-relaxed text-bodyTextGray">
                        <span className="font-semibold text-headlineBlack">
                          Definisi:
                        </span>{" "}
                        {FRAUD_DEFINITION}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openWithQuestion(item.question)}
                        className="inline-flex items-center gap-1.5 rounded-subtle border border-navyCore px-3 py-1.5 text-xs font-semibold text-navyCore transition-colors hover:bg-offWhiteSection"
                      >
                        <MessageCircle
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        {APIS_ASK_LABEL}
                      </button>
                      {cta ? (
                        <a
                          href={cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-subtle bg-navyCore px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navyDeep"
                        >
                          {cta.label}
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
