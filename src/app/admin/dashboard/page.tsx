"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  Layers,
  Share2,
  Phone,
  Scale,
  ShieldAlert,
  MapPin,
} from "lucide-react";
import type { AuditEntry, InteractionRecord } from "@/types/admin";
import { getAudit, getInteractions } from "@/lib/adminStore";
import {
  byAgeRange,
  byCategory,
  byChannel,
  byGender,
  byLocation,
  byResult,
  dailyTrend,
  reroutingByUnit,
  summarize,
  unansweredQuestions,
} from "@/data/mockDashboard";
import { PRIVACY_NOTE } from "@/data/adminConfig";
import { APIS_NAME } from "@/data/apis";
import StatCard from "@/components/admin/StatCard";
import AuditTrail from "@/components/admin/AuditTrail";
import {
  BarChart,
  ChartCard,
  DonutChart,
  LineChart,
} from "@/components/admin/Charts";

export default function AdminDashboardPage() {
  const [records, setRecords] = useState<InteractionRecord[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  useEffect(() => {
    const load = () => {
      setRecords(getInteractions());
      setAudit(getAudit());
    };
    load();
    window.addEventListener("sp-admin-change", load);
    return () => window.removeEventListener("sp-admin-change", load);
  }, []);

  const stats = summarize(records);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-headlineBlack">
          Dashboard Monitoring Terintegrasi
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-bodyTextGray">
          Pantau interaksi pengaduan, tren kategori, kanal tindak lanjut, dan
          kebutuhan rerouting antarunit KPwBI Sulawesi Utara.
        </p>
        <p className="mt-2 text-xs text-captionGray">{PRIVACY_NOTE}</p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Interaksi" value={stats.total} icon={Activity} />
        <StatCard
          label="Interaksi Hari Ini"
          value={stats.today}
          icon={CalendarDays}
        />
        <StatCard
          label="Kategori Terbanyak"
          value={stats.topCategory}
          icon={Layers}
        />
        <StatCard
          label="Perlu Rerouting"
          value={stats.needRerouting}
          icon={Share2}
          tone="warning"
        />
        <StatCard
          label="Diarahkan ke BI Bicara"
          value={stats.biBicara}
          icon={Phone}
          tone="positive"
        />
        <StatCard
          label="Diarahkan ke LAPS SJK"
          value={stats.lapsSjk}
          icon={Scale}
        />
        <StatCard
          label="Di Luar Kewenangan BI"
          value={stats.outsideBI}
          icon={ShieldAlert}
          tone="warning"
        />
        <StatCard
          label="Lokasi Terpantau"
          value={byLocation(records).length}
          icon={MapPin}
        />
      </div>

      {/* Trend */}
      <ChartCard
        title="Tren Interaksi Harian"
        description="Jumlah interaksi selama 14 hari terakhir."
      >
        <LineChart data={dailyTrend(records, 14)} />
      </ChartCard>

      {/* Distributions */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Distribusi Kategori Pengaduan">
          <DonutChart data={byCategory(records)} />
        </ChartCard>
        <ChartCard title="Distribusi Kanal Interaksi">
          <BarChart data={byChannel(records)} />
        </ChartCard>
        <ChartCard title="Distribusi Rekomendasi Kanal">
          <BarChart data={byResult(records)} />
        </ChartCard>
        <ChartCard
          title="Sebaran Lokasi Pengadu"
          description="Placeholder visualisasi geospasial — data lokasi (mock) per kota/kabupaten."
        >
          <BarChart data={byLocation(records)} />
        </ChartCard>
        <ChartCard
          title="Ringkasan Demografi — Rentang Usia"
          description="Data mock, tidak memuat identitas Konsumen."
        >
          <BarChart data={byAgeRange(records)} />
        </ChartCard>
        <ChartCard title="Ringkasan Demografi — Jenis Kelamin">
          <DonutChart data={byGender(records)} />
        </ChartCard>
        <ChartCard
          title="Status Rerouting per Unit"
          description="Distribusi penugasan ke unit internal KPwBI Sulut."
        >
          <BarChart data={reroutingByUnit(records)} />
        </ChartCard>
        <ChartCard
          title="Pertanyaan Belum Terjawab"
          description={`Pertanyaan ke ${APIS_NAME} yang tidak ditemukan di FAQ (kandidat FAQ baru).`}
        >
          <BarChart data={unansweredQuestions(records)} />
        </ChartCard>
      </div>

      {/* Recent audit */}
      <div className="rounded-xl border border-hairlineDivider bg-white p-5 shadow-card">
        <h3 className="text-sm font-bold text-headlineBlack">
          Riwayat Perubahan Terbaru
        </h3>
        <div className="mt-3">
          <AuditTrail entries={audit} limit={6} />
        </div>
      </div>
    </div>
  );
}
