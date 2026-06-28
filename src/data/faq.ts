import type { FAQItem } from "@/types/faq";

// Embedded FAQ dataset (63 items). This is the SINGLE SOURCE OF TRUTH for:
// - FAQ accordion
// - FAQ search
// - Chatbot (Asisten) retrieval
// - Related FAQ links from Guided Form result cards
//
// Question/answer/source/reference text is preserved verbatim from the source
// material. `keywords` are lightly added to improve fuzzy search relevance.

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-001",
    no: 1,
    source: "Ketentuan ASPI",
    focus: "Ketidakpahaman Konsumen",
    question:
      "Apa yang harus saya lakukan jika merasa menjadi korban transfer dana terindikasi fraud?",
    answer:
      "Segera laporkan kepada Penyelenggara Penerima Laporan, yaitu penyelenggara yang mengelola Rekening/Akun Korban. Laporan disampaikan jika terjadi transaksi Transfer Dana terindikasi fraud ke Rekening/Akun Penerima Dana, baik karena penipuan maupun tanpa persetujuan atau tanpa sepengetahuan Korban.",
    reference: "",
    keywords: ["fraud", "korban", "transfer dana", "lapor", "penipuan", "rekening"],
  },
  {
    id: "faq-002",
    no: 2,
    source: "Ketentuan ASPI",
    focus: "Ketidakpahaman Konsumen",
    question: "Apakah laporan hanya dapat disampaikan langsung secara tertulis?",
    answer:
      "Permintaan Penundaan Transaksi dapat didahului melalui sarana lain, seperti telepon, pesan singkat melalui media elektronik, atau e-mail. Namun, Korban tetap perlu segera melengkapi dokumen pendukung yang diminta oleh Penyelenggara Penerima Laporan agar proses penanganan dapat dilanjutkan.",
    reference: "",
    keywords: ["laporan", "tertulis", "telepon", "email", "penundaan transaksi", "dokumen"],
  },
  {
    id: "faq-003",
    no: 3,
    source: "Ketentuan ASPI",
    focus: "Ketidakpahaman Konsumen",
    question: "Dokumen apa yang perlu saya siapkan saat melapor?",
    answer:
      "Korban atau Perwakilan Korban perlu melengkapi laporan dengan dokumen pendukung, antara lain surat pernyataan dari Korban, surat kuasa apabila diwakili, dan/atau surat keterangan dari Kepolisian, sesuai dengan ketentuan dan kebijakan yang berlaku pada Penyelenggara Penerima Laporan.",
    reference: "",
    keywords: ["dokumen", "surat pernyataan", "surat kuasa", "kepolisian", "lapor", "fraud"],
  },
  {
    id: "faq-004",
    no: 4,
    source: "Ketentuan ASPI",
    focus: "Ketidakpahaman Konsumen",
    question: "Apa yang dimaksud dengan Penundaan Transaksi?",
    answer:
      "Penundaan Transaksi adalah tindakan Penyelenggara Penerima Dana untuk tidak melaksanakan transaksi dalam bentuk apa pun dari dan ke Rekening/Akun Penerima Dana atas inisiatif sendiri dalam waktu paling lama 5 hari kerja. Dalam periode ini dilakukan verifikasi atas laporan dan identitas Penerima Dana.",
    reference: "",
    keywords: ["penundaan transaksi", "5 hari kerja", "verifikasi", "rekening", "definisi"],
  },
  {
    id: "faq-005",
    no: 5,
    source: "Ketentuan ASPI",
    focus: "Ketidakpahaman Konsumen",
    question: "Berapa lama dana dapat ditunda oleh Penyelenggara Penerima Dana?",
    answer:
      "Penundaan Transaksi dilakukan paling lama 5 hari kerja sejak Penundaan Transaksi dilakukan. Dalam jangka waktu tersebut, Penyelenggara Penerima Dana wajib melakukan verifikasi kebenaran identitas Penerima Dana melalui CDD dan/atau EDD serta melakukan verifikasi laporan dari Korban.",
    reference: "",
    keywords: ["penundaan", "5 hari kerja", "batas waktu", "CDD", "EDD", "verifikasi"],
  },
  {
    id: "faq-006",
    no: 6,
    source: "Ketentuan ASPI",
    focus: "Sengketa dengan Lembaga Keuangan",
    question:
      "Apa yang dilakukan penyelenggara setelah saya menyampaikan laporan?",
    answer:
      "Penyelenggara Penerima Laporan wajib memeriksa laporan dari Korban atau Perwakilan Korban. Jika Penerima Dana berada di Penyelenggara lain, Penyelenggara Penerima Laporan meminta bantuan kepada Penyelenggara Penerima Dana untuk melakukan Penundaan Transaksi sesegera mungkin.",
    reference: "",
    keywords: ["penyelenggara", "memeriksa laporan", "penundaan transaksi", "koordinasi"],
  },
  {
    id: "faq-007",
    no: 7,
    source: "Ketentuan ASPI",
    focus: "Sengketa dengan Lembaga Keuangan",
    question:
      "Apa yang diperiksa dalam proses verifikasi terhadap Penerima Dana?",
    answer:
      "Penyelenggara Penerima Dana melakukan verifikasi lengkap melalui CDD dan/atau EDD, antara lain terhadap kebenaran data identitas Penerima Dana, transaksi, ketersediaan atau sisa dana, serta dokumen pendukung lainnya jika diperlukan. Hasil verifikasi menentukan tindak lanjut atas Penundaan atau Penolakan Transaksi.",
    reference: "",
    keywords: ["verifikasi", "CDD", "EDD", "identitas", "sisa dana", "penolakan transaksi"],
  },
  {
    id: "faq-008",
    no: 8,
    source: "Ketentuan ASPI",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Apakah Penundaan Transaksi pasti berarti dana akan kembali?",
    answer:
      "Tidak selalu. Penundaan Transaksi dilakukan untuk memberi waktu verifikasi. Pengembalian dana hanya dapat dilakukan jika memenuhi ketentuan, antara lain masih terdapat sisa dana pada Rekening/Akun Penerima Dana, terdapat permintaan pengembalian dana, dan dokumen yang dipersyaratkan telah dipenuhi.",
    reference: "",
    keywords: ["penundaan transaksi", "pengembalian dana", "sisa dana", "syarat"],
  },
  {
    id: "faq-009",
    no: 9,
    source: "Ketentuan ASPI",
    focus: "Kerugian Konsumen",
    question: "Kapan dana Korban dapat dikembalikan?",
    answer:
      "Pengembalian dana dapat dilakukan jika terdapat permintaan pengembalian dana, masih terdapat sisa dana di Rekening/Akun Penerima Dana, dana berasal dari Rekening/Akun Korban melalui Transfer Dana, dan telah diterima Surat Pembebasan Tanggung Jawab atau Indemnity Letter sesuai ketentuan yang berlaku.",
    reference: "",
    keywords: ["pengembalian dana", "korban", "indemnity letter", "sisa dana", "syarat"],
  },
  {
    id: "faq-010",
    no: 10,
    source: "Ketentuan ASPI",
    focus: "Kerugian Konsumen",
    question: "Berapa lama proses pengembalian dana kepada Korban?",
    answer:
      "Setelah dokumen yang dipersyaratkan dipenuhi, Penyelenggara Penerima Dana wajib mengembalikan dana kepada Penyelenggara Penerima Laporan untuk dikreditkan ke Rekening/Akun Korban paling lama 20 hari kerja, atau dalam waktu lain yang disepakati oleh kedua pihak.",
    reference: "",
    keywords: ["pengembalian dana", "20 hari kerja", "batas waktu", "korban"],
  },
  {
    id: "faq-011",
    no: 11,
    source: "Ketentuan ASPI",
    focus: "Kerugian Konsumen",
    question:
      "Bagaimana jika dana di Rekening/Akun Penerima Dana sudah ditarik seluruhnya?",
    answer:
      "Jika data identitas Penerima Dana tidak benar dan/atau transaksi terindikasi fraud, namun dana telah digunakan atau ditarik seluruhnya, Penyelenggara Penerima Dana tetap melakukan Penolakan Transaksi dan melaporkan transaksi tersebut sebagai Transaksi Keuangan Mencurigakan kepada PPATK sesuai ketentuan.",
    reference: "",
    keywords: ["dana ditarik", "penolakan transaksi", "PPATK", "transaksi mencurigakan", "fraud"],
  },
  {
    id: "faq-012",
    no: 12,
    source: "Ketentuan ASPI",
    focus: "Kerugian Konsumen",
    question: "Bagaimana jika dana yang tersisa tidak cukup untuk semua Korban?",
    answer:
      "Jika terdapat lebih dari satu Korban dan dana tidak mencukupi, pengembalian dana dilakukan berdasarkan kesepakatan para Korban dengan mempertimbangkan ketersediaan atau sisa dana dan prinsip keadilan secara proporsional. Jika tidak tercapai kesepakatan, pengembalian berdasarkan putusan pengadilan yang berkekuatan hukum tetap.",
    reference: "",
    keywords: ["dana tidak cukup", "banyak korban", "proporsional", "pengadilan", "kesepakatan"],
  },
  {
    id: "faq-013",
    no: 13,
    source: "Ketentuan ASPI",
    focus: "Pelanggaran Ketentuan",
    question:
      "Kapan Penyelenggara Penerima Dana wajib melakukan Penolakan Transaksi?",
    answer:
      "Penolakan Transaksi dilakukan jika data identitas Penerima Dana tidak benar atau terindikasi fraud. Penolakan juga dilakukan jika data identitas benar, tetapi Penerima Dana tidak berhasil dihubungi dan dari hasil verifikasi terindikasi kuat melakukan fraud.",
    reference: "",
    keywords: ["penolakan transaksi", "identitas tidak benar", "fraud", "verifikasi"],
  },
  {
    id: "faq-014",
    no: 14,
    source: "Ketentuan ASPI",
    focus: "Pelanggaran Ketentuan",
    question: "Apakah rekening Penerima Dana dapat ditutup atau diblokir?",
    answer:
      "Dalam kondisi tertentu, setelah Penolakan Transaksi dilakukan dan transaksi dilaporkan sebagai Transaksi Keuangan Mencurigakan kepada PPATK, proses dapat dilanjutkan dengan penutupan Rekening/Akun sesuai ketentuan yang berlaku pada Penyelenggara Penerima Dana.",
    reference: "",
    keywords: ["rekening ditutup", "blokir", "PPATK", "penolakan transaksi", "penutupan akun"],
  },
  {
    id: "faq-015",
    no: 15,
    source: "Ketentuan ASPI",
    focus: "Pelanggaran Ketentuan",
    question:
      "Apa yang dapat dilakukan jika penyelenggara tidak menjalankan ketentuan penanganan?",
    answer:
      "Ketentuan ini mengatur kewajiban Penyelenggara dalam memeriksa laporan, melakukan penundaan, verifikasi, penolakan, pelaporan, dan pengembalian dana sesuai kondisi tertentu. Apabila terdapat dugaan ketidakpatuhan, konsumen dapat meminta penjelasan tindak lanjut kepada penyelenggara berdasarkan tahapan penanganan yang diatur.",
    reference: "",
    keywords: ["ketidakpatuhan", "kewajiban penyelenggara", "tindak lanjut", "pelanggaran"],
  },
  {
    id: "faq-016",
    no: 16,
    source: "Ketentuan ASPI",
    focus: "Ketidakpahaman Konsumen",
    question: "Apa saja contoh modus fraud yang perlu saya waspadai?",
    answer:
      "Modus yang diatur mencakup Card Trapping, Man in the Middle/Man in the Browser, Phishing/Smishing/Vishing, SIM Hijack, Skimming, Sinkronisasi Token, Penipuan Mule Account, serta Social Engineering/Penipuan/Authorised Push Payment atau APP Fraud.",
    reference: "",
    keywords: ["modus fraud", "phishing", "skimming", "social engineering", "mule account", "penipuan"],
  },
  {
    id: "faq-017",
    no: 17,
    source: "Ketentuan ASPI",
    focus: "Ketidakpahaman Konsumen",
    question: "Apa itu Social Engineering atau APP Fraud?",
    answer:
      "Social Engineering/Penipuan/APP Fraud adalah penipuan dengan cara memperdaya, mengelabui, atau memberi informasi fiktif kepada Korban agar melakukan Transfer Dana ke Rekening/Akun Penerima Dana. Contohnya penipuan fraudster yang mengaku sebagai penjual, perwakilan rumah sakit, polisi, atau pihak lain.",
    reference: "",
    keywords: ["social engineering", "APP fraud", "penipuan", "transfer dana", "fraudster"],
  },
  {
    id: "faq-018",
    no: 18,
    source: "Ketentuan ASPI",
    focus: "Sengketa dengan Lembaga Keuangan",
    question:
      "Apakah penyelenggara boleh menyampaikan alasan Penolakan Transaksi kepada Penerima Dana?",
    answer:
      "Dalam hal terjadi Penolakan Transaksi, Penyelenggara Penerima Dana dapat menyampaikan alasan Penolakan Transaksi kepada Pengguna Jasa Penerima Dana. Hal ini merupakan bagian dari proses tindak lanjut setelah verifikasi menunjukkan kondisi yang memenuhi dasar Penolakan Transaksi.",
    reference: "",
    keywords: ["penolakan transaksi", "alasan", "penerima dana", "tindak lanjut"],
  },
  {
    id: "faq-019",
    no: 19,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Ketidakpahaman Konsumen",
    question:
      "Pengaduan seperti apa yang dapat saya sampaikan kepada Penyelenggara?",
    answer:
      "Konsumen dapat menyampaikan pengaduan kepada Penyelenggara apabila mengalami permasalahan dalam penggunaan produk dan/atau jasa. Pengaduan dapat disampaikan secara lisan dan/atau tertulis. Pengaduan lisan digunakan jika pengaduan memiliki unsur ketidakpahaman Konsumen.",
    reference: "Pasal 25",
    keywords: ["pengaduan", "penyelenggara", "lisan", "tertulis", "produk jasa"],
  },
  {
    id: "faq-020",
    no: 20,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Ketidakpahaman Konsumen",
    question:
      "Jika saya hanya belum memahami layanan atau transaksi, apakah harus membuat pengaduan tertulis?",
    answer:
      "Tidak selalu. Apabila pengaduan memiliki unsur ketidakpahaman Konsumen, pengaduan dapat disampaikan secara lisan kepada Penyelenggara. Konsumen perlu menyampaikan permasalahan dengan jelas melalui sarana resmi yang ditetapkan Penyelenggara agar dapat ditindaklanjuti secara efektif.",
    reference: "Pasal 25 ayat (2), (3), dan (5)",
    keywords: ["ketidakpahaman", "pengaduan lisan", "penyelenggara", "edukasi"],
  },
  {
    id: "faq-021",
    no: 21,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Sengketa dengan Lembaga Keuangan",
    question:
      "Kapan pengaduan perlu disampaikan secara tertulis kepada Penyelenggara?",
    answer:
      "Pengaduan secara tertulis disampaikan kepada Penyelenggara apabila pengaduan memiliki unsur sengketa, pelanggaran ketentuan, dan/atau kerugian Konsumen. Konsumen perlu memenuhi seluruh persyaratan pengajuan pengaduan melalui sarana resmi Penyelenggara agar pengaduan dapat ditindaklanjuti.",
    reference: "Pasal 25 ayat (4) dan (5)",
    keywords: ["pengaduan tertulis", "sengketa", "kerugian", "pelanggaran", "penyelenggara"],
  },
  {
    id: "faq-022",
    no: 22,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Apakah Penyelenggara wajib menangani pengaduan Konsumen?",
    answer:
      "Ya. Penyelenggara wajib menangani dan menyelesaikan pengaduan yang disampaikan oleh Konsumen secara efektif. Penyelenggara juga menyusun hasil penanganan dan penyelesaian pengaduan dalam laporan penanganan dan penyelesaian pengaduan Konsumen.",
    reference: "Pasal 25 ayat (1) dan (6)",
    keywords: ["kewajiban penyelenggara", "menangani pengaduan", "penyelesaian"],
  },
  {
    id: "faq-023",
    no: 23,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Ketidakpahaman Konsumen",
    question:
      "Pengaduan seperti apa yang dapat disampaikan kepada Bank Indonesia?",
    answer:
      "Konsumen dapat menyampaikan pengaduan kepada Bank Indonesia, baik secara langsung maupun tidak langsung. Pengaduan kepada Bank Indonesia dapat berupa adanya ketidakpahaman Konsumen, indikasi pelanggaran terhadap ketentuan Bank Indonesia oleh Penyelenggara, dan/atau kerugian finansial atau potensi kerugian finansial yang berdampak langsung kepada Konsumen.",
    reference: "Pasal 36",
    keywords: ["pengaduan", "bank indonesia", "ketidakpahaman", "pelanggaran", "kerugian finansial"],
  },
  {
    id: "faq-024",
    no: 24,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Sengketa dengan Lembaga Keuangan",
    question:
      "Apakah saya harus mengadu ke Penyelenggara terlebih dahulu sebelum ke Bank Indonesia?",
    answer:
      "Pengaduan kepada Bank Indonesia dilakukan dengan ketentuan Konsumen telah menyampaikan pengaduan kepada Penyelenggara, namun tidak terdapat kesepakatan antara Konsumen dengan Penyelenggara. Permasalahan yang diajukan juga merupakan masalah perdata yang tidak pernah diproses oleh pengadilan atau lembaga penyelesaian sengketa lainnya.",
    reference: "Pasal 37",
    keywords: ["mengadu ke penyelenggara", "syarat", "kesepakatan", "perdata", "bank indonesia"],
  },
  {
    id: "faq-025",
    no: 25,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Kerugian Konsumen",
    question:
      "Dokumen apa yang perlu disiapkan untuk pengaduan kerugian kepada Bank Indonesia?",
    answer:
      "Untuk pengaduan yang berkaitan dengan kerugian finansial atau potensi kerugian finansial, Konsumen paling sedikit menyertakan fotokopi bukti identitas diri, fotokopi surat hasil penyelesaian pengaduan dari Penyelenggara, fotokopi bukti transaksi, fotokopi surat kuasa jika dikuasakan, dan surat pernyataan bermeterai cukup.",
    reference: "Pasal 38",
    keywords: ["dokumen", "kerugian finansial", "identitas", "bukti transaksi", "surat kuasa", "meterai"],
  },
  {
    id: "faq-026",
    no: 26,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Kerugian Konsumen",
    question:
      "Apakah ada batas waktu untuk menyampaikan pengaduan kepada Bank Indonesia?",
    answer:
      "Ya. Penyampaian pengaduan kepada Bank Indonesia terkait kerugian finansial atau potensi kerugian finansial tidak boleh melebihi 60 hari kerja sejak tanggal penyampaian hasil penyelesaian pengaduan secara tertulis dari Penyelenggara kepada Konsumen.",
    reference: "Pasal 40",
    keywords: ["batas waktu", "60 hari kerja", "pengaduan", "bank indonesia", "kerugian"],
  },
  {
    id: "faq-027",
    no: 27,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Kerugian Konsumen",
    question:
      "Berapa nilai potensi kerugian finansial yang dapat diajukan kepada Bank Indonesia?",
    answer:
      "Nilai potensi kerugian finansial ditetapkan paling banyak sebesar Rp500.000.000,00 untuk Penyelenggara di bidang Sistem Pembayaran, Penyelenggara Kegiatan Layanan Uang, dan pihak lain yang diatur dan diawasi Bank Indonesia, atau Rp2.500.000.000,00 untuk kegiatan di Pasar Uang dan Pasar Valuta Asing.",
    reference: "Pasal 39",
    keywords: ["nilai kerugian", "batas nilai", "500 juta", "2.5 miliar", "pasar uang", "valas"],
  },
  {
    id: "faq-028",
    no: 28,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Pelanggaran Ketentuan",
    question:
      "Apa saja prinsip Pelindungan Konsumen yang harus diperhatikan Penyelenggara?",
    answer:
      "Prinsip Pelindungan Konsumen meliputi kesetaraan dan perlakuan yang adil, keterbukaan dan transparansi, edukasi dan literasi, perilaku bisnis yang bertanggung jawab, perlindungan aset Konsumen terhadap penyalahgunaan, perlindungan data dan/atau informasi Konsumen, penanganan pengaduan yang efektif, serta penegakan kepatuhan.",
    reference: "Pasal 3",
    keywords: ["prinsip", "pelindungan konsumen", "transparansi", "edukasi", "perlindungan data"],
  },
  {
    id: "faq-029",
    no: 29,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Kerugian Konsumen",
    question: "Kapan Penyelenggara wajib bertanggung jawab atas kerugian Konsumen?",
    answer:
      "Penyelenggara wajib bertanggung jawab atas kerugian Konsumen yang timbul akibat kesalahan, kelalaian, dan/atau perbuatan Penyelenggara yang bertentangan dengan ketentuan peraturan perundang-undangan. Hal ini termasuk ketidaktindakan atas transaksi terindikasi fraud dan penipuan pada produk dan/atau jasa milik Konsumen.",
    reference: "Pasal 32 ayat (1)",
    keywords: ["tanggung jawab", "penyelenggara", "kerugian", "kelalaian", "fraud"],
  },
  {
    id: "faq-030",
    no: 30,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Kerugian Konsumen",
    question: "Kapan Penyelenggara tidak bertanggung jawab atas kerugian Konsumen?",
    answer:
      "Penyelenggara tidak bertanggung jawab apabila dapat membuktikan kerugian timbul akibat kesalahan, kelalaian, dan/atau perbuatan Konsumen, seperti mengungkapkan kode otentikasi, kode akses, atau fitur keamanan kepada pihak lain, sengaja menyalahgunakan sarana pembayaran/keuangan, atau gagal memenuhi kewajibannya.",
    reference: "Pasal 32 ayat (2)",
    keywords: ["tidak bertanggung jawab", "kelalaian konsumen", "kode otentikasi", "OTP", "PIN"],
  },
  {
    id: "faq-031",
    no: 31,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Kerugian Konsumen",
    question: "Jika alat pembayaran saya hilang atau dicuri, apa yang perlu saya lakukan?",
    answer:
      "Konsumen perlu segera memberitahukan kepada Penyelenggara atas kehilangan atau pencurian sarana pembayaran dan/atau keuangan. Pertanggungjawaban Konsumen atas kerugian transaksi fraud dan penipuan akibat alat pembayaran hilang atau dicuri berlaku hingga Konsumen memberitahukan kehilangan atau pencurian tersebut kepada Penyelenggara.",
    reference: "Pasal 32 ayat (5) dan (6)",
    keywords: ["kartu hilang", "dicuri", "alat pembayaran", "blokir", "pemberitahuan"],
  },
  {
    id: "faq-032",
    no: 32,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Kerugian Konsumen",
    question: "Bagaimana bentuk pertanggungjawaban Penyelenggara atas kerugian Konsumen?",
    answer:
      "Bentuk pertanggungjawaban Penyelenggara berupa ganti rugi atas kerugian Konsumen dilakukan melalui pengembalian dana sesuai hasil kesepakatan atau putusan yang bersifat final. Pengembalian dana paling lambat 1 hari kerja setelah seluruh proses administrasi sesuai ketentuan internal Penyelenggara selesai dilakukan.",
    reference: "Pasal 32 ayat (3) dan (4)",
    keywords: ["ganti rugi", "pengembalian dana", "1 hari kerja", "pertanggungjawaban"],
  },
  {
    id: "faq-033",
    no: 33,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Kerugian Konsumen",
    question: "Apakah Penyelenggara wajib memiliki mekanisme penggantian kerugian?",
    answer:
      "Ya. Penyelenggara wajib memiliki mekanisme penggantian kerugian yang paling sedikit memuat prosedur pembuktian, batasan tanggung jawab, informasi dan/atau dokumen untuk klaim, prosedur pengembalian dana Konsumen, serta pelaporan dan pemantauan internal atas transaksi fraud dan penipuan.",
    reference: "Pasal 33",
    keywords: ["mekanisme penggantian", "klaim", "prosedur", "pengembalian dana", "fraud"],
  },
  {
    id: "faq-034",
    no: 34,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Ketidakpahaman Konsumen",
    question: "Bagaimana Bank Indonesia menangani pengaduan Konsumen?",
    answer:
      "Bentuk penanganan pengaduan Konsumen oleh Bank Indonesia berupa edukasi, konsultasi, dan fasilitasi. Bentuk penanganan tersebut diberikan berdasarkan penelaahan terhadap pengaduan yang disampaikan Konsumen, sehingga Konsumen perlu menyampaikan informasi permasalahan secara jelas dan sesuai ketentuan.",
    reference: "Pasal 42",
    keywords: ["penanganan", "edukasi", "konsultasi", "fasilitasi", "bank indonesia"],
  },
  {
    id: "faq-035",
    no: 35,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Ketidakpahaman Konsumen",
    question: "Apa yang dilakukan Bank Indonesia dalam kegiatan konsultasi?",
    answer:
      "Dalam kegiatan konsultasi, Bank Indonesia dapat memberikan pemahaman kepada Konsumen dan Penyelenggara terkait permasalahan penggunaan produk dan/atau jasa, meminta klarifikasi permasalahan kepada Konsumen dan Penyelenggara, serta meminta Penyelenggara meninjau kembali pengaduan dan menyampaikan usulan penyelesaian kepada Konsumen.",
    reference: "Pasal 43",
    keywords: ["konsultasi", "klarifikasi", "usulan penyelesaian", "bank indonesia"],
  },
  {
    id: "faq-036",
    no: 36,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Kapan Konsumen dapat meminta fasilitasi kepada Bank Indonesia?",
    answer:
      "Fasilitasi dilakukan setelah melalui konsultasi dan memenuhi persyaratan administrasi yang ditetapkan Bank Indonesia. Permintaan fasilitasi diajukan secara tertulis dengan mengisi formulir pengajuan fasilitasi dan dilengkapi dokumen pendukung sesuai ketentuan. Pengaduan yang sudah pernah difasilitasi tidak dapat diproses ulang.",
    reference: "Pasal 44 dan Pasal 45",
    keywords: ["fasilitasi", "konsultasi", "formulir", "syarat", "bank indonesia"],
  },
  {
    id: "faq-037",
    no: 37,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Sengketa dengan Lembaga Keuangan",
    question:
      "Apakah fasilitasi Bank Indonesia merupakan keputusan penyelesaian sengketa?",
    answer:
      "Tidak. Dalam melaksanakan fungsi fasilitasi, Bank Indonesia tidak memberikan keputusan dan/atau rekomendasi penyelesaian sengketa kepada Konsumen dan Penyelenggara. Kesepakatan atau ketidaksepakatan yang dihasilkan merupakan kesepakatan atau ketidaksepakatan sukarela antara Konsumen dan Penyelenggara.",
    reference: "Pasal 46 ayat (3) dan Pasal 48",
    keywords: ["fasilitasi", "keputusan", "sukarela", "kesepakatan", "sengketa"],
  },
  {
    id: "faq-038",
    no: 38,
    source: "PADG Nomor 20 Tahun 2023",
    focus: "Ketidakpahaman Konsumen",
    question: "Ke mana pengaduan kepada Bank Indonesia dapat disampaikan?",
    answer:
      "Pengaduan langsung dapat disampaikan melalui visitor center BI Bicara atau kantor perwakilan Bank Indonesia dalam negeri. Pengaduan tidak langsung dapat disampaikan melalui call center BI Bicara 131 atau 1500131, email bicara@bi.go.id, chatbot LISA 081 131 131 131, surat, atau formulir pengaduan daring pada laman resmi Bank Indonesia.",
    reference: "Pasal 41",
    keywords: ["BI Bicara", "131", "1500131", "kanal", "email", "kontak", "pengaduan"],
  },
  {
    id: "faq-039",
    no: 39,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Ketidakpahaman Konsumen",
    question:
      "Setelah pengaduan saya diterima Bank Indonesia, siapa yang menindaklanjuti?",
    answer:
      "Pengaduan Konsumen yang diterima Bank Indonesia ditindaklanjuti oleh BI Bicara atau KPwDN. BI Bicara menangani layanan penerimaan, edukasi atas ketidakpahaman Konsumen, penatausahaan pengaduan, serta meneruskan pengaduan kepada KPwDN apabila diperlukan tindak lanjut penanganan lainnya.",
    reference: "Pasal 12 dan Pasal 13",
    keywords: ["BI Bicara", "KPwDN", "tindak lanjut", "penerimaan pengaduan"],
  },
  {
    id: "faq-040",
    no: 40,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Ketidakpahaman Konsumen",
    question:
      "Apa yang dilakukan BI Bicara jika pengaduan saya disebabkan ketidakpahaman?",
    answer:
      "BI Bicara menindaklanjuti pengaduan yang disebabkan ketidakpahaman Konsumen dalam bentuk edukasi. Edukasi diberikan sebagai tindak lanjut penanganan pengaduan, dengan fokus pada pemahaman mengenai ketentuan Bank Indonesia, persyaratan pengaduan, cakupan penanganan pengaduan oleh Bank Indonesia, dan/atau pemahaman lainnya.",
    reference: "Pasal 13 dan Pasal 22",
    keywords: ["BI Bicara", "edukasi", "ketidakpahaman", "tindak lanjut"],
  },
  {
    id: "faq-041",
    no: 41,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Ketidakpahaman Konsumen",
    question:
      "Informasi apa saja yang dapat diberikan Bank Indonesia melalui edukasi?",
    answer:
      "Edukasi diberikan untuk memberikan pemahaman antara lain mengenai ketentuan Bank Indonesia mengenai produk dan/atau jasa dari Penyelenggara, persyaratan pengaduan, cakupan penanganan pengaduan yang dilakukan oleh Bank Indonesia, dan/atau pemahaman lainnya yang relevan dengan permasalahan Konsumen.",
    reference: "Pasal 22",
    keywords: ["edukasi", "informasi", "persyaratan pengaduan", "cakupan penanganan"],
  },
  {
    id: "faq-042",
    no: 42,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Ketidakpahaman Konsumen",
    question: "Siapa yang melakukan edukasi kepada Konsumen?",
    answer:
      "Kegiatan edukasi dalam rangka tindak lanjut penanganan Pengaduan Konsumen dilakukan oleh BI Bicara dan KPwDN. Bentuk edukasi diberikan berdasarkan penelaahan atas pengaduan yang disampaikan Konsumen, sehingga Konsumen perlu menyampaikan informasi permasalahan secara jelas.",
    reference: "Pasal 21 dan Pasal 22",
    keywords: ["edukasi", "BI Bicara", "KPwDN", "penelaahan"],
  },
  {
    id: "faq-043",
    no: 43,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Apa peran KPwDN dalam menindaklanjuti pengaduan Konsumen?",
    answer:
      "KPwDN memberikan layanan penerimaan Pengaduan Konsumen, menatausahakan pengaduan, menindaklanjuti pengaduan dalam bentuk edukasi, konsultasi, atau fasilitasi sesuai ketentuan, berkoordinasi dengan BI Bicara dan Satuan Kerja lain, serta melakukan pemantauan atas penyelesaian pengaduan Konsumen oleh Penyelenggara.",
    reference: "Pasal 14",
    keywords: ["KPwDN", "peran", "edukasi", "konsultasi", "fasilitasi", "pemantauan"],
  },
  {
    id: "faq-044",
    no: 44,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Bagaimana jika domisili saya lebih dekat dengan KPwDN lain?",
    answer:
      "Apabila diketahui domisili atau tempat tinggal Konsumen lebih dekat dengan KPwDN lain, KPwDN dapat meneruskan pengaduan kepada KPwDN lain yang dimaksud. Hal ini dilakukan agar penanganan pengaduan dapat dilaksanakan oleh kantor perwakilan Bank Indonesia yang lebih sesuai dengan domisili Konsumen.",
    reference: "Pasal 14",
    keywords: ["domisili", "KPwDN", "kantor perwakilan", "meneruskan pengaduan"],
  },
  {
    id: "faq-045",
    no: 45,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Pelanggaran Ketentuan",
    question: "Bagaimana Bank Indonesia mengklasifikasikan pengaduan Konsumen?",
    answer:
      "Pengaduan Konsumen kepada Bank Indonesia diklasifikasikan menjadi pengaduan karena ketidakpahaman Konsumen, indikasi pelanggaran terhadap Peraturan Bank Indonesia yang dilakukan oleh Penyelenggara, atau kerugian finansial dan/atau potensi kerugian finansial yang wajar dan berdampak secara langsung kepada Konsumen.",
    reference: "Pasal 17",
    keywords: ["klasifikasi", "ketidakpahaman", "pelanggaran", "kerugian finansial"],
  },
  {
    id: "faq-046",
    no: 46,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Pelanggaran Ketentuan",
    question:
      "Dokumen apa yang diminta BI untuk pengaduan indikasi pelanggaran ketentuan?",
    answer:
      "Untuk pengaduan dengan klasifikasi indikasi pelanggaran terhadap Peraturan Bank Indonesia, BI Bicara dan/atau KPwDN dapat meminta Konsumen melengkapi fotokopi bukti identitas diri, fotokopi surat kuasa jika dikuasakan, kronologis kejadian, dan dokumen pendukung lainnya.",
    reference: "Pasal 18",
    keywords: ["dokumen", "pelanggaran", "identitas", "surat kuasa", "kronologis"],
  },
  {
    id: "faq-047",
    no: 47,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Kerugian Konsumen",
    question:
      "Apa syarat pengaduan kerugian finansial agar dapat ditindaklanjuti Bank Indonesia?",
    answer:
      "Pengaduan kerugian finansial dapat ditindaklanjuti jika Konsumen telah menyampaikan pengaduan kepada Penyelenggara namun tidak terdapat kesepakatan, permasalahan merupakan masalah perdata yang tidak pernah diproses oleh pengadilan atau lembaga penyelesaian sengketa lain, dan nilai kerugian sesuai batas yang ditentukan Bank Indonesia.",
    reference: "Pasal 19",
    keywords: ["syarat", "kerugian finansial", "perdata", "kesepakatan", "batas nilai"],
  },
  {
    id: "faq-048",
    no: 48,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Kerugian Konsumen",
    question:
      "Dokumen apa yang perlu dilengkapi untuk pengaduan kerugian finansial kepada Bank Indonesia?",
    answer:
      "Konsumen diminta melengkapi fotokopi bukti identitas diri, fotokopi bukti pengaduan ke Penyelenggara, fotokopi bukti transaksi, fotokopi surat kuasa jika dikuasakan, kronologis kejadian, dan surat pernyataan bermeterai cukup bahwa permasalahan merupakan masalah perdata yang belum diproses lembaga lain.",
    reference: "Pasal 19",
    keywords: ["dokumen", "kerugian finansial", "identitas", "bukti transaksi", "meterai", "kronologis"],
  },
  {
    id: "faq-049",
    no: 49,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Kerugian Konsumen",
    question: "Berapa batas nilai potensi kerugian finansial yang dapat ditangani?",
    answer:
      "Nilai potensi kerugian finansial paling banyak sebesar Rp500.000.000 untuk Penyelenggara di bidang Sistem Pembayaran, Penyelenggara Kegiatan Layanan Uang, dan pihak lain yang diatur dan diawasi Bank Indonesia, atau Rp2.500.000.000 untuk pelaku Pasar Uang dan Pasar Valuta Asing.",
    reference: "Pasal 19",
    keywords: ["batas nilai", "500 juta", "2.5 miliar", "pasar uang", "valas", "kerugian"],
  },
  {
    id: "faq-050",
    no: 50,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Apa yang dilakukan KPwDN dalam penanganan melalui konsultasi?",
    answer:
      "Dalam konsultasi, KPwDN dapat memberikan pemahaman kepada Konsumen dan Penyelenggara, meminta klarifikasi, melakukan analisis terhadap pengaduan, serta mengirimkan surat kepada Penyelenggara dan Konsumen berisi substansi pengaduan, permintaan tindak lanjut, dan usulan penyelesaian kepada Konsumen.",
    reference: "Pasal 23",
    keywords: ["KPwDN", "konsultasi", "klarifikasi", "analisis", "usulan penyelesaian"],
  },
  {
    id: "faq-051",
    no: 51,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Jika dilakukan konsultasi, apakah Penyelenggara wajib menindaklanjuti?",
    answer:
      "Dalam proses konsultasi, KPwDN dapat meminta Penyelenggara untuk meninjau kembali Pengaduan Konsumen dan menindaklanjuti hasil tinjauan tersebut dengan menyampaikan usulan penyelesaian kepada Konsumen paling lama 20 hari kerja sejak diterimanya surat dari Bank Indonesia.",
    reference: "Pasal 23",
    keywords: ["konsultasi", "penyelenggara", "20 hari kerja", "usulan penyelesaian"],
  },
  {
    id: "faq-052",
    no: 52,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Kapan Konsumen dapat meminta penanganan melalui fasilitasi?",
    answer:
      "Permintaan fasilitasi dapat dipenuhi KPwDN apabila Konsumen telah melalui proses konsultasi, memenuhi persyaratan administrasi yang ditetapkan Bank Indonesia, pengaduan belum pernah melalui proses fasilitasi, dan pengajuan fasilitasi dilakukan paling lama 60 hari kerja sejak surat tanggapan Penyelenggara diterima Konsumen.",
    reference: "Pasal 24",
    keywords: ["fasilitasi", "syarat", "konsultasi", "60 hari kerja", "KPwDN"],
  },
  {
    id: "faq-053",
    no: 53,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Apa yang terjadi jika permintaan fasilitasi tidak memenuhi syarat?",
    answer:
      "KPwDN dapat menolak permintaan fasilitasi apabila tidak memenuhi persyaratan yang ditentukan. Dalam hal permintaan fasilitasi ditolak, KPwDN menyusun memorandum berisi usulan penolakan fasilitasi dan menyampaikan surat kepada Konsumen terkait penolakan permintaan fasilitasi.",
    reference: "Pasal 24 dan Pasal 25",
    keywords: ["fasilitasi ditolak", "tidak memenuhi syarat", "KPwDN", "memorandum"],
  },
  {
    id: "faq-054",
    no: 54,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Apa yang dilakukan KPwDN jika permintaan fasilitasi disetujui?",
    answer:
      "Jika fasilitasi disetujui, KPwDN memastikan kelengkapan dokumen, menatausahakan pengaduan, menganalisis permintaan fasilitasi, melakukan klarifikasi dan konfirmasi rencana pelaksanaan, meminta persetujuan pimpinan, serta menyampaikan surat mengenai pelaksanaan fasilitasi kepada Konsumen dan Penyelenggara.",
    reference: "Pasal 26",
    keywords: ["fasilitasi disetujui", "KPwDN", "kelengkapan dokumen", "pelaksanaan"],
  },
  {
    id: "faq-055",
    no: 55,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Dokumen apa yang diperlukan untuk permintaan fasilitasi?",
    answer:
      "Permintaan fasilitasi diajukan secara tertulis dengan formulir pengajuan fasilitasi. Dokumen pendukung paling kurang mencakup fotokopi surat hasil penyelesaian pengaduan dari Penyelenggara, fotokopi identitas Konsumen, surat pernyataan bahwa permasalahan belum diproses lembaga lain, dan dokumen pendukung terkait permasalahan.",
    reference: "Pasal 27",
    keywords: ["dokumen fasilitasi", "formulir", "identitas", "surat pernyataan"],
  },
  {
    id: "faq-056",
    no: 56,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Apa prinsip yang harus dipatuhi Konsumen dan Penyelenggara saat fasilitasi?",
    answer:
      "Dalam fasilitasi, Konsumen dan Penyelenggara harus menyampaikan seluruh informasi penting, menjaga kerahasiaan informasi, memahami bahwa hasil fasilitasi merupakan kesepakatan atau ketidaksepakatan sukarela, tidak meminta pendapat atau jasa konsultasi hukum kepada KPwDN, serta menunjukkan itikad baik dan sikap kooperatif.",
    reference: "Pasal 29",
    keywords: ["prinsip fasilitasi", "kerahasiaan", "sukarela", "itikad baik"],
  },
  {
    id: "faq-057",
    no: 57,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Kapan proses fasilitasi berakhir?",
    answer:
      "Pelaksanaan fasilitasi berakhir jika telah tercapai hasil pelaksanaan fasilitasi, berakhirnya jangka waktu fasilitasi, dihentikan oleh KPwDN karena para pihak tidak menaati tata tertib yang disepakati, dan/atau Konsumen menyatakan mengundurkan diri dari proses fasilitasi.",
    reference: "Pasal 30",
    keywords: ["fasilitasi berakhir", "jangka waktu", "mengundurkan diri"],
  },
  {
    id: "faq-058",
    no: 58,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Sengketa dengan Lembaga Keuangan",
    question: "Apa yang terjadi jika fasilitasi tidak menghasilkan kesepakatan?",
    answer:
      "Apabila tidak terdapat kesepakatan dalam fasilitasi, para pihak dapat mengajukan upaya penyelesaian sengketa melalui lembaga alternatif penyelesaian sengketa (LAPS) di sektor keuangan atau pengadilan. Hasil fasilitasi bersifat final dan mengikat bagi Konsumen dan Penyelenggara jika dituangkan dalam berita acara.",
    reference: "Pasal 31",
    keywords: ["fasilitasi", "tidak sepakat", "LAPS", "pengadilan", "berita acara"],
  },
  {
    id: "faq-059",
    no: 59,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Ketidakpahaman Konsumen",
    question: "Berapa lama penyelesaian pengaduan karena ketidakpahaman Konsumen?",
    answer:
      "Penyelesaian penanganan pengaduan yang disebabkan oleh ketidakpahaman Konsumen dilakukan paling lama 5 hari kerja setelah tanggal penerimaan Pengaduan Konsumen diterima oleh Bank Indonesia. Konsumen sebaiknya menyampaikan informasi yang jelas agar edukasi dapat diberikan secara tepat.",
    reference: "Pasal 32",
    keywords: ["ketidakpahaman", "5 hari kerja", "batas waktu", "edukasi"],
  },
  {
    id: "faq-060",
    no: 60,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Pelanggaran Ketentuan",
    question:
      "Berapa lama penanganan pengaduan indikasi pelanggaran atau kerugian finansial?",
    answer:
      "Penyelesaian pengaduan terkait indikasi pelanggaran ketentuan atau kerugian finansial dilakukan paling lama 20 hari kerja setelah diterimanya pengaduan yang disertai dokumen pendukung. Dalam kondisi tertentu, jangka waktu dapat diperpanjang paling lama 20 hari kerja berikutnya.",
    reference: "Pasal 32",
    keywords: ["20 hari kerja", "batas waktu", "pelanggaran", "kerugian finansial", "perpanjangan"],
  },
  {
    id: "faq-061",
    no: 61,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Pelanggaran Ketentuan",
    question: "Apakah perpanjangan waktu penanganan akan diinformasikan kepada Konsumen?",
    answer:
      "Ya. Apabila terdapat kondisi tertentu sehingga jangka waktu penyelesaian pengaduan perlu diperpanjang, perpanjangan waktu penyelesaian tersebut diinformasikan oleh KPwDN kepada Konsumen sebelum batas waktu 20 hari kerja pertama berakhir.",
    reference: "Pasal 32",
    keywords: ["perpanjangan waktu", "20 hari kerja", "informasi", "KPwDN"],
  },
  {
    id: "faq-062",
    no: 62,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Ketidakpahaman Konsumen",
    question: "Bagaimana Bank Indonesia menggunakan data pengaduan untuk edukasi konsumen?",
    answer:
      "Data dan informasi pengaduan digunakan Bank Indonesia untuk analisis dan penyusunan statistik secara berkala. Hasilnya menjadi masukan untuk evaluasi dan penguatan kebijakan Pelindungan Konsumen, pelaksanaan edukasi dalam rangka peningkatan literasi Konsumen, pengawasan perilaku Penyelenggara, dan penyusunan laporan Pelindungan Konsumen.",
    reference: "Pasal 33",
    keywords: ["data pengaduan", "statistik", "edukasi", "literasi", "kebijakan"],
  },
  {
    id: "faq-063",
    no: 63,
    source: "PADGI Nomor 19 Tahun 2024",
    focus: "Ketidakpahaman Konsumen",
    question: "Mengapa Konsumen perlu menyampaikan data dan kronologis secara lengkap?",
    answer:
      "Data, kronologis, dan dokumen pendukung diperlukan agar BI Bicara atau KPwDN dapat menatausahakan pengaduan, melakukan reviu dan analisis, memastikan kelengkapan dokumen, serta menentukan bentuk penanganan yang sesuai, baik edukasi, konsultasi, maupun fasilitasi.",
    reference: "Pasal 13, Pasal 14, Pasal 18, dan Pasal 19",
    keywords: ["kronologis", "dokumen lengkap", "reviu", "analisis", "bentuk penanganan"],
  },
];

// Focus filter options. `value` matches the internal `focus` key stored in the
// data (kept stable for regulatory accuracy); `label` is the friendlier,
// customer-facing label shown in the UI.
export const FAQ_FOCUS_FILTERS: { value: string; label: string }[] = [
  { value: "Semua", label: "Semua" },
  { value: "Ketidakpahaman Konsumen", label: "Membutuhkan Penjelasan" },
  {
    value: "Sengketa dengan Lembaga Keuangan",
    label: "Sengketa dengan Lembaga Keuangan",
  },
  { value: "Pelanggaran Ketentuan", label: "Dugaan Pelanggaran Ketentuan" },
  { value: "Kerugian Konsumen", label: "Kerugian Konsumen" },
];

// Map an internal focus key to its customer-facing label.
export function focusLabel(focus: string): string {
  const match = FAQ_FOCUS_FILTERS.find((f) => f.value === focus);
  return match ? match.label : focus;
}

export function getFaqById(id: string): FAQItem | undefined {
  return FAQ_ITEMS.find((item) => item.id === id);
}
