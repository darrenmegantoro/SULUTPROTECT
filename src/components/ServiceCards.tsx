import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";

// "Langkah selanjutnya" now focuses solely on the Formulir Panduan Pengaduan.
export default function ServiceCards() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="container-bi">
        <h2 className="mb-6 text-2xl font-bold text-headlineBlack sm:text-[26px]">
          Langkah selanjutnya
        </h2>
        <div className="rounded-xl border border-hairlineDivider bg-white p-7 shadow-card sm:p-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-navyCore/30 text-navyCore">
            <ClipboardList className="h-7 w-7" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-2xl font-bold text-headlineBlack">
            Formulir Panduan Pengaduan
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bodyTextGray">
            Jawab beberapa pertanyaan untuk mengetahui apakah pengaduan dapat
            dilanjutkan ke Bank Indonesia, perlu disampaikan terlebih dahulu
            kepada Penyelenggara, atau lebih tepat diarahkan ke lembaga lain.
          </p>
          <Link
            href="/formulir-panduan-pengaduan"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-subtle bg-navyCore px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navyDeep"
          >
            Mulai Formulir Panduan Pengaduan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
