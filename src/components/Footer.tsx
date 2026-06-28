import { ExternalLink } from "lucide-react";

// Embeddable map (no API key needed) centered on the KPwBI Sulawesi Utara
// office. The "Buka Peta" button opens the exact Google Maps place listing.
const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Bank%20Indonesia%20Manado&output=embed";
const MAP_PLACE_URL =
  "https://www.google.com/maps?cid=2073431114117715079&hl=id&gl=ID";

export default function Footer() {
  return (
    <footer className="border-t border-hairlineDivider bg-white">
      {/* Contact + Map section */}
      <div className="container-bi py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Peta (map) — left */}
          <div>
            <h2 className="text-lg font-bold text-headlineBlack">Peta</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-hairlineDivider">
              <iframe
                title="Peta Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Utara"
                src={MAP_EMBED_SRC}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={MAP_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-subtle border border-navyCore px-4 py-2 text-sm font-semibold text-navyCore transition-colors hover:bg-offWhiteSection"
            >
              Buka Peta
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Kontak — right */}
          <div>
            <h2 className="text-lg font-bold text-headlineBlack">Kontak</h2>
            <div className="mt-3 space-y-1 text-sm leading-relaxed text-bodyTextGray">
              <p className="font-semibold text-headlineBlack">
                Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Utara
              </p>
              <p>Jl. 17 Agustus No. 56</p>
              <p>Manado, 95117</p>
              <p>
                <span className="font-semibold text-headlineBlack">Telp:</span>{" "}
                (0431) 866933
              </p>
              <p>
                <span className="font-semibold text-headlineBlack">Fax:</span>{" "}
                (0431) 868102
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-hairlineDivider bg-navyDeep">
        <div className="container-bi py-4">
          <p className="text-center text-xs text-white/80">
            &copy; 2026 SULUT PROTECT. Kantor Perwakilan Bank Indonesia Provinsi
            Sulawesi Utara.
          </p>
        </div>
      </div>
    </footer>
  );
}
