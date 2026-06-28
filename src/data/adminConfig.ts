import type { AdminSettings } from "@/types/admin";
import { EXTERNAL_LINKS } from "@/data/links";

// Demo credential for the prototype's mock authentication.
export const DEMO_CREDENTIAL = {
  email: "admin@sulutprotect.local",
  password: "admin123",
};

// Internal KPwBI Sulut units used for rerouting (section 20).
export const ADMIN_UNITS: string[] = [
  "Sistem Pembayaran",
  "Perlindungan Konsumen",
  "Komunikasi",
  "Data dan Statistik",
  "Moneter / Ekonomi Regional",
  "Perizinan / Pengawasan",
  "Unit Lainnya",
];

// Public-facing complaint categories (friendly labels).
export const ADMIN_CATEGORIES: string[] = [
  "Membutuhkan Penjelasan",
  "Sengketa dengan Lembaga Keuangan",
  "Dugaan Pelanggaran Ketentuan",
  "Kerugian Konsumen",
];

// Cities/regencies in Sulawesi Utara used for the location distribution mock.
export const SULUT_LOCATIONS: string[] = [
  "Kota Manado",
  "Kota Bitung",
  "Kota Tomohon",
  "Kota Kotamobagu",
  "Kab. Minahasa",
  "Kab. Minahasa Utara",
  "Kab. Minahasa Selatan",
  "Kab. Minahasa Tenggara",
  "Kab. Bolaang Mongondow",
  "Kab. Kepulauan Sangihe",
  "Kab. Kepulauan Talaud",
];

export const AGE_RANGES = ["17-25", "26-35", "36-45", "46-55", "56+"];
export const GENDERS = ["Laki-laki", "Perempuan"];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  profileName: "Administrator KPwBI Sulut",
  profileEmail: DEMO_CREDENTIAL.email,
  units: ADMIN_UNITS,
  categories: ADMIN_CATEGORIES,
  links: {
    biBicara: EXTERNAL_LINKS.biBicara,
    lapsSjk: EXTERNAL_LINKS.lapsSjk,
    cekPenyelenggara: EXTERNAL_LINKS.cekPenyelenggara,
  },
  heroBackgroundPath: "/images/hero-background.jpg",
  contact: {
    officeName: "Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Utara",
    address: "Jl. 17 Agustus No. 56",
    cityPostal: "Manado, 95117",
    phone: "(0431) 866933",
    fax: "(0431) 868102",
  },
};

export const PRIVACY_NOTE =
  "Data pada prototipe ini digunakan untuk simulasi monitoring dan tidak memuat data pribadi Konsumen.";
