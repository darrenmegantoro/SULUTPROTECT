export const outsideBiDomainKeywords = {
  ojkInsurance: [
    "asuransi",
    "polis",
    "premi",
    "klaim asuransi",
    "agen asuransi",
    "perusahaan asuransi",
    "unit link",
    "produk asuransi",
    "penipuan asuransi",
  ],
  ojkInvestment: [
    "investasi ilegal",
    "investasi bodong",
    "penipuan investasi",
    "robot trading",
    "money game",
    "skema ponzi",
    "return tetap",
    "imbal hasil",
    "aplikasi investasi",
    "produk investasi",
  ],
  ojkFinancing: [
    "leasing",
    "pembiayaan",
    "multifinance",
    "kredit kendaraan",
    "debt collector",
    "penarikan kendaraan",
  ],
  ojkCapitalMarket: [
    "saham",
    "reksa dana",
    "obligasi",
    "sekuritas",
    "pasar modal",
    "manajer investasi",
    "broker",
    "perusahaan efek",
  ],
  ojkPension: ["dana pensiun", "pensiun", "dplk"],
  ojkFintechLending: [
    "pinjol",
    "pinjaman online",
    "fintech lending",
    "gagal bayar pinjol",
  ],
} as const;

export const biDomainKeywords = [
  "bank indonesia",
  "bi",
  "bi bicara",
  "qris",
  "qr is",
  "uang elektronik",
  "e-money",
  "dompet elektronik",
  "transfer dana",
  "remitansi",
  "rekening pembayaran",
  "akun pembayaran",
  "alat pembayaran",
  "kartu atm",
  "kartu debit",
  "kartu kredit",
  "pjp",
  "penyedia jasa pembayaran",
  "sistem pembayaran",
  "kegiatan layanan uang",
  "kupva",
  "penukaran valuta asing",
  "valuta asing",
  "money changer",
  "rekening penipu",
  "akun penipu",
];

export const criminalIndicators = [
  "penipuan",
  "penipu",
  "ditipu",
  "tertipu",
  "scam",
  "penggelapan",
  "pemalsuan",
  "identitas palsu",
  "akun palsu",
  "phishing",
  "social engineering",
  "kejahatan siber",
  "pidana",
  "lapor polisi",
  "polisi",
  "fraud",
];

/** Low-specificity terms that should not dominate FAQ matching alone. */
export const genericLowValueTerms = [
  "pengaduan",
  "kerugian",
  "penipuan",
  "lapor",
  "dokumen",
  "konsumen",
  "apa yang harus",
  "bagaimana",
];

export type AuthorityAction = {
  label: string;
  type: "primary" | "secondary";
  route: string;
};

export type AuthorityRoute = {
  id: string;
  label: string;
  scope: string;
  keywords: string[];
  answerTemplate: string;
  suggestedActions: AuthorityAction[];
  relatedFaqKeywords: string[];
  disclaimer: string;
  suggestedChipQuestions: string[];
};

export const AUTHORITY_ROUTES: AuthorityRoute[] = [
  {
    id: "ojk-asuransi",
    label: "Asuransi / klaim asuransi / polis",
    scope: "OJK / sektor asuransi",
    keywords: [
      "asuransi",
      "polis",
      "premi",
      "klaim asuransi",
      "agen asuransi",
      "perusahaan asuransi",
      "unit link",
      "penipuan asuransi",
    ],
    answerTemplate:
      "Permasalahan yang Anda sampaikan berkaitan dengan asuransi. Produk asuransi pada umumnya bukan termasuk ruang lingkup pengaduan Konsumen Bank Indonesia, melainkan berada pada sektor jasa keuangan yang diawasi oleh OJK.",
    suggestedActions: [
      {
        label: "Isi Formulir Panduan Pengaduan",
        type: "primary",
        route: "/formulir-panduan-pengaduan",
      },
      {
        label: "Baca FAQ Salah Alamat",
        type: "secondary",
        route: "/faq?search=salah%20alamat",
      },
    ],
    relatedFaqKeywords: [
      "salah alamat",
      "kewenangan BI",
      "OJK",
      "di luar kewenangan BI",
      "mengadu ke BI, OJK",
    ],
    disclaimer:
      "APIS memberikan arahan awal dan tidak menetapkan ada atau tidaknya tindak pidana, pelanggaran, atau tanggung jawab pihak tertentu.",
    suggestedChipQuestions: [
      "Apakah asuransi termasuk kewenangan Bank Indonesia?",
      "Apa tanda pengaduan salah alamat ke BI?",
      "Dokumen apa yang perlu saya simpan jika ada dugaan penipuan?",
      "Kapan saya perlu menggunakan Formulir Panduan Pengaduan?",
    ],
  },
  {
    id: "ojk-investment",
    label: "Investasi ilegal / penipuan investasi",
    scope: "OJK / Satgas PASTI / aparat penegak hukum",
    keywords: [
      "investasi ilegal",
      "investasi bodong",
      "penipuan investasi",
      "robot trading",
      "money game",
      "skema ponzi",
      "return tetap",
      "imbal hasil",
      "aplikasi investasi",
    ],
    answerTemplate:
      "Permasalahan yang Anda sampaikan berkaitan dengan investasi atau penawaran imbal hasil. Skema investasi ilegal atau penipuan investasi umumnya berada di luar ruang lingkup pengaduan Konsumen Bank Indonesia dan lebih relevan dengan pengawasan OJK, Satgas PASTI, atau aparat penegak hukum apabila terdapat dugaan tindak pidana.",
    suggestedActions: [
      {
        label: "Isi Formulir Panduan Pengaduan",
        type: "primary",
        route: "/formulir-panduan-pengaduan",
      },
      {
        label: "Baca FAQ Salah Alamat",
        type: "secondary",
        route: "/faq?search=salah%20alamat",
      },
    ],
    relatedFaqKeywords: ["salah alamat", "OJK", "kewenangan BI"],
    disclaimer:
      "APIS memberikan arahan awal dan tidak menetapkan ada atau tidaknya tindak pidana, pelanggaran, atau tanggung jawab pihak tertentu.",
    suggestedChipQuestions: [
      "Apa tanda pengaduan salah alamat ke Bank Indonesia?",
      "Bagaimana membedakan apakah saya harus mengadu ke BI, OJK, atau polisi?",
      "Dokumen apa yang perlu saya simpan jika ada dugaan penipuan?",
      "Kapan saya perlu menggunakan Formulir Panduan Pengaduan?",
    ],
  },
  {
    id: "ojk-financing",
    label: "Pembiayaan / leasing",
    scope: "OJK / sektor pembiayaan",
    keywords: [
      "leasing",
      "pembiayaan",
      "multifinance",
      "kredit kendaraan",
      "debt collector",
      "penarikan kendaraan",
    ],
    answerTemplate:
      "Permasalahan yang Anda sampaikan berkaitan dengan pembiayaan atau leasing. Produk tersebut umumnya berada dalam pengawasan OJK, bukan ruang lingkup pengaduan Konsumen Bank Indonesia.",
    suggestedActions: [
      {
        label: "Isi Formulir Panduan Pengaduan",
        type: "primary",
        route: "/formulir-panduan-pengaduan",
      },
      {
        label: "Baca FAQ Salah Alamat",
        type: "secondary",
        route: "/faq?search=salah%20alamat",
      },
    ],
    relatedFaqKeywords: ["salah alamat", "OJK", "pembiayaan"],
    disclaimer:
      "APIS memberikan arahan awal dan tidak menetapkan ada atau tidaknya tindak pidana, pelanggaran, atau tanggung jawab pihak tertentu.",
    suggestedChipQuestions: [
      "Jika sengketa saya terjadi dengan bank atau pembiayaan yang diawasi OJK, ke mana saya harus mengadu lebih dahulu?",
      "Apa tanda pengaduan salah alamat ke BI?",
      "Kapan saya perlu menggunakan Formulir Panduan Pengaduan?",
    ],
  },
  {
    id: "ojk-capital-market",
    label: "Pasar modal / sekuritas",
    scope: "OJK / pasar modal",
    keywords: [
      "saham",
      "reksa dana",
      "obligasi",
      "sekuritas",
      "pasar modal",
      "manajer investasi",
      "broker",
      "perusahaan efek",
    ],
    answerTemplate:
      "Permasalahan yang Anda sampaikan berkaitan dengan pasar modal atau sekuritas. Ruang lingkup tersebut umumnya diawasi OJK, bukan Bank Indonesia.",
    suggestedActions: [
      {
        label: "Isi Formulir Panduan Pengaduan",
        type: "primary",
        route: "/formulir-panduan-pengaduan",
      },
      {
        label: "Baca FAQ Salah Alamat",
        type: "secondary",
        route: "/faq?search=salah%20alamat",
      },
    ],
    relatedFaqKeywords: ["salah alamat", "pasar modal", "OJK"],
    disclaimer:
      "APIS memberikan arahan awal dan tidak menetapkan ada atau tidaknya tindak pidana, pelanggaran, atau tanggung jawab pihak tertentu.",
    suggestedChipQuestions: [
      "Apa tanda pengaduan salah alamat ke Bank Indonesia?",
      "Bagaimana membedakan apakah saya harus mengadu ke BI, OJK, atau polisi?",
    ],
  },
  {
    id: "ojk-pension",
    label: "Dana pensiun",
    scope: "OJK / dana pensiun",
    keywords: ["dana pensiun", "pensiun", "dplk"],
    answerTemplate:
      "Permasalahan yang Anda sampaikan berkaitan dengan dana pensiun. Produk dana pensiun umumnya berada dalam pengawasan OJK, bukan ruang lingkup pengaduan Konsumen Bank Indonesia.",
    suggestedActions: [
      {
        label: "Isi Formulir Panduan Pengaduan",
        type: "primary",
        route: "/formulir-panduan-pengaduan",
      },
      {
        label: "Baca FAQ Salah Alamat",
        type: "secondary",
        route: "/faq?search=salah%20alamat",
      },
    ],
    relatedFaqKeywords: ["salah alamat", "dana pensiun", "OJK"],
    disclaimer:
      "APIS memberikan arahan awal dan tidak menetapkan ada atau tidaknya tindak pidana, pelanggaran, atau tanggung jawab pihak tertentu.",
    suggestedChipQuestions: [
      "Apa tanda pengaduan salah alamat ke BI?",
      "Kapan saya perlu menggunakan Formulir Panduan Pengaduan?",
    ],
  },
  {
    id: "ojk-fintech-lending",
    label: "Pinjaman online / pinjol",
    scope: "OJK / fintech lending",
    keywords: [
      "pinjol",
      "pinjaman online",
      "fintech lending",
      "gagal bayar pinjol",
    ],
    answerTemplate:
      "Permasalahan yang Anda sampaikan berkaitan dengan pinjaman online atau fintech lending. Produk tersebut umumnya berada dalam pengawasan OJK, bukan ruang lingkup pengaduan Konsumen Bank Indonesia.",
    suggestedActions: [
      {
        label: "Isi Formulir Panduan Pengaduan",
        type: "primary",
        route: "/formulir-panduan-pengaduan",
      },
      {
        label: "Baca FAQ Salah Alamat",
        type: "secondary",
        route: "/faq?search=salah%20alamat",
      },
    ],
    relatedFaqKeywords: ["salah alamat", "fintech", "OJK"],
    disclaimer:
      "APIS memberikan arahan awal dan tidak menetapkan ada atau tidaknya tindak pidana, pelanggaran, atau tanggung jawab pihak tertentu.",
    suggestedChipQuestions: [
      "Apa tanda pengaduan salah alamat ke Bank Indonesia?",
      "Bagaimana membedakan apakah saya harus mengadu ke BI, OJK, atau polisi?",
    ],
  },
];

export const GENERIC_FRAUD_CLARIFICATION =
  "Untuk menentukan arahan yang tepat, apakah penipuan tersebut terkait:\n1. transfer dana, QRIS, uang elektronik, atau layanan pembayaran;\n2. asuransi, investasi, pembiayaan, pinjaman online, pasar modal, atau dana pensiun;\n3. jual-beli barang/jasa umum;\n4. pemalsuan, penggelapan, atau penyalahgunaan identitas/rekening?";

export const GENERIC_FRAUD_CHIP_QUESTIONS = [
  "Apa yang harus saya lakukan jika merasa menjadi korban transfer dana terindikasi fraud?",
  "Apa tanda pengaduan salah alamat ke Bank Indonesia?",
  "Bagaimana membedakan apakah saya harus mengadu ke BI, OJK, atau polisi?",
  "Kapan saya perlu menggunakan Formulir Panduan Pengaduan?",
];
