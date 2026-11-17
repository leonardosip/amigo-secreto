
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível entrar.");
      }

      router.replace("/minha-conta");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#102C23] px-4 py-10 text-[#F7F2E8] sm:px-6 sm:py-16">
      {/* ILUMINAÇÃO DISCRETA DO FUNDO */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(199,163,90,0.08),transparent_60%)]" />

      <div className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-[#C7A35A]/5 blur-[100px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#8E2830]/15 blur-[110px]" />

      {/* CONTEÚDO */}
      <div className="relative z-10 w-full max-w-[480px]">
        {/* VOLTAR */}
        <Link
          href="/"
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-[#F7F2E8]/60 transition-colors duration-300 hover:text-[#F7F2E8]"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            ←
          </span>
          Voltar para o início
        </Link>

        {/* CABEÇALHO */}
        <div className="mt-8 text-center sm:mt-12">
          <div className="mb-7 text-5xl sm:text-6xl">
            🎁
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-[#C7A35A]/60 sm:w-10" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C7A35A] sm:text-xs sm:tracking-[0.3em]">
              Amigo Secreto 2026
            </p>

            <span className="h-px w-7 bg-[#C7A35A]/60 sm:w-10" />
          </div>

          <h1 className="mt-6 font-serif text-[clamp(2.9rem,9vw,4.4rem)] font-medium leading-[1.02] tracking-tight">
            Que bom ter você de volta!
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-[#F7F2E8]/65 sm:text-base">
            Entre na sua conta para acompanhar nosso amigo secreto. (Espero que tenha salvo o código que eu pedi pra salvar  :) )
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form
          onSubmit={handleSubmit}
          className="mt-9 space-y-6 rounded-[28px] border border-[#102C23]/10 bg-[#F7F2E8] p-5 text-[#102C23] shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:mt-11 sm:rounded-[32px] sm:p-9"
        >
          {/* DETALHE SUPERIOR */}
          <div className="mx-auto h-px w-14 bg-[#C7A35A]" />

          {/* CÓDIGO */}
          <div>
            <label
              htmlFor="accessCode"
              className="mb-2.5 block text-sm font-semibold text-[#102C23]"
            >
              Seu código individual
            </label>

            <input
              id="accessCode"
              required
              autoComplete="username"
              autoCapitalize="characters"
              spellCheck={false}
              value={accessCode}
              onChange={(e) =>
                setAccessCode(e.target.value.toUpperCase())
              }
              placeholder="AS-XXXXXXXXXX"
              maxLength={13}
              className="min-h-14 w-full rounded-2xl border border-[#102C23]/12 bg-white px-4 py-3 text-base font-medium uppercase tracking-wider text-[#102C23] outline-none transition-all duration-300 placeholder:font-normal placeholder:text-[#102C23]/30 focus:border-[#C7A35A] focus:ring-2 focus:ring-[#C7A35A]/15"
            />
          </div>

          {/* SENHA */}
          <div>
            <label
              htmlFor="password"
              className="mb-2.5 block text-sm font-semibold text-[#102C23]"
            >
              Sua palavra-chave
            </label>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua palavra-chave"
              className="min-h-14 w-full rounded-2xl border border-[#102C23]/12 bg-white px-4 py-3 text-base text-[#102C23] outline-none transition-all duration-300 placeholder:text-[#102C23]/30 focus:border-[#C7A35A] focus:ring-2 focus:ring-[#C7A35A]/15"
            />
          </div>

          {/* ERRO */}
          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {error}
            </p>
          )}

          {/* BOTÃO PRINCIPAL */}
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#102C23] px-6 py-4 text-center text-sm font-semibold text-[#F7F2E8] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1D4939] hover:shadow-[0_10px_30px_rgba(16,44,35,0.14)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
          >
            {loading ? "Entrando..." : "Entrar na minha conta ✨"}
          </button>

          {/* CADASTRO */}
          <div className="border-t border-[#102C23]/10 pt-6">
            <p className="text-center text-sm leading-7 text-[#102C23]/60">
              Ainda não participa?{" "}
              <Link
                href="/cadastro"
                className="font-semibold text-[#8E2830] underline decoration-[#8E2830]/40 underline-offset-4 transition hover:decoration-[#8E2830]"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </form>

        {/* DETALHE INFERIOR */}
        <div className="mt-9 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#C7A35A]/35" />
          <span className="h-1.5 w-1.5 rotate-45 border border-[#C7A35A]/70" />
          <span className="h-px w-10 bg-[#C7A35A]/35" />
        </div>
      </div>
    </main>
  );
}
