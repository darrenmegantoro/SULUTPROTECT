"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LogIn } from "lucide-react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(email, password)) {
      router.push("/admin/dashboard");
    } else {
      setError("Email atau kata sandi salah. Periksa kembali kredensial Anda.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-offWhiteSection px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-hairlineDivider bg-white p-8 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navyCore text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold text-navyCore">
            SULUT PROTECT
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-headlineBlack">
          Login Integrated Dashboard
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-bodyTextGray">
          Masuk untuk mengakses Dashboard Monitoring Terintegrasi SULUT PROTECT.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-headlineBlack"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-subtle border border-hairlineDivider px-3 py-2.5 text-sm text-headlineBlack placeholder:text-captionGray focus-visible:border-navyCore"
              placeholder="Masukkan email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-headlineBlack"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-subtle border border-hairlineDivider px-3 py-2.5 text-sm text-headlineBlack placeholder:text-captionGray focus-visible:border-navyCore"
              placeholder="Masukkan kata sandi"
              required
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-accentRed/30 bg-accentRed/5 p-3 text-sm font-medium text-accentRed"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-subtle bg-navyCore px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navyDeep"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Masuk
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 inline-block text-sm font-semibold text-linkBlue hover:underline"
        >
          ← Kembali ke situs publik
        </Link>
      </div>
    </div>
  );
}
