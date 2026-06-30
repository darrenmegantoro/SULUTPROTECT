import type {
  ChecklistItem,
  GuidedQuestion,
  GuidedResult,
  ResultKey,
} from "@/types/guidedForm";
import { EXTERNAL_LINKS } from "@/data/links";

export const BI_DOCUMENT_CHECKLIST: ChecklistItem[] = [
  { label: "Fotokopi bukti identitas diri" },
  {
    label:
      "Fotokopi surat hasil penyelesaian pengaduan yang diberikan Penyelenggara kepada Konsumen",
  },
  { label: "Fotokopi bukti transaksi" },
  { label: "Fotokopi surat kuasa, dalam hal dikuasakan" },
  {
    label:
      "Surat pernyataan bermeterai cukup bahwa permasalahan yang diajukan merupakan masalah perdata yang tidak pernah diproses oleh pengadilan, lembaga atau badan penyelesaian sengketa, atau otoritas yang berwenang lainnya",
    cta: {
      label: "Surat Pernyataan",
      href: EXTERNAL_LINKS.suratPernyataan,
    },
  },
];

export const BIDANG_LABELS: Record<string, string> = {
  pjp: "Penyedia Jasa Pembayaran (PJP)",
  pjp_nonbank: "Penyedia Jasa Pembayaran (PJP) Non-Bank",
  layanan_uang: "Kegiatan Layanan Uang",
  kupva_bb:
    "Kegiatan Usaha Penukaran Valuta Asing Bukan Bank (KUPVA BB)",
};

export const LOSS_THRESHOLD_500M = 500_000_000;
export const LOSS_THRESHOLD_2_5B = 2_500_000_000;

export function getLossThresholdForBidang(bidang: string): number {
  if (bidang === "kupva_bb") return LOSS_THRESHOLD_2_5B;
  return LOSS_THRESHOLD_500M;
}

export function getLossThresholdHelper(bidang: string): string {
  if (bidang === "kupva_bb") {
    return "Untuk bidang yang Anda pilih, batas nilai kerugian finansial atau potensi kerugian finansial yang dapat diarahkan melalui mekanisme Bank Indonesia adalah paling banyak Rp2.500.000.000.";
  }
  return "Untuk bidang yang Anda pilih, batas nilai kerugian finansial atau potensi kerugian finansial yang dapat diarahkan melalui mekanisme Bank Indonesia adalah paling banyak Rp500.000.000.";
}

export const GUIDED_QUESTIONS: GuidedQuestion[] = [
  {
    id: "q1",
    step: 1,
    kind: "choice",
    question: "Apa jenis pengaduan yang ingin Anda sampaikan?",
    options: [
      {
        value: "ketidakpahaman",
        label: "Membutuhkan Penjelasan",
        description:
          "Pilih kategori ini jika Anda belum memahami produk, layanan, ketentuan, biaya, prosedur, atau mekanisme pengaduan.",
      },
      {
        value: "sengketa",
        label: "Pengaduan Terkait Sengketa dengan Lembaga Keuangan",
        description:
          "Pilih kategori ini jika Anda sudah menyampaikan pengaduan kepada Penyelenggara, tetapi belum terdapat kesepakatan.",
      },
      {
        value: "pelanggaran",
        label: "Pengaduan Terkait Adanya Pelanggaran Ketentuan",
        description:
          "Pilih kategori ini jika Anda menduga terdapat pelanggaran terhadap ketentuan Bank Indonesia oleh Penyelenggara.",
      },
      {
        value: "kerugian",
        label: "Pengaduan Terkait Adanya Kerugian Konsumen",
        description:
          "Pilih kategori ini jika Anda mengalami kerugian finansial atau potensi kerugian finansial yang berdampak langsung.",
      },
    ],
  },
  {
    id: "q2",
    step: 2,
    kind: "choice",
    question:
      "Apakah lembaga atau Penyelenggara terkait diawasi oleh Bank Indonesia?",
    options: [
      { value: "ya", label: "Ya" },
      { value: "tidak", label: "Tidak" },
      { value: "tidak_yakin", label: "Tidak yakin" },
    ],
  },
  {
    id: "q3",
    step: 3,
    kind: "choice",
    question: "Bidang Penyelenggara / Pelaku terkait",
    helper:
      "Pilih bidang Penyelenggara atau pelaku yang paling sesuai dengan pengaduan Anda. Pilihan ini digunakan untuk menentukan batas nilai kerugian finansial atau potensi kerugian finansial yang berlaku.",
    options: [
      { value: "pjp", label: BIDANG_LABELS.pjp },
      { value: "pjp_nonbank", label: BIDANG_LABELS.pjp_nonbank },
      { value: "layanan_uang", label: BIDANG_LABELS.layanan_uang },
      { value: "kupva_bb", label: BIDANG_LABELS.kupva_bb },
    ],
  },
  {
    id: "q4",
    step: 4,
    kind: "choice",
    question:
      "Apakah pengaduan sudah disampaikan terlebih dahulu kepada Penyelenggara?",
    options: [
      { value: "ya", label: "Ya" },
      { value: "tidak", label: "Tidak" },
    ],
  },
  {
    id: "q5",
    step: 5,
    kind: "date",
    question:
      "Kapan Anda menerima hasil penyelesaian tertulis dari Penyelenggara?",
    helper:
      "Batas pengajuan adalah 60 hari kerja sejak tanggal penyampaian hasil penyelesaian pengaduan secara tertulis dari Penyelenggara kepada Konsumen.",
  },
  {
    id: "q6",
    step: 6,
    kind: "choice",
    question: "Apakah pengaduan Anda merupakan masalah perdata?",
    options: [
      { value: "ya", label: "Ya" },
      { value: "tidak", label: "Tidak" },
      { value: "tidak_yakin", label: "Tidak yakin" },
    ],
  },
  {
    id: "q7",
    step: 7,
    kind: "choice",
    question:
      "Apakah permasalahan ini pernah diproses oleh pengadilan, lembaga penyelesaian sengketa, atau otoritas lain?",
    options: [
      { value: "ya", label: "Ya" },
      { value: "tidak", label: "Tidak" },
    ],
  },
  {
    id: "q8",
    step: 8,
    kind: "choice",
    question: "Apakah pengaduan sudah pernah difasilitasi oleh Bank Indonesia?",
    options: [
      { value: "ya", label: "Ya" },
      { value: "tidak", label: "Tidak" },
    ],
  },
  {
    id: "q9",
    step: 9,
    kind: "number",
    question:
      "Berapa nilai kerugian finansial atau potensi kerugian finansial yang Anda alami?",
    placeholder: "Contoh: 1500000",
  },
];

export const TOTAL_STEPS = GUIDED_QUESTIONS.length;

export const TIME_LIMIT_CALENDAR_DAYS = 84;

/** @deprecated Use getLossThresholdForBidang instead. */
export const LOSS_THRESHOLD = LOSS_THRESHOLD_500M;

export const GUIDED_RESULTS: Record<ResultKey, GuidedResult> = {
  A: {
    key: "A",
    statusBadge: "Dapat diarahkan ke BI Bicara",
    badgeTone: "positive",
    title: "Pengaduan Anda termasuk kategori Membutuhkan Penjelasan.",
    description:
      "Bank Indonesia dapat menindaklanjuti pengaduan dalam bentuk edukasi. Edukasi diberikan untuk membantu Konsumen memahami ketentuan Bank Indonesia, produk atau jasa dari Penyelenggara, persyaratan pengaduan, cakupan penanganan pengaduan, dan informasi lain yang relevan.",
    infoBadge:
      "Estimasi penyelesaian: paling lama 5 hari kerja sejak pengaduan diterima Bank Indonesia.",
    ctas: [
      { label: "Hubungi BI Bicara", href: EXTERNAL_LINKS.biBicara },
      { label: "Baca FAQ Membutuhkan Penjelasan", to: "/faq" },
    ],
    askQuestion:
      "Bagaimana Bank Indonesia menangani pengaduan yang membutuhkan penjelasan layanan?",
    relatedFocus: "Ketidakpahaman Konsumen",
  },
  B: {
    key: "B",
    statusBadge: "Di luar kewenangan BI",
    badgeTone: "redirect",
    title: "Pengaduan ini berada di luar kewenangan Bank Indonesia.",
    description:
      "Bank Indonesia menindaklanjuti pengaduan terhadap Penyelenggara yang diatur dan diawasi oleh Bank Indonesia. Jika lembaga atau pihak yang diadukan berada di luar kewenangan BI, pengaduan perlu disampaikan kepada otoritas atau lembaga yang sesuai dengan sektor permasalahannya.",
    ctas: [
      {
        label: "Cek Daftar Penyelenggara",
        href: EXTERNAL_LINKS.cekPenyelenggara,
      },
      { label: "Tanya BI Bicara", href: EXTERNAL_LINKS.biBicara },
    ],
    askQuestion: "Pengaduan apa saja yang dapat disampaikan kepada Bank Indonesia?",
    relatedFocus: "Ketidakpahaman Konsumen",
  },
  C: {
    key: "C",
    statusBadge: "Perlu pengecekan kewenangan",
    badgeTone: "neutral",
    title: "Cek dulu kewenangan lembaganya.",
    description:
      "Jika Anda belum yakin apakah lembaga tersebut diawasi Bank Indonesia, periksa daftar Penyelenggara yang diatur dan diawasi BI atau hubungi BI Bicara untuk memperoleh edukasi awal. Hal ini membantu memastikan pengaduan diarahkan ke kanal yang tepat sejak awal.",
    ctas: [
      { label: "Cek Daftar Penyelenggara", href: EXTERNAL_LINKS.cekPenyelenggara },
      { label: "Tanya BI Bicara", href: EXTERNAL_LINKS.biBicara },
    ],
    askQuestion: "Pengaduan apa saja yang dapat disampaikan kepada Bank Indonesia?",
    relatedFocus: "Ketidakpahaman Konsumen",
  },
  D: {
    key: "D",
    statusBadge: "Perlu disampaikan ke Penyelenggara",
    badgeTone: "warning",
    title: "Sampaikan pengaduan kepada Penyelenggara terlebih dahulu.",
    description:
      "Untuk pengaduan terkait sengketa atau kerugian finansial, Konsumen perlu menyampaikan pengaduan terlebih dahulu kepada Penyelenggara. Langkah ini memberi kesempatan kepada Penyelenggara untuk memeriksa permasalahan, memberikan penjelasan, dan menyampaikan hasil penyelesaian secara tertulis.",
    checklist: [
      { label: "Identitas diri" },
      { label: "Kronologis kejadian" },
      { label: "Bukti transaksi" },
      { label: "Bukti komunikasi dengan Penyelenggara" },
      { label: "Dokumen pendukung lainnya" },
    ],
    ctas: [{ label: "Baca FAQ Pengaduan ke Penyelenggara", to: "/faq" }],
    askQuestion: "Apakah harus mengadu ke Penyelenggara dulu sebelum ke Bank Indonesia?",
    relatedFocus: "Sengketa dengan Lembaga Keuangan",
  },
  E: {
    key: "E",
    statusBadge: "Batas 60 hari kerja",
    badgeTone: "warning",
    title: "Pengaduan melewati batas waktu pengajuan.",
    description:
      "Pengaduan terkait kerugian finansial atau potensi kerugian finansial diajukan kepada Bank Indonesia paling lama 60 hari kerja sejak tanggal penyampaian hasil penyelesaian pengaduan secara tertulis dari Penyelenggara kepada Konsumen. Jika sudah melewati batas waktu tersebut, pengaduan tidak memenuhi ketentuan batas waktu untuk diproses melalui mekanisme ini. Konsumen dapat membaca FAQ terkait batas waktu dan, apabila permasalahan merupakan sengketa sektor jasa keuangan yang memenuhi persyaratan, dapat mempertimbangkan penyelesaian melalui LAPS SJK sesuai ketentuan yang berlaku.",
    ctas: [
      { label: "Baca FAQ Batas Waktu", to: "/faq" },
      { label: "Lihat LAPS SJK", href: EXTERNAL_LINKS.lapsSjk },
    ],
    askQuestion: "Apa batas waktu pengaduan ke Bank Indonesia?",
    relatedFocus: "Kerugian Konsumen",
  },
  F: {
    key: "F",
    statusBadge: "Perlu berupa masalah perdata",
    badgeTone: "neutral",
    title: "Pengaduan kepada BI untuk kategori ini harus berupa masalah perdata.",
    description:
      "Untuk pengaduan kerugian finansial atau potensi kerugian finansial, permasalahan yang diajukan harus merupakan masalah perdata. Jika terdapat dugaan tindak pidana, penipuan, pemalsuan, atau kejahatan siber, Anda dapat menyampaikan laporan kepada aparat penegak hukum melalui kanal resmi yang tersedia.",
    ctas: [
      { label: "Lihat PolriSiber", href: EXTERNAL_LINKS.polriSiber },
      { label: "Baca FAQ Persyaratan Pengaduan", to: "/faq" },
    ],
    askQuestion: "Apa syarat pengaduan kerugian finansial ke Bank Indonesia?",
    relatedFocus: "Kerugian Konsumen",
  },
  G: {
    key: "G",
    statusBadge: "Perlu penelaahan awal",
    badgeTone: "neutral",
    title: "Belum yakin jenis permasalahannya?",
    description:
      "Siapkan kronologis kejadian dan dokumen pendukung. Bank Indonesia dapat melakukan penelaahan terhadap pengaduan yang disampaikan untuk menentukan bentuk penanganan yang sesuai dengan ketentuan.",
    ctas: [{ label: "Tanya BI Bicara", href: EXTERNAL_LINKS.biBicara }],
    askQuestion: "Mengapa Konsumen perlu menyampaikan data dan kronologis secara lengkap?",
    relatedFocus: "Ketidakpahaman Konsumen",
  },
  H: {
    key: "H",
    statusBadge: "Sudah diproses pihak lain",
    badgeTone: "redirect",
    title: "Pengaduan tidak dapat diproses melalui mekanisme ini.",
    description:
      "Pengaduan kepada Bank Indonesia untuk kategori kerugian finansial atau potensi kerugian finansial harus merupakan masalah perdata yang belum pernah diproses oleh pengadilan, lembaga atau badan penyelesaian sengketa, atau otoritas berwenang lainnya. Jika sudah pernah diproses, silakan lanjutkan melalui mekanisme pada lembaga atau otoritas tersebut.",
    ctas: [{ label: "Baca FAQ Persyaratan Pengaduan", to: "/faq" }],
    askQuestion: "Apa syarat pengaduan kerugian finansial ke Bank Indonesia?",
    relatedFocus: "Kerugian Konsumen",
  },
  I: {
    key: "I",
    statusBadge: "Tidak dapat difasilitasi ulang",
    badgeTone: "redirect",
    title: "Pengaduan tidak dapat difasilitasi ulang.",
    description:
      "Pengaduan yang sudah pernah diupayakan penyelesaiannya oleh Bank Indonesia melalui fasilitasi tidak dapat diproses ulang. Jika dalam fasilitasi sebelumnya tidak tercapai kesepakatan, Konsumen dan Penyelenggara dapat menempuh upaya penyelesaian melalui LAPS SJK atau pengadilan.",
    ctas: [
      { label: "Lihat LAPS SJK", href: EXTERNAL_LINKS.lapsSjk },
      { label: "Baca FAQ Fasilitasi BI", to: "/faq" },
    ],
    askQuestion: "Apakah fasilitasi Bank Indonesia dapat dilakukan lebih dari sekali?",
    relatedFocus: "Sengketa dengan Lembaga Keuangan",
  },
  J: {
    key: "J",
    statusBadge: "Dapat diarahkan ke BI Bicara",
    badgeTone: "positive",
    title: "Pengaduan dapat diarahkan ke BI Bicara.",
    description:
      "Berdasarkan nilai kerugian yang Anda masukkan, pengaduan dapat diarahkan ke kanal Bank Indonesia sepanjang seluruh persyaratan lain terpenuhi. Pastikan Anda telah menyampaikan pengaduan kepada Penyelenggara, menerima hasil penyelesaian tertulis, dan masih berada dalam batas waktu pengajuan. Konsumen dapat mengajukan permintaan fasilitasi secara tertulis dengan mengisi Formulir Pengajuan Fasilitasi. Dalam proses fasilitasi, Konsumen juga perlu menaati dan menandatangani Tata Tertib Pelaksanaan Fasilitasi.",
    checklist: BI_DOCUMENT_CHECKLIST,
    ctas: [
      { label: "Lanjut ke BI Bicara", href: EXTERNAL_LINKS.biBicara },
      {
        label: "Formulir Pengajuan Fasilitasi",
        href: EXTERNAL_LINKS.formulirFasilitasi,
      },
      { label: "Tata Tertib", href: EXTERNAL_LINKS.tataTertib },
    ],
    askQuestion: "Dokumen apa yang perlu disiapkan sebelum ke BI Bicara?",
    relatedFocus: "Kerugian Konsumen",
  },
  K: {
    key: "K",
    statusBadge: "Diarahkan ke LAPS SJK",
    badgeTone: "redirect",
    title: "Nilai kerugian melebihi batas penanganan BI untuk bidang ini.",
    description:
      "Nilai kerugian finansial atau potensi kerugian finansial yang Anda masukkan melebihi batas yang berlaku untuk bidang Penyelenggara atau pelaku terkait yang Anda pilih. Pengaduan dapat dipertimbangkan untuk penyelesaian melalui LAPS SJK atau jalur penyelesaian lain sesuai ketentuan yang berlaku, apabila seluruh persyaratan terpenuhi.",
    ctas: [
      { label: "Lihat LAPS SJK", href: EXTERNAL_LINKS.lapsSjk },
      { label: "Baca FAQ Batas Nilai Kerugian", to: "/faq" },
    ],
    askQuestion: "Kapan pengaduan diarahkan ke LAPS SJK?",
    relatedFocus: "Kerugian Konsumen",
  },
};
