
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Preferences = {
  likes: string;
  gift_suggestions: string;
  clothing_size: string;
  shoe_size: string;
  product_links: string;
  notes: string;
};

const empty: Preferences = {
  likes: "",
  gift_suggestions: "",
  clothing_size: "",
  shoe_size: "",
  product_links: "",
  notes: "",
};

const fields: {
  key: keyof Preferences;
  label: string;
  placeholder: string;
  maxLength: number;
}[] = [
  {
    key: "likes",
    label: "O que você gosta?",
    placeholder: "Livros, jogos, chocolates, hobbies...",
    maxLength: 1000,
  },
  {
    key: "gift_suggestions",
    label: "Sugestões de presentes",
    placeholder: "O que gostaria de ganhar?",
    maxLength: 2000,
  },
  {
    key: "clothing_size",
    label: "Tamanho de roupa",
    placeholder: "P, M, G...",
    maxLength: 30,
  },
  {
    key: "shoe_size",
    label: "Número do calçado",
    placeholder: "Ex.: 40",
    maxLength: 30,
  },
  {
    key: "product_links",
    label: "Links de produtos",
    placeholder: "Cole links de presentes",
    maxLength: 2000,
  },
  {
    key: "notes",
    label: "Observações adicionais",
    placeholder: "Cores favoritas, coisas que não gosta...",
    maxLength: 1000,
  },
];

export default function EditarDicasPage() {
  const router = useRouter();

  const [form, setForm] = useState<Preferences>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "/api/participants/preferences",
          { cache: "no-store" }
        );

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Erro ao carregar dicas");
        }

        const data = await response.json();

        setForm({
          ...empty,
          ...data.preferences,
        });
      } catch {
        setError("Não foi possível carregar suas informações.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        "/api/participants/preferences",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar.");
      }

      router.replace("/minha-conta");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative min-h-[100svh] overflow-x-clip bg-[#F7F2E8] px-4 py-8 text-[#102C23] sm:px-6 sm:py-14">
      {/* ILUMINAÇÃO DISCRETA */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_50%_0%,rgba(199,163,90,0.12),transparent_75%)]" />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {/* VOLTAR */}
        <Link
          href="/minha-conta"
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-[#102C23]/65 transition-colors duration-300 hover:text-[#102C23]"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            ←
          </span>
          Voltar para minha conta
        </Link>

        {/* APRESENTAÇÃO */}
        <div className="mt-8 text-center sm:mt-12">
          <div className="text-5xl sm:text-6xl">
            🎁
          </div>

          <div className="mx-auto mt-7 h-px w-14 bg-[#C7A35A]" />

          <h1 className="mt-7 font-serif text-[clamp(3.1rem,9vw,5rem)] font-medium leading-[1.02] tracking-tight">
            Minhas dicas de presente
          </h1>

          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#102C23]/65 sm:text-base sm:leading-8">
            Conte o que gostaria de ganhar e ajude seu amigo secreto!
          </p>
        </div>

        {/* CARREGAMENTO */}
        {loading ? (
          <div className="mt-10 rounded-[28px] border border-[#102C23]/[0.08] bg-white/85 p-8 text-center shadow-[0_20px_70px_rgba(16,44,35,0.05)] sm:mt-12 sm:rounded-[36px]">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-[#102C23]/15 border-t-[#C7A35A]" />

            <p className="text-sm text-[#102C23]/65">
              Carregando suas dicas...
            </p>
          </div>
        ) : (
          /* FORMULÁRIO */
          <form
            onSubmit={save}
            className="mt-10 space-y-7 rounded-[28px] border border-[#102C23]/[0.08] bg-white/85 p-5 shadow-[0_20px_70px_rgba(16,44,35,0.06)] sm:mt-12 sm:space-y-8 sm:rounded-[36px] sm:p-10"
          >
            {/* DETALHE SUPERIOR */}
            <div className="mx-auto h-px w-14 bg-[#C7A35A]" />

            {fields.map((field) => (
              <div
                key={field.key}
                className="min-w-0"
              >
                <label
                  htmlFor={field.key}
                  className="mb-2.5 block text-sm font-semibold text-[#102C23]"
                >
                  {field.label}
                </label>

                <textarea
                  id={field.key}
                  rows={field.maxLength <= 30 ? 1 : 3}
                  maxLength={field.maxLength}
                  value={form[field.key]}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="block min-h-14 w-full resize-y rounded-2xl border border-[#102C23]/10 bg-[#F7F2E8]/40 px-4 py-3 text-base leading-6 text-[#102C23] outline-none transition-all duration-300 placeholder:text-[#102C23]/35 focus:border-[#C7A35A] focus:bg-white focus:ring-2 focus:ring-[#C7A35A]/15"
                />
              </div>
            ))}

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#102C23] px-6 py-4 text-center text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1D4939] hover:shadow-[0_10px_30px_rgba(16,44,35,0.12)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
            >
              {saving ? "Salvando..." : "Salvar minhas dicas ✨"}
            </button>
          </form>
        )}

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
