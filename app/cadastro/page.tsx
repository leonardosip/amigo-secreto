
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type FormData = {
  fullName: string;
  displayName: string;
  password: string;
  likes: string;
  giftSuggestions: string;
  clothingSize: string;
  shoeSize: string;
  productLinks: string;
  notes: string;
};

const initialForm: FormData = {
  fullName: "",
  displayName: "",
  password: "",
  likes: "",
  giftSuggestions: "",
  clothingSize: "",
  shoeSize: "",
  productLinks: "",
  notes: "",
};

export default function CadastroPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [savedName, setSavedName] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/participants/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar.");
      }

      setAccessCode(data.accessCode);
      setSavedName(data.displayName);
      setForm(initialForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "block min-h-14 w-full rounded-2xl border border-[#102C23]/10 bg-[#F7F2E8]/40 px-4 py-3 text-base leading-6 text-[#102C23] outline-none transition-all duration-300 placeholder:text-[#102C23]/35 focus:border-[#C7A35A] focus:bg-white focus:ring-2 focus:ring-[#C7A35A]/15";

  const labelStyle =
    "mb-2.5 block text-sm font-semibold text-[#102C23]";

  // TELA DE CADASTRO CONCLUÍDO
  if (accessCode) {
    return (
      <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#102C23] px-4 py-10 text-center text-[#F7F2E8] sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(199,163,90,0.08),transparent_65%)]" />

        <div className="relative z-10 w-full max-w-lg rounded-[28px] border border-[#C7A35A]/25 bg-white/5 p-6 shadow-2xl backdrop-blur-sm sm:rounded-[36px] sm:p-12">
          <div className="mb-7 text-5xl sm:text-6xl">
            🎁
          </div>

          <div className="mx-auto mb-7 h-px w-14 bg-[#C7A35A]" />

          <h1 className="font-serif text-4xl font-medium leading-tight text-[#C7A35A] sm:text-5xl">
            Você está participando!
          </h1>

          <p className="mt-5 text-sm leading-7 sm:text-base">
            Parabéns, {savedName}! Seu cadastro foi realizado.
          </p>

          <p className="mt-8 text-sm text-white/70">
            Este é seu código individual:
          </p>

          <div className="mt-4 rounded-2xl border border-[#C7A35A]/30 bg-[#C7A35A]/10 p-5">
            <span className="break-all text-xl font-bold tracking-wider text-[#C7A35A] sm:text-2xl">
              {accessCode}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(accessCode)}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#C7A35A] px-7 py-3 text-sm font-semibold text-[#102C23] transition-all duration-300 hover:bg-[#D9BA79] active:scale-[0.98] sm:w-auto"
          >
            Copiar meu código
          </button>

          <p className="mt-6 text-sm leading-6 text-white/60">
            Guarde esse código e sua palavra-chave. Você vai
            precisar dos dois para acessar seu amigo secreto!
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center justify-center text-sm text-[#C7A35A] underline underline-offset-4 transition hover:text-[#D9BA79]"
          >
            Voltar para o início
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F7F2E8] px-4 py-8 text-[#102C23] sm:px-6 sm:py-14">
      {/* ILUMINAÇÃO DISCRETA */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_50%_0%,rgba(199,163,90,0.12),transparent_75%)]" />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {/* VOLTAR */}
        <Link
          href="/"
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-[#102C23]/65 transition-colors duration-300 hover:text-[#102C23]"
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
          <div className="text-5xl sm:text-6xl">
            🎄
          </div>

          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-[#C7A35A] sm:w-10" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8E2830] sm:text-xs sm:tracking-[0.3em]">
              Amigo Secreto 2026
            </p>

            <span className="h-px w-7 bg-[#C7A35A] sm:w-10" />
          </div>

          <h1 className="mt-5 font-serif text-[clamp(3rem,9vw,5rem)] font-medium leading-[1.02] tracking-tight">
            Mais um ano na casa do Tigas
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#102C23]/65 sm:text-base sm:leading-8">
            Preencha suas informações e ajude quem te tirou da melhor maneira, e não venham com um me surpreenda........
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-9 rounded-[28px] border border-[#102C23]/[0.08] bg-white/85 p-5 shadow-[0_20px_70px_rgba(16,44,35,0.06)] sm:mt-12 sm:space-y-12 sm:rounded-[36px] sm:p-10"
        >
          {/* INFORMAÇÕES PESSOAIS */}
          <section className="space-y-5">
            <div className="border-b border-[#102C23]/10 pb-5">
              <h2 className="font-serif text-3xl font-medium sm:text-4xl">
                Suas informações
              </h2>
            </div>

            <div>
              <label htmlFor="fullName" className={labelStyle}>
                Nome *
              </label>

              <input
                id="fullName"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className={inputStyle}
                placeholder="Nome e sobrenome principal pra destinguir"
              />
            </div>

            <div>
              <label htmlFor="displayName" className={labelStyle}>
                APELIDO? *
              </label>

              <input
                id="displayName"
                required
                minLength={2}
                maxLength={40}
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                className={inputStyle}
                placeholder="Só o jeito que a galera te chama"
              />
            </div>

            <div>
              <label htmlFor="password" className={labelStyle}>
                Crie sua palavra-chave *
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className={inputStyle}
                placeholder="Mínimo de 8 caracteres"
              />

              <p className="mt-2 text-xs leading-6 text-[#102C23]/50">
                Não compartilhe sua palavra-chave com outras pessoas.
              </p>
            </div>
          </section>

          {/* DICAS DE PRESENTE */}
          <section className="space-y-5">
            <div className="border-b border-[#102C23]/10 pb-5">
              <h2 className="font-serif text-3xl font-medium sm:text-4xl">
                Suas dicas de presente 🎁
              </h2>
            </div>

            <div>
              <label htmlFor="likes" className={labelStyle}>
                O que você gosta?
              </label>

              <textarea
                id="likes"
                maxLength={1000}
                rows={3}
                value={form.likes}
                onChange={(e) => update("likes", e.target.value)}
                className={inputStyle}
                placeholder="Livros, jogos, roupas, chocolates, hobbies..."
              />
            </div>

            <div>
              <label htmlFor="giftSuggestions" className={labelStyle}>
                Sugestões de presentes
              </label>

              <textarea
                id="giftSuggestions"
                maxLength={2000}
                rows={3}
                value={form.giftSuggestions}
                onChange={(e) =>
                  update("giftSuggestions", e.target.value)
                }
                className={inputStyle}
                placeholder="O que você gostaria de ganhar?"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="clothingSize" className={labelStyle}>
                  Tamanho de roupa
                </label>

                <input
                  id="clothingSize"
                  maxLength={30}
                  value={form.clothingSize}
                  onChange={(e) =>
                    update("clothingSize", e.target.value)
                  }
                  className={inputStyle}
                  placeholder="P, M, G, GG..."
                />
              </div>

              <div>
                <label htmlFor="shoeSize" className={labelStyle}>
                  Número do calçado
                </label>

                <input
                  id="shoeSize"
                  maxLength={30}
                  value={form.shoeSize}
                  onChange={(e) =>
                    update("shoeSize", e.target.value)
                  }
                  className={inputStyle}
                  placeholder="Ex.: 40"
                />
              </div>
            </div>

            <div>
              <label htmlFor="productLinks" className={labelStyle}>
                Links de produtos
              </label>

              <textarea
                id="productLinks"
                maxLength={2000}
                rows={2}
                value={form.productLinks}
                onChange={(e) =>
                  update("productLinks", e.target.value)
                }
                className={inputStyle}
                placeholder="Cole links de presentes que você gostaria, promoções ajudam os amiguinhos."
              />
            </div>

            <div>
              <label htmlFor="notes" className={labelStyle}>
                Observações adicionais
              </label>

              <textarea
                id="notes"
                maxLength={1000}
                rows={2}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className={inputStyle}
                placeholder="Cores favoritas, coisas que não gosta..."
              />
            </div>
          </section>

          {/* ERRO */}
          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {error}
            </p>
          )}

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#102C23] px-6 py-4 text-center text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1D4939] hover:shadow-[0_10px_30px_rgba(16,44,35,0.12)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
          >
            {loading
              ? "Realizando cadastro..."
              : "Confirmar sua vaga nesse evento maravilhoso 🎁"}
          </button>
        </form>

        {/* DETALHE INFERIOR */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#C7A35A]/60" />
          <span className="h-1.5 w-1.5 rotate-45 border border-[#C7A35A]" />
          <span className="h-px w-10 bg-[#C7A35A]/60" />
        </div>
      </div>
    </main>
  );
}
