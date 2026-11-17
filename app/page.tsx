
import Link from "next/link";
import NossasMemorias from "./components/NossasMemorias";

const etapas = [
  {
    numero: "01",
    titulo: "Entre na brincadeira",
    descricao:
      "Faça seu cadastro e conte um pouquinho sobre seus gostos e presentes favoritos.",
  },
  {
    numero: "02",
    titulo: "Aguarde o sorteio",
    descricao:
      "Quando todos estiverem cadastrados, o organizador realizará o sorteio.",
  },
  {
    numero: "03",
    titulo: "Descubra sua surpresa",
    descricao:
      "Entre na sua conta e descubra quem você tirou, com todas as dicas de presente.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F2E8] text-[#102C23]">
      {/* HEADER */}
      <header className="absolute inset-x-0 top-0 z-30">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-8 sm:py-8">
          <span className="font-serif text-2xl font-semibold tracking-tight text-[#F7F2E8] sm:text-3xl">
            ✦ Amigo Secreto
          </span>

          <Link
            href="/login"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/25 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-[#C7A35A] hover:bg-[#C7A35A] hover:text-[#102C23]"
          >
            Entrar
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#102C23] px-5 pb-24 pt-36 text-center text-[#F7F2E8] sm:min-h-[760px] sm:px-8 sm:pb-32 sm:pt-40">
        {/* TEXTURA E ELEMENTOS DECORATIVOS */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(199,163,90,0.09),transparent_55%)]" />

        <div className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-[#C7A35A]/5 blur-[100px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#8E2830]/15 blur-[110px]" />

        {/* LINHAS DECORATIVAS */}
        <div className="pointer-events-none absolute left-5 top-28 hidden h-px w-24 bg-[#C7A35A]/30 md:block" />

        <div className="pointer-events-none absolute right-5 top-28 hidden h-px w-24 bg-[#C7A35A]/30 md:block" />

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          {/* SUBTÍTULO */}
          <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10">
            <span className="h-px w-7 bg-[#C7A35A]/60 sm:w-12" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C7A35A] sm:text-xs sm:tracking-[0.35em]">
              Mais um ano de amigo secreto.
            </p>

            <span className="h-px w-7 bg-[#C7A35A]/60 sm:w-12" />
          </div>

          {/* PRESENTE */}
          <div className="mb-8 text-5xl sm:mb-10 sm:text-6xl">
            🎁
          </div>

          {/* TÍTULO */}
          <h1 className="mx-auto max-w-5xl font-serif text-[clamp(3.3rem,10vw,7rem)] font-medium leading-[0.95] tracking-tight">
            O melhor presente é

            <span className="mt-3 block italic text-[#C7A35A] sm:mt-5">
              estarmos juntos.
            </span>

            <span className="mx-auto mt-6 block max-w-xl font-sans text-xs font-normal leading-6 tracking-normal text-[#F7F2E8]/60 sm:mt-8 sm:text-sm">
              (já o pior é o presente do Paulo pro Salomão)
            </span>
          </h1>

          {/* DESCRIÇÃO */}
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 font-normal text-[#F7F2E8]/65 sm:mt-10 sm:text-base sm:leading-8">
            Mais um ano de amizade, boas risadas e "natal não é churrasco".
            Nosso amigo secreto está chegando e espero que todo mundo não queira levar água (LEVE UM PRATO TOP PARA O BEM DE TODOS)
          </p>

          {/* BOTÕES */}
          <div className="mx-auto mt-10 flex w-full max-w-md flex-col gap-3 sm:mt-12 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/cadastro"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#C7A35A] px-9 py-4 text-center text-sm font-semibold text-[#102C23] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D9BA79] hover:shadow-[0_12px_35px_rgba(199,163,90,0.15)] sm:text-base"
            >
              Participar do amigo secreto
            </Link>

            <a
              href="#como-funciona"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#F7F2E8]/20 px-9 py-4 text-center text-sm font-medium text-[#F7F2E8] transition-all duration-300 hover:border-[#F7F2E8]/50 hover:bg-white/5 sm:text-base"
            >
              Como funciona?
            </a>
          </div>
        </div>

        {/* DETALHE INFERIOR */}
        <div className="pointer-events-none absolute inset-x-5 bottom-8 flex items-center justify-center gap-3 sm:bottom-10">
          <span className="h-px w-12 bg-[#C7A35A]/35" />
          <span className="h-1.5 w-1.5 rotate-45 border border-[#C7A35A]/70" />
          <span className="h-px w-12 bg-[#C7A35A]/35" />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        id="como-funciona"
        className="relative mx-auto max-w-7xl scroll-mt-10 px-5 py-20 sm:px-8 sm:py-28 lg:py-36"
      >
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-20">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8E2830] sm:text-xs sm:tracking-[0.35em]">
            Simples e especial
          </p>

          <h2 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Como vai funcionar?
          </h2>

          <div className="mx-auto mt-8 h-px w-16 bg-[#C7A35A]" />
        </div>

        {/* ETAPAS */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {etapas.map((etapa) => (
            <div
              key={etapa.numero}
              className="group relative flex min-h-[280px] flex-col rounded-[28px] border border-[#102C23]/[0.08] bg-white/70 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#C7A35A]/40 hover:bg-white hover:shadow-[0_20px_60px_rgba(16,44,35,0.06)] sm:min-h-[320px] sm:p-9"
            >
              {/* NÚMERO */}
              <span className="font-serif text-6xl leading-none text-[#C7A35A] sm:text-7xl">
                {etapa.numero}
              </span>

              {/* LINHA */}
              <div className="mt-7 h-px w-full bg-[#102C23]/10" />

              {/* TEXTO */}
              <div className="mt-7">
                <h3 className="font-serif text-3xl font-medium leading-tight tracking-tight sm:text-[2rem]">
                  {etapa.titulo}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#102C23]/60">
                  {etapa.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEMÓRIAS */}
      <NossasMemorias />

      {/* FOOTER */}
      <footer className="bg-[#102C23] px-5 py-12 text-center text-[#F7F2E8] sm:px-8 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-7 h-px max-w-xs bg-[#C7A35A]/25" />

          <p className="text-xs leading-7 tracking-wide text-[#F7F2E8]/55 sm:text-sm">
            SITE DO AMIGO LEONARDO DE VOCES, UOU OLHA COMO ELE EH TOP . ✨
          </p>
        </div>
      </footer>
    </main>
  );
}
