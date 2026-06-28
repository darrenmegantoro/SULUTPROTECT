import type { Metadata } from "next";
import FAQSection from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "FAQ — SULUT PROTECT",
  description:
    "Temukan jawaban atas pertanyaan umum terkait pengaduan Konsumen Bank Indonesia.",
};

type FAQPageProps = {
  // The homepage search bar forwards its query as ?q=...
  searchParams: { q?: string | string[] };
};

export default function FAQPage({ searchParams }: FAQPageProps) {
  const raw = searchParams?.q;
  const initialQuery = Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  return <FAQSection initialQuery={initialQuery} />;
}
