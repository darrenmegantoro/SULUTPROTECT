import Link from "next/link";
import { ArrowRight, HelpCircle, MessageCircle } from "lucide-react";
import { APIS_ASK_LABEL, APIS_NAME } from "@/data/apis";

const HELP_CARDS = [
  {
    title: "FAQ (Pertanyaan Umum)",
    description:
      "Temukan jawaban cepat dan komprehensif untuk berbagai pertanyaan mengenai penanganan pengaduan konsumen Bank Indonesia.",
    cta: "Buka FAQ",
    href: "/faq",
    icon: HelpCircle,
  },
  {
    title: APIS_NAME,
    description:
      "Dapatkan panduan dan bantuan instan 24/7 melalui asisten virtual cerdas kami yang siap melayani setiap saat.",
    cta: APIS_ASK_LABEL,
    href: "/asisten",
    icon: MessageCircle,
  },
] as const;

export default function ServiceCards() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="container-bi">
        <h2 className="mb-6 text-2xl font-bold text-headlineBlack sm:text-[26px]">
          Kunjungi Pusat Bantuan Kami
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {HELP_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex h-full flex-col rounded-xl border border-hairlineDivider bg-white p-7 shadow-card sm:p-8"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-navyCore/30 text-navyCore">
                <card.icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-headlineBlack sm:text-2xl">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-bodyTextGray">
                {card.description}
              </p>
              <Link
                href={card.href}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-subtle bg-navyCore px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navyDeep"
              >
                {card.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
