"use client";

import { useEffect, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import type { AdminSettings, AuditEntry } from "@/types/admin";
import {
  getAudit,
  getSettings,
  resetStore,
  saveSettings,
} from "@/lib/adminStore";
import { getAuth } from "@/lib/auth";
import { DEFAULT_ADMIN_SETTINGS, PRIVACY_NOTE } from "@/data/adminConfig";
import AuditTrail from "@/components/admin/AuditTrail";

const INPUT_CLS =
  "w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm text-headlineBlack focus-visible:border-navyCore";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(
    DEFAULT_ADMIN_SETTINGS
  );
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [saved, setSaved] = useState(false);
  const actor = getAuth()?.email ?? "admin";

  useEffect(() => {
    const load = () => {
      setSettings(getSettings());
      setAudit(getAudit());
    };
    load();
    window.addEventListener("sp-admin-change", load);
    return () => window.removeEventListener("sp-admin-change", load);
  }, []);

  const handleSave = () => {
    saveSettings(settings, actor);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Atur ulang seluruh data prototipe (FAQ, formulir, interaksi, pengaturan) ke kondisi awal?"
      )
    ) {
      resetStore();
      setSettings(getSettings());
      setAudit(getAudit());
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-headlineBlack">Pengaturan</h1>
          <p className="mt-1 text-sm text-bodyTextGray">
            Kelola konfigurasi dashboard, unit, kategori, tautan CTA, dan
            informasi kontak.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-subtle border border-hairlineDivider px-4 py-2 text-sm font-semibold text-bodyTextGray hover:bg-offWhiteSection"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset Data Prototipe
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-subtle bg-navyCore px-4 py-2 text-sm font-semibold text-white hover:bg-navyDeep"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Simpan
          </button>
        </div>
      </header>

      {saved ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
          Pengaturan tersimpan.
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Profile */}
        <Section title="Profil Admin">
          <Labeled label="Nama">
            <input
              value={settings.profileName}
              onChange={(e) =>
                setSettings((s) => ({ ...s, profileName: e.target.value }))
              }
              className={INPUT_CLS}
            />
          </Labeled>
          <Labeled label="Email">
            <input
              value={settings.profileEmail}
              onChange={(e) =>
                setSettings((s) => ({ ...s, profileEmail: e.target.value }))
              }
              className={INPUT_CLS}
            />
          </Labeled>
        </Section>

        {/* CTA links */}
        <Section title="Tautan CTA">
          <Labeled label="BI Bicara URL">
            <input
              value={settings.links.biBicara}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  links: { ...s.links, biBicara: e.target.value },
                }))
              }
              className={INPUT_CLS}
            />
          </Labeled>
          <Labeled label="LAPS SJK URL">
            <input
              value={settings.links.lapsSjk}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  links: { ...s.links, lapsSjk: e.target.value },
                }))
              }
              className={INPUT_CLS}
            />
          </Labeled>
          <Labeled label="Cek Daftar Penyelenggara URL">
            <input
              value={settings.links.cekPenyelenggara}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  links: { ...s.links, cekPenyelenggara: e.target.value },
                }))
              }
              className={INPUT_CLS}
            />
          </Labeled>
        </Section>

        {/* Units */}
        <Section title="Daftar Unit (satu per baris)">
          <textarea
            value={settings.units.join("\n")}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                units: e.target.value.split("\n").map((u) => u.trim()).filter(Boolean),
              }))
            }
            rows={7}
            className={INPUT_CLS}
          />
        </Section>

        {/* Categories */}
        <Section title="Daftar Kategori (satu per baris)">
          <textarea
            value={settings.categories.join("\n")}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                categories: e.target.value
                  .split("\n")
                  .map((c) => c.trim())
                  .filter(Boolean),
              }))
            }
            rows={5}
            className={INPUT_CLS}
          />
        </Section>

        {/* Hero */}
        <Section title="Aset & Hero">
          <Labeled label="Path Background Hero">
            <input
              value={settings.heroBackgroundPath}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  heroBackgroundPath: e.target.value,
                }))
              }
              className={INPUT_CLS}
            />
          </Labeled>
        </Section>

        {/* Contact */}
        <Section title="Informasi Kontak / Footer">
          <Labeled label="Nama Kantor">
            <input
              value={settings.contact.officeName}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  contact: { ...s.contact, officeName: e.target.value },
                }))
              }
              className={INPUT_CLS}
            />
          </Labeled>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Alamat">
              <input
                value={settings.contact.address}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    contact: { ...s.contact, address: e.target.value },
                  }))
                }
                className={INPUT_CLS}
              />
            </Labeled>
            <Labeled label="Kota, Kode Pos">
              <input
                value={settings.contact.cityPostal}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    contact: { ...s.contact, cityPostal: e.target.value },
                  }))
                }
                className={INPUT_CLS}
              />
            </Labeled>
            <Labeled label="Telp">
              <input
                value={settings.contact.phone}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    contact: { ...s.contact, phone: e.target.value },
                  }))
                }
                className={INPUT_CLS}
              />
            </Labeled>
            <Labeled label="Fax">
              <input
                value={settings.contact.fax}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    contact: { ...s.contact, fax: e.target.value },
                  }))
                }
                className={INPUT_CLS}
              />
            </Labeled>
          </div>
        </Section>
      </div>

      <p className="text-xs text-captionGray">{PRIVACY_NOTE}</p>

      {/* Audit trail */}
      <div className="rounded-xl border border-hairlineDivider bg-white p-5 shadow-card">
        <h3 className="text-sm font-bold text-headlineBlack">
          Riwayat Perubahan
        </h3>
        <p className="mt-1 text-xs text-captionGray">
          Audit trail perubahan konten FAQ, formulir, rerouting, dan pengaturan.
        </p>
        <div className="mt-3">
          <AuditTrail entries={audit} limit={50} />
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-hairlineDivider bg-white p-5 shadow-card">
      <h2 className="text-sm font-bold text-headlineBlack">{title}</h2>
      {children}
    </div>
  );
}

function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-captionGray">
        {label}
      </label>
      {children}
    </div>
  );
}
