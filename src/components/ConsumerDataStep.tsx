"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import ProvinceCombobox from "@/components/ProvinceCombobox";
import type { ConsumerData } from "@/types/guidedForm";

const EMPTY: ConsumerData = {
  nama: "",
  telepon: "",
  provinsi: "",
  kotaKabupaten: "",
  email: "",
};

function isValidEmail(value: string): boolean {
  if (!value.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

type ConsumerDataStepProps = {
  value: ConsumerData;
  onChange: (next: ConsumerData) => void;
  onContinue: () => void;
};

export default function ConsumerDataStep({
  value,
  onChange,
  onContinue,
}: ConsumerDataStepProps) {
  const [touched, setTouched] = useState(false);

  const errors = {
    nama: !value.nama.trim() ? "Nama wajib diisi." : "",
    telepon: !value.telepon.trim() ? "Nomor telepon wajib diisi." : "",
    provinsi: !value.provinsi ? "Pilih provinsi terlebih dahulu." : "",
    kotaKabupaten: !value.kotaKabupaten.trim()
      ? "Kota/Kabupaten wajib diisi."
      : "",
    email:
      value.email.trim() && !isValidEmail(value.email)
        ? "Format email tidak valid."
        : "",
  };

  const isValid =
    !errors.nama &&
    !errors.telepon &&
    !errors.provinsi &&
    !errors.kotaKabupaten &&
    !errors.email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isValid) onContinue();
  };

  const fieldClass =
    "w-full rounded-subtle border border-hairlineDivider px-3 py-2.5 text-sm text-headlineBlack placeholder:text-captionGray focus-visible:border-navyCore";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-headlineBlack">
          Data Awal Konsumen
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-bodyTextGray">
          Isi data berikut sebelum melanjutkan ke Formulir Panduan Pengaduan.
          Data ini digunakan untuk membantu proses pencatatan dan simulasi arahan
          pengaduan.
        </p>
      </div>

      <div>
        <label htmlFor="konsumen-nama" className="mb-1.5 block text-sm font-medium">
          Nama (Sesuai KTP) <span className="text-accentRed">*</span>
        </label>
        <input
          id="konsumen-nama"
          type="text"
          value={value.nama}
          onChange={(e) => onChange({ ...value, nama: e.target.value })}
          className={fieldClass}
          autoComplete="name"
          required
        />
        {touched && errors.nama ? (
          <p className="mt-1 text-sm text-accentRed">{errors.nama}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="konsumen-telepon"
          className="mb-1.5 block text-sm font-medium"
        >
          Nomor Telepon <span className="text-accentRed">*</span>
        </label>
        <input
          id="konsumen-telepon"
          type="tel"
          value={value.telepon}
          onChange={(e) => onChange({ ...value, telepon: e.target.value })}
          className={fieldClass}
          autoComplete="tel"
          required
        />
        {touched && errors.telepon ? (
          <p className="mt-1 text-sm text-accentRed">{errors.telepon}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="konsumen-provinsi"
          className="mb-1.5 block text-sm font-medium"
        >
          Provinsi <span className="text-accentRed">*</span>
        </label>
        <ProvinceCombobox
          id="konsumen-provinsi"
          value={value.provinsi}
          onChange={(prov) => onChange({ ...value, provinsi: prov })}
          onBlur={() => setTouched(true)}
          invalid={touched && Boolean(errors.provinsi)}
        />
        {touched && errors.provinsi ? (
          <p className="mt-1 text-sm text-accentRed">{errors.provinsi}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="konsumen-kota"
          className="mb-1.5 block text-sm font-medium"
        >
          Kota/Kabupaten <span className="text-accentRed">*</span>
        </label>
        <input
          id="konsumen-kota"
          type="text"
          value={value.kotaKabupaten}
          onChange={(e) =>
            onChange({ ...value, kotaKabupaten: e.target.value })
          }
          className={fieldClass}
          required
        />
        {touched && errors.kotaKabupaten ? (
          <p className="mt-1 text-sm text-accentRed">{errors.kotaKabupaten}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="konsumen-email" className="mb-1.5 block text-sm font-medium">
          Email <span className="text-captionGray">(Opsional)</span>
        </label>
        <input
          id="konsumen-email"
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className={fieldClass}
          autoComplete="email"
        />
        {touched && errors.email ? (
          <p className="mt-1 text-sm text-accentRed">{errors.email}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-subtle bg-navyCore px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navyDeep"
      >
        Lanjut ke Formulir
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}

export { EMPTY as EMPTY_CONSUMER_DATA };
