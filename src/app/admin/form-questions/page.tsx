"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, ExternalLink, AlertTriangle } from "lucide-react";
import type { AdminFormQuestion, ContentStatus } from "@/types/admin";
import { getFormQuestions } from "@/lib/adminStore";
import { getAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import FormQuestionEditor from "@/components/admin/FormQuestionEditor";

const STATUS_STYLE: Record<ContentStatus, string> = {
  Draft: "bg-amber-100 text-amber-700",
  Published: "bg-emerald-100 text-emerald-700",
  Archived: "bg-offWhiteSection text-bodyTextGray",
};

export default function AdminFormQuestionsPage() {
  const [questions, setQuestions] = useState<AdminFormQuestion[]>([]);
  const [editing, setEditing] = useState<AdminFormQuestion | null>(null);
  const actor = getAuth()?.email ?? "admin";

  useEffect(() => {
    const load = () => setQuestions(getFormQuestions());
    load();
    window.addEventListener("sp-admin-change", load);
    return () => window.removeEventListener("sp-admin-change", load);
  }, []);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-headlineBlack">
            Kelola Formulir
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-bodyTextGray">
            Revisi teks pertanyaan, opsi, dan bantuan pada Formulir Panduan
            Pengaduan. Logika triase tetap dipertahankan.
          </p>
        </div>
        <Link
          href="/formulir-panduan-pengaduan"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-subtle border border-navyCore px-4 py-2 text-sm font-semibold text-navyCore transition-colors hover:bg-offWhiteSection"
        >
          Pratinjau Alur
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </header>

      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Perubahan pertanyaan dapat memengaruhi pemahaman Konsumen. Pastikan
        perubahan tetap sesuai ketentuan yang berlaku.
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div
            key={q.id}
            className="rounded-xl border border-hairlineDivider bg-white p-5 shadow-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-navyCore/10 px-2.5 py-0.5 text-[11px] font-semibold text-navyCore">
                    Langkah {q.stepNumber}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      STATUS_STYLE[q.status]
                    )}
                  >
                    {q.status}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      q.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-offWhiteSection text-bodyTextGray"
                    )}
                  >
                    {q.active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-headlineBlack">
                  {q.questionText}
                </h3>
                {q.helperText ? (
                  <p className="mt-1 text-xs text-bodyTextGray">{q.helperText}</p>
                ) : null}
                {q.options && q.options.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {q.options.map((o) => (
                      <li
                        key={o.value}
                        className="rounded-full border border-hairlineDivider px-2.5 py-0.5 text-[11px] text-bodyTextGray"
                      >
                        {o.label}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setEditing(q)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-navyCore px-3 py-1.5 text-xs font-semibold text-navyCore hover:bg-offWhiteSection"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <FormQuestionEditor
          question={editing}
          actor={actor}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}
