import type { Metadata } from "next";
import FormulirPanduanPengaduan from "@/components/FormulirPanduanPengaduan";

export const metadata: Metadata = {
  title: "Formulir Panduan Pengaduan — SULUT PROTECT",
  description:
    "Jawab beberapa pertanyaan untuk mengetahui langkah pengaduan dan kanal tindak lanjut yang sesuai.",
};

export default function FormulirPanduanPengaduanPage() {
  return <FormulirPanduanPengaduan />;
}
