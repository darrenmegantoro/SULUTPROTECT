import { HelpCircle, Scale, ShieldAlert, Wallet } from "lucide-react";

// Four complaint category cards (educational reference).
const CATEGORIES = [
  {
    icon: HelpCircle,
    title: "Membutuhkan Penjelasan",
    description:
      "Untuk pertanyaan terkait produk, layanan, ketentuan, biaya, proses, atau mekanisme pengaduan. Kategori ini membantu Konsumen memperoleh penjelasan yang lebih mudah dipahami.",
  },
  {
    icon: Scale,
    title: "Sengketa dengan Lembaga Keuangan",
    description:
      "Untuk permasalahan yang sudah disampaikan kepada Penyelenggara, tetapi belum terdapat kesepakatan atas penyelesaian yang diberikan.",
  },
  {
    icon: ShieldAlert,
    title: "Dugaan Pelanggaran Ketentuan",
    description:
      "Untuk dugaan pelanggaran terhadap ketentuan Bank Indonesia yang dilakukan oleh Penyelenggara.",
  },
  {
    icon: Wallet,
    title: "Kerugian Konsumen",
    description:
      "Untuk kerugian finansial atau potensi kerugian finansial yang wajar dan berdampak langsung kepada Konsumen.",
  },
];

export default function ComplaintCategories() {
  return (
    <section className="bg-offWhiteSection py-14 sm:py-16">
      <div className="container-bi">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-headlineBlack sm:text-[26px]">
            Kategori Pengaduan
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-bodyTextGray">
            Kenali kategori pengaduan untuk membantu Anda memahami bentuk
            penanganan yang umum diberikan dan kanal yang sesuai.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="flex flex-col rounded-xl border border-hairlineDivider bg-white p-6 shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navyCore/30 text-navyCore">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-headlineBlack">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bodyTextGray">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
