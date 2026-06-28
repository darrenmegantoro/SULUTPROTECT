"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

// Hero focuses entirely on FAQ. The background uses an institutional photo
// (place it at /public/images/hero-background.jpg) with a navy overlay so the
// white text stays readable; if the image is missing, the navy overlay still
// provides a solid, on-brand background.
const HERO_BACKGROUND_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(19, 41, 79, 0.76), rgba(19, 41, 79, 0.76)), url('/images/hero-background.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    // Send the user to the FAQ page with the query applied.
    router.push(q ? `/faq?q=${encodeURIComponent(q)}` : "/faq");
  };

  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-navyCore text-white"
      style={HERO_BACKGROUND_STYLE}
    >
      <div className="container-bi relative py-16 sm:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
            Mulai dari FAQ
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Bingung harus mulai dari mana? Temukan panduan pengaduan yang tepat.
          </h1>

          {/* FAQ search bar */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 rounded-xl bg-white p-2 shadow-card sm:flex sm:items-center sm:gap-2"
          >
            <label htmlFor="hero-search" className="sr-only">
              Cari di FAQ
            </label>
            <div className="flex flex-1 items-center gap-2 px-2">
              <Search
                className="h-5 w-5 shrink-0 text-captionGray"
                aria-hidden="true"
              />
              <input
                id="hero-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tulis pertanyaan Anda di sini..."
                className="w-full bg-transparent py-2.5 text-sm text-headlineBlack placeholder:text-captionGray focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-subtle bg-navyCore px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navyDeep sm:mt-0 sm:w-auto"
            >
              Cari di FAQ
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
