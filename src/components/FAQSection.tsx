"use client";

import { useMemo, useState } from "react";
import { ChevronDown, MessageCircle, Search, ExternalLink } from "lucide-react";
import { FAQ_KATEGORI_FILTERS, faqBloomItems } from "@/data/faq";
import { FRAUD_DEFINITION, mentionsFraud } from "@/data/glossary";
import { APIS_ASK_LABEL, APIS_NAME } from "@/data/apis";
import { getRelatedCTA, searchFaqBloom } from "@/lib/faqSearch";
import { captureInteraction } from "@/lib/interactionCapture";
import { cn } from "@/lib/utils";
import { useChatbot } from "@/components/chatbot/ChatbotProvider";
import type { FaqBloomItem } from "@/types/faqBloom";

type FAQSectionProps = {
  initialQuery?: string;
};

function CategoryBadge({ kategori }: { kategori: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-navyCore/10 px-2.5 py-0.5 text-[11px] font-semibold text-navyCore">
      {kategori}
    </span>
  );
}

export default function FAQSection({ initialQuery = "" }: FAQSectionProps) {
  const [query, setQuery] = useState(initialQuery);
  const [kategori, setKategori] = useState("Semua");
  const [openId, setOpenId] = useState<number | null>(null);
  const { openWithQuestion } = useChatbot();

  const handleToggle = (item: FaqBloomItem) => {
    const willOpen = openId !== item.id;
    setOpenId(willOpen ? item.id : null);
    if (willOpen) {
      captureInteraction({
        channel: "FAQ",
        category: item.kategori,
        query: item.pertanyaan,
        matchedFaqId: String(item.id),
        matchedFaqQuestion: item.pertanyaan,
        recommendation: "Membaca FAQ",
        isCompleted: true,
      });
    }
  };

  const filteredItems = useMemo<FaqBloomItem[]>(() => {
    const base = query.trim() ? searchFaqBloom(query) : faqBloomItems;
    return base.filter(
      (item) => kategori === "Semua" || item.kategori === kategori
    );
  }, [query, kategori]);

  return (
    <section id="faq" className="bg-white py-14 sm:py-16">
      <div className="container-bi">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-headlineBlack sm:text-[28px]">
            Cari Jawaban di FAQ
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-bodyTextGray">
            Temukan jawaban atas pertanyaan umum terkait pengaduan Konsumen,
            batas waktu, dokumen, proses penanganan, dan kanal tindak lanjut
            yang sesuai.
          </p>
        </div>

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
            placeholder="Cari FAQ... pertanyaan, jawaban, atau kategori"
            className="w-full bg-transparent py-1.5 text-sm text-headlineBlack placeholder:text-captionGray focus:outline-none"
          />
        </div>

        <div className="mt-4">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-captionGray">
            Kategori
          </span>
          <div className="flex flex-wrap gap-2">
            {FAQ_KATEGORI_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setKategori(option.value)}
                aria-pressed={kategori === option.value}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  kategori === option.value
                    ? "border-navyCore bg-navyCore text-white"
                    : "border-hairlineDivider bg-white text-bodyTextGray hover:border-navyCore"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-xs text-captionGray">
          Menampilkan {filteredItems.length} dari {faqBloomItems.length}{" "}
          pertanyaan.
        </p>

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
                        {item.pertanyaan}
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
                    <div className="mb-3">
                      <CategoryBadge kategori={item.kategori} />
                    </div>

                    <p className="whitespace-pre-line text-sm leading-relaxed text-bodyTextGray">
                      {item.jawaban}
                    </p>

                    {mentionsFraud(item.pertanyaan, item.jawaban) ? (
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
                        onClick={() => openWithQuestion(item.pertanyaan)}
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
