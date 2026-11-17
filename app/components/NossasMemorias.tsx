
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const memorias = [
  { ano: 2020, foto: "/memorias/2020.jpg" },
  { ano: 2021, foto: "/memorias/2021.jpg" },
  { ano: 2022, foto: "/memorias/2022.jpg" },
  { ano: 2024, foto: "/memorias/2024.jpg" },
  { ano: 2025, foto: "/memorias/2025.jpg" },
];

export default function NossasMemorias() {
  const [anoSelecionado, setAnoSelecionado] = useState(2025);
  const [ampliada, setAmpliada] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const memoria = memorias.find(
    (item) => item.ano === anoSelecionado
  )!;

  // Fecha a foto ampliada com ESC e bloqueia o scroll.
  useEffect(() => {
    if (!ampliada) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAmpliada(false);
      }

      if (event.key === "Tab") {
        // Mantém o foco no botão de fechar,
        // que é o único controle do modal.
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [ampliada]);

  return (
    <section className="relative overflow-hidden bg-[#EDE5D6] px-5 py-20 text-[#102C23] sm:px-8 sm:py-28 lg:py-36">
      {/* DETALHES DE FUNDO */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-white/40 blur-[100px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#C7A35A]/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* TÍTULO */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8E2830] sm:text-xs sm:tracking-[0.3em]">
            Melhores momentos patrocinado por Domingão do Faustão
          </p>

          <h2 className="mt-5 font-serif text-5xl font-medium leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Nossa História
          </h2>

          <div className="mx-auto mt-7 h-px w-16 bg-[#C7A35A]" />

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#102C23]/65 sm:text-base sm:leading-8">
            Apreciem a beleza desse grupo maravilhoso, e essas fotos de qualidade que foram o que consegui achar!
          </p>
        </div>

        {/* SELETOR DE ANOS */}
        <div className="-mx-5 mt-10 overflow-x-auto px-5 pb-3 sm:mx-0 sm:mt-14 sm:overflow-visible sm:px-0">
          <div className="flex w-max min-w-full items-center justify-center gap-2 sm:w-auto sm:flex-wrap sm:gap-3">
            {memorias.map((item) => {
              const ativo = anoSelecionado === item.ano;

              return (
                <button
                  key={item.ano}
                  type="button"
                  onClick={() => setAnoSelecionado(item.ano)}
                  aria-pressed={ativo}
                  className={`relative min-h-12 shrink-0 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                    ativo
                      ? "bg-[#102C23] text-[#C7A35A] shadow-[0_8px_24px_rgba(16,44,35,0.12)]"
                      : "border border-[#102C23]/10 bg-white/50 text-[#102C23]/70 hover:border-[#102C23]/25 hover:bg-white"
                  }`}
                >
                  {item.ano}
                </button>
              );
            })}
          </div>
        </div>

        {/* FOTO DO ANO */}
        <div className="relative mx-auto mt-7 max-w-5xl sm:mt-10">
          {/* MOLDURA DO ÁLBUM */}
          <div className="rounded-[26px] border border-[#102C23]/10 bg-[#F7F2E8] p-2.5 shadow-[0_20px_70px_rgba(16,44,35,0.08)] sm:rounded-[36px] sm:p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={memoria.ano}
                initial={{ opacity: 0, y: 15, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.985 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setAmpliada(true)}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-[#102C23] text-left sm:aspect-[16/10] sm:rounded-[26px]"
                  aria-label={`Ampliar foto de ${memoria.ano}`}
                >
                  <Image
                    src={memoria.foto}
                    alt={`Foto do amigo secreto de ${memoria.ano}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 1024px"
                    className="object-contain transition-transform duration-700 group-hover:scale-[1.025]"
                  />

                  {/* DEGRADÊ DISCRETO */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-4 pb-5 pt-16 text-white sm:px-9 sm:pb-9 sm:pt-24">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#E7C987] sm:text-xs sm:tracking-[0.25em]">
                      Uma lembrança especial
                    </p>

                    <h3 className="mt-2 font-serif text-3xl font-medium leading-tight sm:text-5xl">
                      Amigo Secreto {memoria.ano}
                    </h3>
                  </div>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* LEGENDA */}
          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs tracking-wide text-[#102C23]/50 sm:text-sm">
              Clique na foto para ampliar ❤️
            </p>

            <div className="flex items-center gap-2">
              <span className="h-px w-7 bg-[#C7A35A]" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[#102C23]/50">
                {memoria.ano}
              </span>
              <span className="h-px w-7 bg-[#C7A35A]" />
            </div>
          </div>
        </div>
      </div>

      {/* VISUALIZAÇÃO AMPLIADA */}
      <AnimatePresence>
        {ampliada && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ampliada de ${memoria.ano}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#08130F]/95 px-3 py-16 backdrop-blur-md sm:px-6"
            onClick={() => setAmpliada(false)}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setAmpliada(false)}
              className="absolute right-4 top-4 z-20 flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20 sm:right-8 sm:top-8"
            >
              Fechar ✕
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative h-[75dvh] w-full max-w-6xl sm:h-[80dvh]"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={memoria.foto}
                alt={`Amigo secreto ${memoria.ano}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
