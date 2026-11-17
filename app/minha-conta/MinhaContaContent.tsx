
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import RevealGift from "./RevealGift";
import { connection } from "next/server";

export default async function MinhaContaPage() {
  await connection();

  // Verifica se o usuário está autenticado
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const supabase = getSupabaseAdmin();

  // Busca os dados do participante autenticado
  const { data: participant, error: participantError } =
    await supabase
      .from("participants")
      .select("id, full_name, display_name, is_admin, event_id")
      .eq("id", session.participantId)
      .maybeSingle();

  if (participantError) {
    throw new Error("Erro ao carregar participante.");
  }

  if (!participant) {
    redirect("/login");
  }

  // Busca as dicas do próprio participante
  const { data: preferences, error: preferencesError } =
    await supabase
      .from("gift_preferences")
      .select(
        "likes, gift_suggestions, clothing_size, shoe_size, product_links, notes"
      )
      .eq("participant_id", participant.id)
      .maybeSingle();

  if (preferencesError) {
    throw new Error("Erro ao carregar dicas.");
  }

  // Busca o evento do participante
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, event_year, status")
    .eq("id", participant.event_id)
    .single();

  if (eventError || !event) {
    throw new Error("Evento não encontrado.");
  }

  const isDrawn = event.status === "drawn";
  const canEdit = event.status === "registration";

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F2E8] text-[#102C23]">
      {/* HEADER */}
      <header className="bg-[#102C23] text-[#F7F2E8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
          <Link
            href="/"
            className="font-serif text-2xl font-medium tracking-tight text-[#C7A35A] transition-colors hover:text-[#D9BA79] sm:text-3xl"
          >
            ✦ Amigo Secreto
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {participant.is_admin && (
              <Link
                href="/admin"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#C7A35A]/40 px-4 py-2 text-center text-xs font-semibold text-[#C7A35A] transition-all duration-300 hover:border-[#C7A35A] hover:bg-white/5 sm:px-6 sm:text-sm"
              >
                Painel Admin 👑
              </Link>
            )}

            <form
              action="/api/auth/logout"
              method="POST"
            >
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white sm:px-6 sm:text-sm"
              >
                Sair da conta
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
        {/* APRESENTAÇÃO */}
        <section className="relative mb-12 sm:mb-16">
          <div className="pointer-events-none absolute -right-20 -top-16 h-64 w-64 rounded-full bg-[#C7A35A]/10 blur-[90px]" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#C7A35A] sm:w-12" />

              <p className="break-words text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8E2830] sm:text-xs sm:tracking-[0.3em]">
                {event.title}
              </p>
            </div>

            <h1 className="mt-7 max-w-4xl break-words font-serif text-[clamp(3.2rem,8vw,5.5rem)] font-medium leading-[1.02] tracking-tight">
              Olá, {participant.full_name}! 🎄
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-[#102C23]/60 sm:text-base">
              Aqui você vai ver o sortudo que você tirou !
            </p>

            <div className="mt-9 h-px w-full bg-[#102C23]/10 sm:mt-12" />
          </div>
        </section>

        {/* STATUS DO EVENTO */}
        <div className="mb-8 overflow-hidden rounded-[24px] border border-[#102C23]/[0.08] bg-white/80 p-5 shadow-[0_10px_40px_rgba(16,44,35,0.03)] sm:mb-10 sm:rounded-[28px] sm:p-7">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-start gap-4">
              <div className="hidden h-12 w-1 shrink-0 rounded-full bg-[#C7A35A] sm:block" />

              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight sm:text-base">
                  Amigo Secreto {event.event_year}
                </p>

                <p className="mt-2 text-sm leading-7 text-[#102C23]/60">
                  {event.status === "registration"
                    ? "Os lentos ainda estão se inscrevendo, quando todos terminarem faremos o sorteio."
                    : isDrawn
                    ? "O sorteio foi realizado! Sua surpresa está esperando."
                    : "Este evento foi finalizado."}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-5 py-2 text-xs font-semibold ${
                event.status === "registration"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : isDrawn
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              {event.status === "registration"
                ? "Aguardando sorteio"
                : isDrawn
                ? "Sorteio realizado"
                : "Finalizado"}
            </span>
          </div>
        </div>

        {/* CARDS PRINCIPAIS */}
        <div className="grid min-w-0 items-start gap-5 sm:gap-7 md:grid-cols-2">
          {/* CARD DO SORTEIO */}
          {isDrawn ? (
            <div className="min-w-0">
              <RevealGift />
            </div>
          ) : (
            <section className="relative isolate min-w-0 overflow-hidden rounded-[28px] bg-[#102C23] p-6 text-[#F7F2E8] shadow-[0_20px_60px_rgba(16,44,35,0.1)] sm:rounded-[32px] sm:p-9 lg:p-10">
              {/* ILUMINAÇÃO */}
              <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-[#C7A35A]/10 blur-[80px]" />

              <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#8E2830]/15 blur-[80px]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="text-5xl">
                    🎁
                  </div>

                  <span className="h-px w-12 bg-[#C7A35A]/50" />
                </div>

                <h2 className="mt-9 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                  Seu amigo secreto
                </h2>

                <div className="mt-6 h-px w-16 bg-[#C7A35A]/50" />

                <p className="mt-7 text-sm leading-8 text-white/65 sm:text-base">
                  {event.status === "registration"
                    ? "Aproveite para revisar suas dicas, pra não receberem dedoches ou livros usados."
                    : "O evento foi finalizado."}
                </p>

                <div className="mt-10 rounded-[22px] border border-[#C7A35A]/20 bg-white/[0.04] p-5 sm:p-6">
                  <p className="text-sm leading-8 text-[#C7A35A]">
                    ✨ A surpresa será revelada aqui assim que
                    o administrador lindo fizer o sorteio.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* CARD DAS DICAS */}
          <section className="min-w-0 rounded-[28px] border border-[#102C23]/[0.08] bg-white/85 p-6 shadow-[0_15px_50px_rgba(16,44,35,0.04)] sm:rounded-[32px] sm:p-9 lg:p-10">
            {/* CABEÇALHO */}
            <div className="flex items-center justify-between">
              <div className="text-5xl">
                ✨
              </div>

              <span className="h-px w-12 bg-[#C7A35A]" />
            </div>

            <h2 className="mt-9 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
              Minhas dicas
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#102C23]/60">
              Essas informações ajudam quem tirou você
              a escolher um presente especial.
            </p>

            <div className="mt-8 h-px w-full bg-[#102C23]/10" />

            {/* DICAS */}
            <div className="mt-8 space-y-6">
              {/* GOSTOS */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#102C23]">
                  O que você gosta
                </p>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#102C23]/65">
                  {preferences?.likes || "Não informado"}
                </p>
              </div>

              {/* SUGESTÕES */}
              <div className="min-w-0 border-t border-[#102C23]/10 pt-6">
                <p className="text-sm font-semibold text-[#102C23]">
                  Sugestões de presentes
                </p>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#102C23]/65">
                  {preferences?.gift_suggestions || "Não informado"}
                </p>
              </div>

              {/* TAMANHOS */}
              <div className="grid grid-cols-1 gap-5 border-t border-[#102C23]/10 pt-6 min-[360px]:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#102C23]">
                    Tamanho de roupa
                  </p>

                  <p className="mt-2 break-words text-sm leading-7 text-[#102C23]/65">
                    {preferences?.clothing_size || "Não informado"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#102C23]">
                    Número do calçado
                  </p>

                  <p className="mt-2 break-words text-sm leading-7 text-[#102C23]/65">
                    {preferences?.shoe_size || "Não informado"}
                  </p>
                </div>
              </div>

              {/* LINKS */}
              <div className="min-w-0 border-t border-[#102C23]/10 pt-6">
                <p className="text-sm font-semibold text-[#102C23]">
                  Links de presentes
                </p>

                <p className="mt-2 whitespace-pre-wrap break-all text-sm leading-7 text-[#102C23]/65">
                  {preferences?.product_links || "Não informado"}
                </p>
              </div>

              {/* OBSERVAÇÕES */}
              <div className="min-w-0 border-t border-[#102C23]/10 pt-6">
                <p className="text-sm font-semibold text-[#102C23]">
                  Observações
                </p>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#102C23]/65">
                  {preferences?.notes || "Não informado"}
                </p>
              </div>
            </div>

            {/* BOTÃO DE EDIÇÃO */}
            {canEdit ? (
              <Link
                href="/minha-conta/editar"
                className="mt-10 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#102C23] px-7 py-4 text-center text-sm font-semibold text-[#F7F2E8] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1D4939] hover:shadow-[0_10px_30px_rgba(16,44,35,0.12)] active:scale-[0.98] sm:w-auto"
              >
                Editar minhas dicas ✏️
              </Link>
            ) : (
              <p className="mt-10 rounded-2xl border border-[#102C23]/5 bg-[#F7F2E8] p-5 text-sm leading-7 text-[#102C23]/60">
                As edições das dicas estão encerradas.
              </p>
            )}
          </section>
        </div>

        {/* RODAPÉ */}
        <footer className="mt-16 text-center sm:mt-24">
          <div className="mx-auto mb-7 h-px w-20 bg-[#C7A35A]/60" />

          <p className="text-xs leading-7 tracking-wide text-[#102C23]/50 sm:text-sm">
            Fiquei 6 horas seguidas fazendo isso, não foi nada fácil então o espirito natalino esteja no coração de quem tirar seu amigo leonardo. 🎄
          </p>
        </footer>
      </div>
    </main>
  );
}
