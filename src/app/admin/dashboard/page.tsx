"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  CalendarRange,
  Layers,
  MapPin,
  Phone,
  ShieldAlert,
  Sun,
} from "lucide-react";
import type { InteractionRecord } from "@/types/interactions";
import { getInteractions, resetInteractions, subscribeToInteractionChanges } from "@/lib/interactionStore";
import {
  categoryDistribution,
  computeDashboardKpis,
  provinceDistribution,
} from "@/lib/dashboardMetrics";
import StatCard from "@/components/admin/StatCard";
import { ChartCard, DonutChart } from "@/components/admin/Charts";

const LOCAL_STORAGE_NOTE =
  "Catatan: Dashboard ini menggunakan penyimpanan lokal browser untuk prototipe. Data yang ditampilkan merupakan data riil dari interaksi pada browser dan domain yang sama. Data tidak tersinkronisasi antarperangkat atau antarpengguna.";

export default function AdminDashboardPage() {
  const [records, setRecords] = useState<InteractionRecord[]>([]);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    const load = () => setRecords(getInteractions());
    load();
    return subscribeToInteractionChanges(load);
  }, []);

  const kpis = computeDashboardKpis(records);
  const categoryData = categoryDistribution(records);
  const provinceData = provinceDistribution(records);

  const handleResetDashboard = () => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus seluruh data interaksi dashboard pada browser ini? Tindakan ini tidak dapat dibatalkan."
    );
    if (!confirmed) return;
    resetInteractions();
    setRecords([]);
    setResetMessage("Data dashboard berhasil direset.");
    window.setTimeout(() => setResetMessage(""), 4000);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-headlineBlack">
          Dashboard Monitoring Terintegrasi
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-bodyTextGray">
          Pantau data Formulir Panduan Pengaduan, distribusi kategori, lokasi
          pengadu, dan arahan tindak lanjut berdasarkan data yang dikumpulkan
          dari website.
        </p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs leading-relaxed text-amber-900">
            {LOCAL_STORAGE_NOTE}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResetDashboard}
              className="rounded-subtle border border-hairlineDivider bg-white px-3 py-1.5 text-xs font-semibold text-bodyTextGray hover:bg-offWhiteSection"
            >
              Reset Data Dashboard
            </button>
            {resetMessage ? (
              <span className="text-xs font-semibold text-emerald-700">
                {resetMessage}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Interaksi"
          value={kpis.totalInteraksi}
          icon={Activity}
        />
        <StatCard
          label="Total Interaksi Tahun Ini"
          value={kpis.totalTahunIni}
          icon={CalendarRange}
        />
        <StatCard
          label="Total Interaksi Bulan Ini"
          value={kpis.totalBulanIni}
          icon={CalendarDays}
        />
        <StatCard
          label="Total Interaksi Hari Ini"
          value={kpis.totalHariIni}
          icon={Sun}
        />
        <StatCard
          label="Kategori Terbanyak"
          value={kpis.kategoriTerbanyak}
          icon={Layers}
        />
        <StatCard
          label="Lokasi Terpantau"
          value={kpis.lokasiTerpantau}
          icon={MapPin}
        />
        <StatCard
          label="Di Luar Kewenangan BI"
          value={kpis.diLuarKewenanganBi}
          icon={ShieldAlert}
          tone="warning"
        />
        <StatCard
          label="Diarahkan ke BI BICARA"
          value={kpis.diarahkanKeBiBicara}
          icon={Phone}
          tone="positive"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Distribusi Kategori Pengaduan">
          {categoryData.length > 0 ? (
            <DonutChart data={categoryData} />
          ) : (
            <p className="text-sm text-captionGray">
              Belum ada data kategori pengaduan.
            </p>
          )}
        </ChartCard>
        <ChartCard title="Data Sebaran Lokasi Pengadu">
          {provinceData.length > 0 ? (
            <DonutChart data={provinceData} />
          ) : (
            <p className="text-sm text-captionGray">
              Belum ada data lokasi pengadu.
            </p>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
