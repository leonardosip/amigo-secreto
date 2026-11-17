
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Preferences = {
  likes: string | null;
  gift_suggestions: string | null;
  clothing_size: string | null;
  shoe_size: string | null;
  product_links: string | null;
  notes: string | null;
};

type Receiver = {
  fullName: string;
  displayName: string;
  preferences: Preferences | null;
};

type Phase = "idle" | "loading" | "opening" | "revealed";

export default function RevealGift() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [receiver, setReceiver] = useState<Receiver | null>(null);
  const [error, setError] = useState("");

  async function reveal() {
    if (phase !== "idle") return;

    setError("");
    setPhase("loading");

    try {
      const response = await fetch("/api/participants/my-draw", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar sorteio.");
      }

      if (!data.drawn) {
        throw new Error("O sorteio ainda não foi realizado.");
      }

      setReceiver(data.receiver);

      // suspense
      setTimeout(() => {
        setPhase("opening");

        setTimeout(() => {
          setPhase("revealed");
        }, 1100);
      }, 1400);
    } catch (err) {
      setPhase("idle");
      setError(
        err instanceof Error ? err.message : "Erro inesperado."
      );
    }
  }

  const tips = receiver
    ? [
        ["O que gosta", receiver.preferences?.likes],
        ["Sugestões de presentes", receiver.preferences?.gift_suggestions],
        ["Tamanho de roupa", receiver.preferences?.clothing_size],
        ["Número do calçado", receiver.preferences?.shoe_size],
        ["Links de presentes", receiver.preferences?.product_links],
        ["Observações", receiver.preferences?.notes],
      ].filter(([, value]) => Boolean(value))
    : [];

  const isAnimating = phase === "loading" || phase === "opening";
  const isRevealed = phase === "revealed";

  return (
    <section className="min-w-0 overflow-hidden rounded-3xl bg-[#102C23] p-5 text-[#F7F2E8] sm:p-8 md:p-10">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="gift-state"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="w-full min-w-0"
            >
              <div className="mb-5 sm:mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#C7A35A] sm:text-sm sm:tracking-[0.25em]">
                  Sua surpresa
                </p>

                <h2 className="mt-4 font-serif text-2xl leading-tight sm:text-3xl md:text-4xl">
                  {phase === "idle"
                    ? "Seu presente está esperando!"
                    : phase === "loading"
                    ? "Hmmm... preparando sua revelação"
                    : "Abrindo seu presente..."}
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/65 sm:leading-7">
                  {phase === "idle"
                    ? "Clique no presente para descobrir quem você tirou no amigo secreto."
                    : phase === "loading"
                    ? "Segura aí... estamos buscando sua surpresa especial."
                    : "Quase lá! Seu amigo secreto está aparecendo."}
                </p>
              </div>

              {/* ÁREA DO PRESENTE */}
              <div className="relative mx-auto mt-6 flex h-60 w-full max-w-sm items-center justify-center sm:mt-10 sm:h-72">
                {/* BRILHO */}
                <motion.div
                  className="pointer-events-none absolute h-40 w-40 rounded-full bg-[#C7A35A]/15 blur-3xl sm:h-52 sm:w-52"
                  animate={{
                    scale:
                      phase === "idle" ? 1 : [1, 1.15, 1],
                    opacity:
                      phase === "idle" ? 0.5 : [0.5, 0.9, 0.6],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: phase === "idle" ? Infinity : 2,
                    ease: "easeInOut",
                  }}
                />

                {/* CAIXA COMPLETA */}
                <motion.div
                  className="relative origin-center scale-[0.78] sm:scale-100"
                  animate={
                    phase === "loading"
                      ? {
                          rotate: [0, -4, 4, -3, 3, 0],
                          y: [0, -4, 0],
                          scale: [1, 1.03, 1],
                        }
                      : { rotate: 0, y: 0, scale: 1 }
                  }
                  transition={{
                    duration: 0.8,
                    repeat:
                      phase === "loading" ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  {/* TAMPA */}
                  <motion.div
                    className="absolute left-1/2 top-0 z-20 h-16 w-56 -translate-x-1/2 rounded-2xl border border-[#C7A35A]/40 bg-[#8E2830] shadow-lg"
                    style={{
                      transformOrigin: "center bottom",
                    }}
                    animate={
                      phase === "opening"
                        ? {
                            y: -75,
                            rotate: -14,
                            scaleX: 1.03,
                          }
                        : {
                            y: 0,
                            rotate: 0,
                            scaleX: 1,
                          }
                    }
                    transition={{
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 bg-[#C7A35A]" />

                    <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#C7A35A]" />
                  </motion.div>

                  {/* BASE DA CAIXA */}
                  <motion.div
                    className="relative z-10 mt-14 h-40 w-56 overflow-hidden rounded-[28px] border border-[#C7A35A]/40 bg-[#8E2830] shadow-2xl"
                    animate={
                      phase === "opening"
                        ? { scale: [1, 1.03, 0.98, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.8 }}
                  >
                    <div className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 bg-[#C7A35A]" />

                    <div className="absolute left-0 top-1/2 h-4 w-full -translate-y-1/2 bg-[#C7A35A]" />

                    {/* CARTÃO DA REVELAÇÃO */}
                    <motion.div
                      className="absolute left-1/2 top-10 z-0 w-44 -translate-x-1/2 rounded-2xl bg-[#F7F2E8] p-4 text-[#102C23] shadow-xl"
                      initial={false}
                      animate={
                        phase === "opening"
                          ? {
                              y: -85,
                              opacity: 1,
                              rotate: 0,
                            }
                          : {
                              y: 30,
                              opacity: 0,
                              rotate: 2,
                            }
                      }
                      transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-[#8E2830]">
                        Surpresa
                      </p>

                      <p className="mt-2 break-words font-serif text-lg">
                        {receiver?.displayName || "..."}
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>

              {/* BOTÃO */}
              <button
                type="button"
                onClick={reveal}
                disabled={isAnimating}
                className="mt-6 min-h-14 w-full rounded-full bg-[#C7A35A] px-5 py-4 text-center text-sm font-semibold text-[#102C23] transition hover:bg-[#D9BA79] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-8 sm:w-auto sm:px-8 sm:text-base sm:hover:scale-105"
              >
                {phase === "idle"
                  ? "Revelar meu amigo secreto ✨"
                  : phase === "loading"
                  ? "Preparando sua surpresa..."
                  : "Abrindo presente..."}
              </button>

              {error && (
                <p
                  role="alert"
                  className="mt-5 break-words text-sm leading-6 text-red-300"
                >
                  {error}
                </p>
              )}
            </motion.div>
          ) : (
            /* RESULTADO REVELADO */
            <motion.div
              key="revealed-state"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
              }}
              className="w-full min-w-0"
            >
              <div className="mb-5 text-5xl sm:text-6xl">
                🎉
              </div>

              <p className="text-xs uppercase tracking-[0.2em] text-[#C7A35A] sm:text-sm sm:tracking-[0.25em]">
                Seu amigo secreto é...
              </p>

              <h2 className="mt-5 break-words font-serif text-3xl leading-tight text-[#C7A35A] sm:text-4xl md:text-5xl">
                {receiver?.fullName}
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/60">
                Agora é hora de preparar uma surpresa especial!
              </p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.45,
                }}
                className="mt-8 min-w-0 space-y-5 rounded-2xl bg-white/10 p-5 text-left sm:mt-9 sm:p-6"
              >
                <h3 className="font-serif text-xl sm:text-2xl">
                  Dicas de presente 🎁
                </h3>

                {tips.length === 0 ? (
                  <p className="text-sm text-white/70">
                    Essa pessoa ainda não informou suas dicas.
                  </p>
                ) : (
                  tips.map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <p className="text-sm font-semibold text-[#C7A35A]">
                        {label}
                      </p>

                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-white/80">
                        {value}
                      </p>
                    </div>
                  ))
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
