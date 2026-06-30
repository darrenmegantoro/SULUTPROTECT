"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pencil, RotateCcw } from "lucide-react";
import { captureInteraction } from "@/lib/interactionCapture";
import {
  BIDANG_LABELS,
  GUIDED_QUESTIONS,
  GUIDED_RESULTS,
  getLossThresholdForBidang,
  getLossThresholdHelper,
  TIME_LIMIT_CALENDAR_DAYS,
  TOTAL_STEPS,
} from "@/data/guidedForm";
import type {
  ConsumerData,
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
import ConsumerDataStep, {
  EMPTY_CONSUMER_DATA,
} from "@/components/ConsumerDataStep";
import ResultCard from "./ResultCard";

type Transition = { question: QuestionId } | { result: ResultKey };
type FormPhase = "consumer" | "triage";

function getQuestion(id: QuestionId): GuidedQuestion {
  return GUIDED_QUESTIONS.find((q) => q.id === id) as GuidedQuestion;
}

function getTransition(
  id: QuestionId,
  value: string,
  answers: GuidedAnswers
): Transition {
  switch (id) {
    case "q1":
      return { question: "q2" };
    case "q2":
      if (answers.q1 === "ketidakpahaman") {
        if (value === "ya") return { result: "A" };
        if (value === "tidak") return { result: "B" };
        return { result: "C" };
      }
      if (value === "ya") return { question: "q3" };
      if (value === "tidak") return { result: "B" };
      return { result: "C" };
    case "q3":
      return { question: "q4" };
    case "q4":
      return value === "ya" ? { question: "q5" } : { result: "D" };
    case "q5": {
      const days = calendarDaysSinceDmy(value);
      return days <= TIME_LIMIT_CALENDAR_DAYS
        ? { question: "q6" }
        : { result: "E" };
    }
    case "q6":
      if (value === "ya") return { question: "q7" };
      if (value === "tidak") return { result: "F" };
      return { result: "G" };
    case "q7":
      return value === "tidak" ? { question: "q8" } : { result: "H" };
    case "q8":
      return value === "tidak" ? { question: "q9" } : { result: "I" };
    case "q9": {
      const amount = parseRupiah(value);
      const threshold = getLossThresholdForBidang(answers.q3 ?? "");
      return amount <= threshold ? { result: "J" } : { result: "K" };
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

function computeFlow(answers: GuidedAnswers): Flow {
  let id: QuestionId = "q1";
  const path: PathStep[] = [];
  for (let i = 0; i <= GUIDED_QUESTIONS.length; i += 1) {
    const value = answers[id];
    if (value === undefined) {
      return { path, currentId: id, resultKey: null };
    }
    path.push({ id, value });
    const transition = getTransition(id, value, answers);
    if ("result" in transition) {
      return { path, currentId: null, resultKey: transition.result };
    }
    id = transition.question;
  }
  return { path, currentId: null, resultKey: null };
}

function answerLabel(id: QuestionId, value: string): string {
  const q = getQuestion(id);
  if (id === "q3") return BIDANG_LABELS[value] ?? value;
  if (q.kind === "choice") {
    return q.options?.find((o) => o.value === value)?.label ?? value;
  }
  if (q.kind === "date") return value;
  if (q.kind === "number") return formatRupiah(parseRupiah(value));
  return value;
}

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
  const [consumerData, setConsumerData] =
    useState<ConsumerData>(EMPTY_CONSUMER_DATA);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<FormPhase>("consumer");
  const [consumerComplete, setConsumerComplete] = useState(false);
  const [editingId, setEditingId] = useState<QuestionId | null>(null);
  const [draft, setDraft] = useState("");

  const { path, currentId, resultKey } = useMemo(
    () => computeFlow(answers),
    [answers]
  );

  const displayedId: QuestionId | null = editingId ?? currentId;
  const displayedQuestion = displayedId ? getQuestion(displayedId) : null;

  const capturedRef = useRef<ResultKey | null>(null);
  useEffect(() => {
    if (resultKey && !editingId && capturedRef.current !== resultKey) {
      capturedRef.current = resultKey;
      captureInteraction({
        channel: "Formulir",
        category: answers.q1 ? Q1_CATEGORY[answers.q1] : undefined,
        query: "Formulir Panduan Pengaduan",
        answerSummary: [
          `Nama: ${consumerData.nama}`,
          `Provinsi: ${consumerData.provinsi}`,
          `Kota/Kabupaten: ${consumerData.kotaKabupaten}`,
          ...path.map(
            (s) =>
              `${getQuestion(s.id).question}: ${answerLabel(s.id, s.value)}`
          ),
        ],
        resultRecommendation: RESULT_RECOMMENDATION[resultKey],
        location: `${consumerData.kotaKabupaten}, ${consumerData.provinsi}`,
      });
    }
    if (!resultKey) capturedRef.current = null;
  }, [resultKey, editingId, answers, path, consumerData]);

  useEffect(() => {
    setDraft(displayedId ? answers[displayedId] ?? "" : "");
  }, [displayedId, answers]);

  const isDraftValid = (() => {
    if (!displayedQuestion) return false;
    if (displayedQuestion.kind === "number") return parseRupiah(draft) > 0;
    if (displayedQuestion.kind === "date") return isValidDmy(draft);
    return draft.trim().length > 0;
  })();

  const lossHelper =
    displayedId === "q9" && answers.q3
      ? getLossThresholdHelper(answers.q3)
      : null;

  const handleContinue = () => {
    const targetId = editingId ?? currentId;
    if (!targetId || !isDraftValid) return;

    const prevValue = answers[targetId];
    const nextAnswers: GuidedAnswers = { ...answers, [targetId]: draft };

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
      return;
    }
    if (phase === "triage") {
      setPhase("consumer");
      setConsumerComplete(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setConsumerData(EMPTY_CONSUMER_DATA);
    setEditingId(null);
    setDraft("");
    setPhase("consumer");
    setConsumerComplete(false);
    setStarted(true);
  };

  const handleEdit = (id: QuestionId) => setEditingId(id);

  const canGoBack =
    editingId !== null || path.length > 0 || phase === "triage";

  const progressStep = displayedQuestion?.step ?? TOTAL_STEPS;
  const progress = Math.round((progressStep / TOTAL_STEPS) * 100);

  const answerSummary = (
    <div className="rounded-xl border border-hairlineDivider bg-white p-5 shadow-card">
      <h3 className="text-sm font-bold uppercase tracking-wide text-navyCore">
        Jawaban Anda
      </h3>

      {consumerComplete ? (
        <div className="mt-3 rounded-lg border border-hairlineDivider bg-offWhiteSection p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-navyCore">
              Data Konsumen
            </p>
            <button
              type="button"
              onClick={() => {
                setPhase("consumer");
                setConsumerComplete(false);
              }}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-linkBlue hover:underline"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Ubah
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-bodyTextGray">
            <li>
              <span className="font-medium text-headlineBlack">Nama:</span>{" "}
              {consumerData.nama}
            </li>
            <li>
              <span className="font-medium text-headlineBlack">Telepon:</span>{" "}
              {consumerData.telepon}
            </li>
            <li>
              <span className="font-medium text-headlineBlack">Provinsi:</span>{" "}
              {consumerData.provinsi}
            </li>
            <li>
              <span className="font-medium text-headlineBlack">
                Kota/Kabupaten:
              </span>{" "}
              {consumerData.kotaKabupaten}
            </li>
            {consumerData.email.trim() ? (
              <li>
                <span className="font-medium text-headlineBlack">Email:</span>{" "}
                {consumerData.email}
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {path.length === 0 ? (
        <p className="mt-2 text-sm text-bodyTextGray">
          {consumerComplete
            ? "Belum ada jawaban formulir."
            : "Belum ada jawaban."}
        </p>
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
            {phase === "triage" ? answerSummary : null}

            {phase === "consumer" ? (
              <div className="rounded-xl border border-hairlineDivider bg-white p-6 shadow-card sm:p-7">
                <ConsumerDataStep
                  value={consumerData}
                  onChange={setConsumerData}
                  onContinue={() => {
                    setConsumerComplete(true);
                    setPhase("triage");
                  }}
                />
              </div>
            ) : null}

            {phase === "triage" && resultKey && !editingId ? (
              <ResultCard result={GUIDED_RESULTS[resultKey]} />
            ) : null}

            {phase === "triage" && displayedQuestion ? (
              <div className="rounded-xl border border-hairlineDivider bg-white p-6 shadow-card sm:p-7">
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
                    {lossHelper ? (
                      <p className="mt-3 rounded-lg border border-hairlineDivider bg-offWhiteSection p-3 text-xs leading-relaxed text-bodyTextGray">
                        {lossHelper}
                      </p>
                    ) : null}
                  </div>
                ) : null}

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
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
