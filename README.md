# SULUT PROTECT

**Systemic Upgrade for Literacy & Unified Tracking: Process Transformation & Enhanced Consumer Triage**

Prototipe portal layanan publik bergaya Bank Indonesia untuk **edukasi dan triase awal pengaduan Konsumen**. Seluruh konten antarmuka menggunakan Bahasa Indonesia; komentar dan struktur kode menggunakan Bahasa Inggris.

Situs ini mendorong Konsumen untuk **membaca FAQ terlebih dahulu**, lalu menggunakan **Guided Form** untuk mengetahui kanal tindak lanjut yang sesuai (BI Bicara, Penyelenggara, LAPS SJK, atau otoritas lain), serta menyediakan chatbot **Asisten** berbasis FAQ.

> Informasi pada prototipe ini bersifat edukatif dan tidak memberikan nasihat hukum. Penanganan pengaduan tetap mengikuti penelaahan, kelengkapan dokumen, dan ketentuan yang berlaku.

Dasar acuan konten:

- PADG No. 20 Tahun 2023
- PADGI No. 19 Tahun 2024
- Ketentuan ASPI tentang penanganan transaksi transfer dana terindikasi fraud
- 63 item FAQ tertanam (`src/data/faq.ts`)

---

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS v3](https://tailwindcss.com/) (token desain navy/putih BI-style)
- [fuse.js](https://www.fusejs.io/) — fuzzy search untuk FAQ dan chatbot
- [lucide-react](https://lucide.dev/) — ikon

Tidak ada backend. Seluruh logika triase dan retrieval berjalan di sisi klien.

---

## Menjalankan Secara Lokal

Prasyarat: Node.js 18.18+ (disarankan 20+).

```bash
# 1. Masuk ke folder proyek
cd sulut-protect

# 2. Install dependencies
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Skrip lain:

```bash
npm run build   # build produksi
npm run start   # menjalankan hasil build
npm run lint    # menjalankan ESLint
```

> Catatan: prototipe ini dibuat dengan menuliskan berkas konfigurasi secara manual.
> `fuse.js` dan `lucide-react` sudah tercantum di `package.json`, sehingga cukup
> menjalankan `npm install` (tidak perlu instalasi terpisah).

---

## Struktur Proyek

```txt
src/
  app/
    layout.tsx           # Root layout, lang=id, ChatbotProvider + launcher global
    page.tsx             # Susunan section beranda (FAQ sebelum Guided Form)
    globals.css          # Base style + token
  components/
    Navbar.tsx           # Utility bar + navigasi (FAQ sebelum Guided Form) + CTA
    Hero.tsx             # Hero + search bar FAQ-first
    ServiceCards.tsx     # Dua kartu entry point (FAQ lebih dulu)
    ComplaintCategories.tsx
    FAQSection.tsx       # Search + filter fokus & sumber + accordion
    GuidedForm.tsx       # Wizard 8 langkah + logika percabangan
    ResultCard.tsx       # 11 kartu hasil (A-K) + helper Asisten
    Footer.tsx
    chatbot/
      ChatbotProvider.tsx  # Context (open, openWithQuestion, dll)
      ChatbotLauncher.tsx  # Tombol mengambang
      ChatbotPanel.tsx     # Panel chat + logika retrieval
      ChatMessage.tsx
      SuggestedQuestions.tsx
      FAQAnswerCard.tsx
  data/
    faq.ts               # 63 FAQ_ITEMS (single source of truth)
    guidedForm.ts        # Pertanyaan Q1-Q8 dan hasil A-K
    links.ts             # Tautan kanal eksternal
  lib/
    faqSearch.ts         # Fuse.js + logika confidence chatbot
    utils.ts             # cn, formatRupiah, tanggal, ringkasan jawaban
  types/
    faq.ts
    guidedForm.ts
```

---

## Cara Kerja Singkat

- **FAQ-first:** urutan navigasi, CTA hero, dan section beranda menempatkan FAQ sebelum Guided Form.
- **Pencarian FAQ:** search bar hero memprioritaskan hasil FAQ; bila tidak ada hasil, menawarkan bertanya ke Asisten atau lanjut Guided Form.
- **Guided Form:** satu pertanyaan per langkah, indikator "Langkah X dari 8", tombol Kembali & Atur ulang, menghasilkan salah satu dari 11 kartu hasil edukatif.
- **Chatbot Asisten:** retrieval berbasis `fuse.js` atas dataset FAQ. Jika skor terbaik `<= 0.35` menampilkan jawaban + rujukan + CTA; jika tidak, menampilkan hingga 3 pertanyaan klarifikasi; jika tetap tidak relevan, menampilkan fallback. Chatbot tidak menghasilkan interpretasi di luar FAQ.
- **Integrasi:** tombol "Tanya Asisten" pada item FAQ dan kartu hasil membuka Asisten dengan pertanyaan yang sudah terisi.

---

## Keterbatasan Prototipe

- **Bukan nasihat hukum.** Hasil bersifat edukatif dan triase awal saja.
- **Tanpa backend / tanpa pengiriman nyata.** Tidak ada penyimpanan data atau submit pengaduan.
- **Estimasi batas waktu.** 60 hari kerja didekati sebagai ~84 hari kalender (tanpa kalkulator hari kerja/hari libur).
- **Chatbot retrieval-only.** Jawaban diambil apa adanya dari FAQ (dengan peringkasan tampilan), tidak ada generasi bebas.
- **Tautan eksternal bersifat placeholder** dan mengarah ke laman resmi terkait; semua dibuka di tab baru.
- **Daftar Penyelenggara/otoritas** tidak diverifikasi secara real-time; hanya rujukan edukatif.
