"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pencil, RotateCcw } from "lucide-react";
import { captureInteraction } from "@/lib/interactionCapture";
import {
  GUIDED_QUESTIONS,
  GUIDED_RESULTS,
  LOSS_THRESHOLD,
  TIME_LIMIT_CALENDAR_DAYS,
  TOTAL_STEPS,
} from "@/data/guidedForm";
import type {
  GuidedAnswers,
  GuidedQuestion,
  QuestionId,
  ResultKey,
} from "@/types/guidedForm";
import {
  calendarDaysSinceDmy,
  cn,
  formatRupiah,
  isValidDmy,
  maskDmy,
  parseRupiah,
} from "@/lib/utils";
import ResultCard from "./ResultCard";

type Transition = { question: QuestionId } | { result: ResultKey };

function getQuestion(id: QuestionId): GuidedQuestion {
  return GUIDED_QUESTIONS.find((q) => q.id === id) as GuidedQuestion;
}

// Branching logic (section 12 of the brief).
function getTransition(id: QuestionId, value: string): Transition {
  switch (id) {
    case "q1":
      return value === "ketidakpahaman" ? { result: "A" } : { question: "q2" };
    case "q2":
      if (value === "ya") return { question: "q3" };
      if (value === "tidak") return { result: "B" };
      return { result: "C" };
    case "q3":
      return value === "ya" ? { question: "q4" } : { result: "D" };
    case "q4": {
      const days = calendarDaysSinceDmy(value);
      return days <= TIME_LIMIT_CALENDAR_DAYS
        ? { question: "q5" }
        : { result: "E" };
    }
    case "q5":
      if (value === "ya") return { question: "q6" };
      if (value === "tidak") return { result: "F" };
      return { result: "G" };
    case "q6":
      return value === "tidak" ? { question: "q7" } : { result: "H" };
    case "q7":
      return value === "tidak" ? { question: "q8" } : { result: "I" };
    case "q8": {
      const amount = parseRupiah(value);
      return amount <= LOSS_THRESHOLD ? { result: "J" } : { result: "K" };
    }
    default:
      return { result: "G" };
  }
}

type PathStep = { id: QuestionId; value: string };

type Flow = {
  path: PathStep[];
  currentId: QuestionId | null;
  resultKey: ResultKey | null;
};

// Replay the stored answers from q1 to derive the answered path, the next
// unanswered question, and/or the final result. Recomputing from scratch makes
// editing previous answers safe and predictable.
function computeFlow(answers: GuidedAnswers): Flow {
  let id: QuestionId = "q1";
  const path: PathStep[] = [];
  for (let i = 0; i <= GUIDED_QUESTIONS.length; i += 1) {
    const value = answers[id];
    if (value === undefined) {
      return { path, currentId: id, resultKey: null };
    }
    path.push({ id, value });
    const transition = getTransition(id, value);
    if ("result" in transition) {
      return { path, currentId: null, resultKey: transition.result };
    }
    id = transition.question;
  }
  return { path, currentId: null, resultKey: null };
}

// Human-readable label for a stored answer (used in the "Jawaban Anda" panel).
function answerLabel(id: QuestionId, value: string): string {
  const q = getQuestion(id);
  if (q.kind === "choice") {
    return q.options?.find((o) => o.value === value)?.label ?? value;
  }
  if (q.kind === "date") {
    // Stored as dd/mm/yyyy; display as entered.
    return value;
  }
  if (q.kind === "number") {
    return formatRupiah(parseRupiah(value));
  }
  return value;
}

// Normalized recommendation per result, aligned with the dashboard vocabulary.
const RESULT_RECOMMENDATION: Record<ResultKey, string> = {
  A: "Diarahkan ke BI Bicara",
  B: "Di Luar Kewenangan BI",
  C: "Perlu pengecekan kewenangan",
  D: "Perlu disampaikan ke Penyelenggara",
  E: "Melewati batas waktu",
  F: "Perlu berupa masalah perdata",
  G: "Perlu penelaahan awal",
  H: "Sudah diproses pihak lain",
  I: "Diarahkan ke LAPS SJK",
  J: "Diarahkan ke BI Bicara",
  K: "Diarahkan ke LAPS SJK",
};

const Q1_CATEGORY: Record<string, string> = {
  ketidakpahaman: "Membutuhkan Penjelasan",
  sengketa: "Sengketa dengan Lembaga Keuangan",
  pelanggaran: "Dugaan Pelanggaran Ketentuan",
  kerugian: "Kerugian Konsumen",
};

const INTRO_TEXT =
  "Kami bantu arahkan pengaduan Anda melalui Formulir Panduan Pengaduan. Formulir ini membantu Anda memahami langkah yang perlu dilakukan sebelum menyampaikan pengaduan. Dengan menjawab beberapa pertanyaan, Anda dapat mengetahui apakah pengaduan memenuhi persyaratan awal untuk ditindaklanjuti oleh Bank Indonesia atau perlu diarahkan ke kanal lain. Hasil Formulir Panduan Pengaduan bersifat edukatif dan membantu proses triase awal. Penanganan pengaduan tetap dilakukan berdasarkan penelaahan, kelengkapan dokumen, dan ketentuan yang berlaku.";

export default function FormulirPanduanPengaduan() {
  const [answers, setAnswers] = useState<GuidedAnswers>({});
  const [started, setStarted] = useState(false);
  const [editingId, setEditingId] = useState<QuestionId | null>(null);
  const [draft, setDraft] = useState("");

  const { path, currentId, resultKey } = useMemo(
    () => computeFlow(answers),
    [answers]
  );

  // The question currently shown: the one being edited, otherwise the next one.
  const displayedId: QuestionId | null = editingId ?? currentId;

  // Capture a privacy-safe interaction record once per reached result.
  const capturedRef = useRef<ResultKey | null>(null);
  useEffect(() => {
    if (resultKey && !editingId && capturedRef.current !== resultKey) {
      capturedRef.current = resultKey;
      captureInteraction({
        channel: "Formulir",
        category: answers.q1 ? Q1_CATEGORY[answers.q1] : undefined,
        query: "Formulir Panduan Pengaduan",
        answerSummary: path.map(
          (s) => `${getQuestion(s.id).question}: ${answerLabel(s.id, s.value)}`
        ),
        resultRecommendation: RESULT_RECOMMENDATION[resultKey],
      });
    }
    if (!resultKey) capturedRef.current = null;
  }, [resultKey, editingId, answers, path]);

  // Keep the working draft in sync with whichever question is displayed.
  useEffect(() => {
    setDraft(displayedId ? answers[displayedId] ?? "" : "");
  }, [displayedId, answers]);

  const displayedQuestion = displayedId ? getQuestion(displayedId) : null;

  const isDraftValid = (() => {
    if (!displayedQuestion) return false;
    if (displayedQuestion.kind === "number") return parseRupiah(draft) > 0;
    if (displayedQuestion.kind === "date") return isValidDmy(draft);
    return draft.trim().length > 0;
  })();

  const handleContinue = () => {
    const targetId = editingId ?? currentId;
    if (!targetId || !isDraftValid) return;

    const prevValue = answers[targetId];
    const nextAnswers: GuidedAnswers = { ...answers, [targetId]: draft };

    // When editing an earlier answer to a new value, clear downstream answers
    // that are no longer valid so the flow recalculates from this point.
    if (editingId && draft !== prevValue) {
      const idx = path.findIndex((p) => p.id === editingId);
      if (idx >= 0) {
        path.slice(idx + 1).forEach((p) => {
          delete nextAnswers[p.id];
        });
      }
    }

    setAnswers(nextAnswers);
    setEditingId(null);
  };

  const handleBack = () => {
    if (editingId) {
      setEditingId(null);
      return;
    }
    if (path.length > 0) {
      setEditingId(path[path.length - 1].id);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setEditingId(null);
    setDraft("");
    setStarted(true);
  };

  const handleEdit = (id: QuestionId) => setEditingId(id);

  const canGoBack = editingId !== null || path.length > 0;

  const progressStep = displayedQuestion?.step ?? TOTAL_STEPS;
  const progress = Math.round((progressStep / TOTAL_STEPS) * 100);

  // "Jawaban Anda" summary panel — always rendered (top of the flow) once the
  // form has started, with an empty state before the first answer.
  const answerSummary = (
    <div className="rounded-xl border border-hairlineDivider bg-white p-5 shadow-card">
      <h3 className="text-sm font-bold uppercase tracking-wide text-navyCore">
        Jawaban Anda
      </h3>
      {path.length === 0 ? (
        <p className="mt-2 text-sm text-bodyTextGray">Belum ada jawaban.</p>
      ) : (
        <ul className="mt-3 divide-y divide-hairlineDivider">
          {path.map((step) => {
            const q = getQuestion(step.id);
            const isEditing = editingId === step.id;
            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-start justify-between gap-3 py-3",
                  isEditing && "rounded-md bg-navyCore/5 px-2"
                )}
              >
                <div className="min-w-0">
                  <p className="text-xs text-captionGray">{q.question}</p>
                  <p className="mt-0.5 text-sm font-semibold text-headlineBlack">
                    {answerLabel(step.id, step.value)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleEdit(step.id)}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-linkBlue hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Ubah
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <button
        type="button"
        onClick={handleReset}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-captionGray transition-colors hover:text-bodyTextGray"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Mulai Ulang
      </button>
    </div>
  );

  return (
    <section id="formulir" className="bg-offWhiteSection py-12 sm:py-16">
      <div className="container-bi max-w-3xl">
        {/* Integrated page intro (no separate side box) */}
        <h1 className="text-2xl font-bold text-headlineBlack sm:text-[28px]">
          Formulir Panduan Pengaduan
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-bodyTextGray">
          Jawab beberapa pertanyaan untuk mengetahui apakah pengaduan dapat
          dilanjutkan ke Bank Indonesia, perlu disampaikan terlebih dahulu kepada
          Penyelenggara, atau lebih tepat diarahkan ke lembaga lain.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-bodyTextGray">
          {INTRO_TEXT}
        </p>

        {!started ? (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-subtle bg-navyCore px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navyDeep"
          >
            Mulai Formulir Panduan Pengaduan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Jawaban Anda always sits at the top of the flow. */}
            {answerSummary}

            {/* Result/education view */}
            {resultKey && !editingId ? (
              <ResultCard result={GUIDED_RESULTS[resultKey]} />
            ) : null}

            {/* Question view (active or editing) */}
            {displayedQuestion ? (
              <>
                <div className="rounded-xl border border-hairlineDivider bg-white p-6 shadow-card sm:p-7">
                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-captionGray">
                      <span>
                        Langkah {displayedQuestion.step} dari {TOTAL_STEPS}
                        {editingId ? " · Mengubah jawaban" : ""}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-hairlineDivider">
                      <div
                        className="h-full rounded-full bg-navyCore transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-headlineBlack">
                    {displayedQuestion.question}
                  </h2>
                  {displayedQuestion.helper ? (
                    <p className="mt-2 text-sm text-bodyTextGray">
                      {displayedQuestion.helper}
                    </p>
                  ) : null}

                  {/* Choice */}
                  {displayedQuestion.kind === "choice" &&
                  displayedQuestion.options ? (
                    <div className="mt-5 space-y-3">
                      {displayedQuestion.options.map((option) => {
                        const selected = draft === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setDraft(option.value)}
                            aria-pressed={selected}
                            className={cn(
                              "flex w-full flex-col items-start rounded-lg border p-4 text-left transition-colors",
                              selected
                                ? "border-navyCore bg-navyCore/5"
                                : "border-hairlineDivider bg-white hover:border-navyCore hover:bg-offWhiteSection"
                            )}
                          >
                            <span className="text-sm font-semibold text-headlineBlack">
                              {option.label}
                            </span>
                            {option.description ? (
                              <span className="mt-1 text-xs leading-relaxed text-bodyTextGray">
                                {option.description}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Date — masked dd/mm/yyyy text input (locale-independent) */}
                  {displayedQuestion.kind === "date" ? (
                    <div className="mt-5">
                      <label
                        htmlFor="form-date"
                        className="mb-2 block text-sm font-medium text-headlineBlack"
                      >
                        Tanggal hasil penyelesaian tertulis
                      </label>
                      <input
                        id="form-date"
                        type="text"
                        inputMode="numeric"
                        value={draft}
                        placeholder="dd/mm/yyyy"
                        maxLength={10}
                        aria-invalid={draft.length > 0 && !isValidDmy(draft)}
                        onChange={(e) => setDraft(maskDmy(e.target.value))}
                        className="w-full rounded-subtle border border-hairlineDivider px-3 py-2.5 text-sm text-headlineBlack placeholder:text-captionGray focus-visible:border-navyCore"
                      />
                      {draft.length > 0 && !isValidDmy(draft) ? (
                        <p className="mt-2 text-sm font-medium text-accentRed">
                          Masukkan tanggal dengan format dd/mm/yyyy.
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Number */}
                  {displayedQuestion.kind === "number" ? (
                    <div className="mt-5">
                      <label
                        htmlFor="form-number"
                        className="mb-2 block text-sm font-medium text-headlineBlack"
                      >
                        Nilai kerugian (Rupiah)
                      </label>
                      <input
                        id="form-number"
                        type="text"
                        inputMode="numeric"
                        value={draft}
                        placeholder={displayedQuestion.placeholder}
                        onChange={(e) =>
                          setDraft(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="w-full rounded-subtle border border-hairlineDivider px-3 py-2.5 text-sm text-headlineBlack placeholder:text-captionGray focus-visible:border-navyCore"
                      />
                      {draft && parseRupiah(draft) > 0 ? (
                        <p className="mt-2 text-sm font-semibold text-navyCore">
                          {formatRupiah(parseRupiah(draft))}
                        </p>
                      ) : null}
                      {displayedQuestion.note ? (
                        <p className="mt-3 rounded-lg border border-hairlineDivider bg-offWhiteSection p-3 text-xs leading-relaxed text-bodyTextGray">
                          {displayedQuestion.note}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Navigation */}
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-hairlineDivider pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={!canGoBack}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-navyCore transition-colors hover:text-navyDeep disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={!isDraftValid}
                      className="inline-flex items-center gap-1.5 rounded-subtle bg-navyCore px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navyDeep disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Lanjutkan
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
