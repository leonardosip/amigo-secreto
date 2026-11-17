
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  totalParticipants: number;
  eventStatus: string;
};

export default function DrawButton({
  totalParticipants,
  eventStatus,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const alreadyDrawn = eventStatus !== "registration";
  const insufficient = totalParticipants < 2;

  function handleDraw() {
    if (loading || insufficient || alreadyDrawn) return;

    setError("");
    setSuccess("");
    setShowConfirm(true);
  }

  async function confirmDraw() {
    if (loading || insufficient || alreadyDrawn) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/draw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erro ao realizar sorteio."
        );
      }

      setSuccess(
        `Sorteio realizado! ${data.totalParticipants} participantes foram sorteados.`
      );

      setShowConfirm(false);
      router.refresh();
    } catch (err) {
      setShowConfirm(false);
      setError(
        err instanceof Error ? err.message : "Erro inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* BOTÃO PRINCIPAL */}
      <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:items-start">
        <button
          type="button"
          onClick={handleDraw}
          disabled={loading || insufficient || alreadyDrawn}
          className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#C7A35A] px-6 py-4 text-center text-sm font-semibold text-[#102C23] transition hover:bg-[#D9BA79] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:text-base md:w-auto"
        >
          {loading
            ? "Realizando sorteio..."
            : alreadyDrawn
              ? "Sorteio já realizado ✓"
              : "Realizar sorteio 🎁"}
        </button>

        {insufficient && !alreadyDrawn && (
          <p className="text-center text-sm leading-6 text-white/65 md:text-left">
            É necessário ter pelo menos 2 participantes.
          </p>
        )}

        {success && (
          <p
            role="status"
            className="text-center text-sm leading-6 text-green-300 md:text-left"
          >
            {success}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="text-center text-sm leading-6 text-red-300 md:text-left"
          >
            {error}
          </p>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !loading) {
              setShowConfirm(false);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="draw-modal-title"
            aria-describedby="draw-modal-description"
            className="w-full max-w-md overflow-y-auto rounded-3xl border border-[#C7A35A]/30 bg-[#102C23] p-6 text-center text-[#F7F2E8] shadow-2xl sm:p-9"
          >
            <div className="mb-5 text-6xl">🎁</div>

            <p className="text-xs uppercase tracking-[0.25em] text-[#C7A35A]">
              Sorteio oficial
            </p>

            <h2
              id="draw-modal-title"
              className="mt-4 font-serif text-3xl leading-tight"
            >
              Tem certeza?
            </h2>

            <p
              id="draw-modal-description"
              className="mt-5 text-sm leading-7 text-white/75"
            >
              Você está prestes a realizar o sorteio oficial
              com{" "}
              <strong className="text-[#C7A35A]">
                {totalParticipants} participantes.
              </strong>
            </p>

            <div className="mt-6 rounded-2xl border border-[#C7A35A]/20 bg-white/5 p-5">
              <p className="text-sm leading-7 text-white/80">
                As inscrições serão encerradas e cada pessoa
                poderá descobrir quem tirou.
              </p>

              <p className="mt-3 text-sm font-medium leading-6 text-[#C7A35A]">
                Essa operação não poderá ser desfeita pelo painel.
              </p>
            </div>

            <p className="mt-6 text-sm text-white/70">
              Deseja continuar?
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDraw}
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#C7A35A] px-5 py-3 text-sm font-semibold text-[#102C23] transition hover:bg-[#D9BA79] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Realizando sorteio..."
                  : "Confirmar sorteio 🎄"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
