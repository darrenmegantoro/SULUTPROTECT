"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";

import { SITE_ASSETS } from "@/data/siteAssets";

const HERO_BACKGROUND_STYLE: React.CSSProperties = {
  backgroundImage: `linear-gradient(rgba(19, 41, 79, 0.76), rgba(19, 41, 79, 0.76)), url('${SITE_ASSETS.heroBackground}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-navyCore text-white"
      style={HERO_BACKGROUND_STYLE}
    >
      <div className="container-bi relative py-16 sm:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
            Mulai dari Formulir Panduan Pengaduan
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Bingung harus mulai dari mana? Temukan panduan pengaduan yang tepat.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            Jawab beberapa pertanyaan untuk mengetahui apakah pengaduan dapat
            dilanjutkan ke Bank Indonesia, perlu disampaikan terlebih dahulu
            kepada Penyelenggara, atau lebih tepat diarahkan ke lembaga lain.
          </p>

          <Link
            href="/formulir-panduan-pengaduan"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-subtle bg-white px-6 py-3 text-sm font-semibold text-navyCore transition-colors hover:bg-offWhiteSection sm:w-auto"
          >
            Mulai Formulir Panduan Pengaduan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
