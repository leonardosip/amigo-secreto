
import DrawButton from "./DrawButton";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { connection } from "next/server";

export default async function AdminContent() {
  await connection();

  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const supabase = getSupabaseAdmin();

  // Confere se o participante é administrador
  const { data: admin, error: adminError } = await supabase
    .from("participants")
    .select("id, full_name, is_admin, event_id")
    .eq("id", session.participantId)
    .maybeSingle();

  if (adminError) {
    throw new Error("Erro ao verificar permissões.");
  }

  if (!admin?.is_admin) {
    redirect("/minha-conta");
  }

  // Identifica o evento autorizado neste ambiente
  const eventId = process.env.SECRET_SANTA_EVENT_ID;

  if (!eventId) {
    throw new Error("SECRET_SANTA_EVENT_ID não configurado.");
  }

  // Impede acesso de administradores de outros eventos
  if (admin.event_id !== eventId) {
    notFound();
  }

  // Busca o evento vinculado ao administrador
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, event_year, status")
    .eq("id", admin.event_id)
    .single();

  if (eventError || !event) {
    throw new Error("Evento não encontrado.");
  }

  // Busca os participantes do evento
  const { data: participants, error: participantsError } =
    await supabase
      .from("participants")
      .select("id, full_name, display_name, created_at")
      .eq("event_id", event.id)
      .order("created_at", { ascending: true });

  if (participantsError) {
    throw new Error("Erro ao carregar participantes.");
  }

  const ids = (participants ?? []).map((p) => p.id);

  // Busca as dicas dos participantes
  const { data: preferences, error: preferencesError } =
    ids.length > 0
      ? await supabase
          .from("gift_preferences")
          .select("participant_id, likes, gift_suggestions")
          .in("participant_id", ids)
      : { data: [], error: null };

  if (preferencesError) {
    throw new Error("Erro ao carregar dicas.");
  }

  const preferencesMap = new Map(
    (preferences ?? []).map((p) => [p.participant_id, p])
  );

  const total = participants?.length ?? 0;

  const completed = (participants ?? []).filter((p) => {
    const pref = preferencesMap.get(p.id);

    return Boolean(
      pref?.likes?.trim() || pref?.gift_suggestions?.trim()
    );
  }).length;

  const statusLabel =
    event.status === "registration"
      ? "Inscrições abertas"
      : event.status === "drawn"
        ? "Sorteio realizado"
        : "Evento finalizado";

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  }

  function hasPreferences(participantId: string) {
    const pref = preferencesMap.get(participantId);

    return Boolean(
      pref?.likes?.trim() || pref?.gift_suggestions?.trim()
    );
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F2E8] text-[#102C23]">
      {/* HEADER */}
      <header className="bg-[#102C23] px-4 py-4 text-[#F7F2E8] sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link
            href="/"
            className="min-w-0 font-serif text-base text-[#C7A35A] sm:text-xl"
          >
            ✦ Amigo Secreto
          </Link>

          <Link
            href="/minha-conta"
            className="flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 sm:px-5"
          >
            Minha conta
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* APRESENTAÇÃO */}
        <div className="mb-9 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8E2830] sm:tracking-[0.3em]">
            Área administrativa
          </p>

          <h1 className="mt-4 break-words font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
            Olá, {admin.full_name}! 👑
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#102C23]/60 sm:text-base">
            Gerencie os participantes e acompanhe nosso
            amigo secreto.
          </p>
        </div>

        {/* CARDS DE ESTATÍSTICAS */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          <div className="min-w-0 rounded-3xl bg-[#102C23] p-6 text-white sm:p-7">
            <p className="text-sm text-white/60">
              Participantes cadastrados
            </p>

            <p className="mt-4 font-serif text-5xl text-[#C7A35A]">
              {total}
            </p>
          </div>

          <div className="min-w-0 rounded-3xl border border-[#102C23]/10 bg-white p-6 sm:p-7">
            <p className="text-sm text-[#102C23]/60">
              Com dicas preenchidas
            </p>

            <p className="mt-4 font-serif text-5xl">
              {completed}
              <span className="ml-2 text-xl text-[#102C23]/40">
                / {total}
              </span>
            </p>
          </div>

          <div className="min-w-0 rounded-3xl border border-[#102C23]/10 bg-white p-6 sm:col-span-2 sm:p-7 lg:col-span-1">
            <p className="text-sm text-[#102C23]/60">
              Situação do evento
            </p>

            <p className="mt-5 text-lg font-semibold text-[#8E2830]">
              {statusLabel}
            </p>
          </div>
        </div>

        {/* LISTA DE PARTICIPANTES */}
        <section className="mt-10 sm:mt-12">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <h2 className="font-serif text-2xl sm:text-3xl">
                Participantes 🎁
              </h2>

              <p className="mt-2 break-words text-sm text-[#102C23]/60">
                {event.title} — {total} inscritos
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#EDE5D6] px-5 py-2 text-sm font-medium">
              {statusLabel}
            </span>
          </div>

          {/* LISTA MOBILE */}
          <div className="grid gap-3 md:hidden">
            {(participants ?? []).map((participant) => {
              const hasTips = hasPreferences(participant.id);

              return (
                <article
                  key={participant.id}
                  className="min-w-0 rounded-2xl border border-[#102C23]/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-base font-semibold">
                        {participant.full_name}
                      </p>

                      <p className="mt-1 break-words text-xs text-[#102C23]/50">
                        {participant.display_name}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                        hasTips
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {hasTips ? "Preenchidas" : "Pendentes"}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-[#102C23]/10 pt-4">
                    <p className="text-xs text-[#102C23]/50">
                      Data do cadastro
                    </p>

                    <p className="mt-1 text-sm text-[#102C23]/75">
                      {formatDate(participant.created_at)}
                    </p>
                  </div>
                </article>
              );
            })}

            {total === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#102C23]/60">
                Nenhum participante cadastrado ainda.
              </div>
            )}
          </div>

          {/* TABELA DESKTOP */}
          <div className="hidden overflow-hidden rounded-3xl border border-[#102C23]/10 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#102C23] text-[#F7F2E8]">
                <tr>
                  <th className="px-6 py-5 font-medium">
                    Participante
                  </th>

                  <th className="px-6 py-5 font-medium">
                    Data do cadastro
                  </th>

                  <th className="px-6 py-5 font-medium">
                    Dicas
                  </th>
                </tr>
              </thead>

              <tbody>
                {(participants ?? []).map((participant) => {
                  const hasTips = hasPreferences(participant.id);

                  return (
                    <tr
                      key={participant.id}
                      className="border-b border-[#102C23]/10 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <p className="break-words font-semibold">
                          {participant.full_name}
                        </p>

                        <p className="mt-1 break-words text-xs text-[#102C23]/50">
                          {participant.display_name}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-[#102C23]/70">
                        {formatDate(participant.created_at)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={
                            hasTips
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                              : "rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
                          }
                        >
                          {hasTips ? "Preenchidas" : "Pendentes"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {total === 0 && (
              <p className="p-10 text-center text-[#102C23]/60">
                Nenhum participante cadastrado ainda.
              </p>
            )}
          </div>
        </section>

        {/* ÁREA DO SORTEIO */}
        <section className="mt-10 min-w-0 rounded-3xl bg-[#102C23] p-6 text-white sm:mt-12 sm:p-8 md:p-10">
          <div className="flex flex-col items-stretch justify-between gap-7 md:flex-row md:items-center">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C7A35A] sm:text-sm">
                Sorteio oficial
              </p>

              <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
                Realizar sorteio 🎄
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">
                Quando todos estiverem cadastrados,
                você poderá realizar o sorteio geral.
                Cada participante descobrirá seu resultado
                individualmente.
              </p>
            </div>

            <div className="w-full shrink-0 md:w-auto">
              <DrawButton
                totalParticipants={total}
                eventStatus={event.status}
              />
            </div>
          </div>
        </section>

        {/* RODAPÉ */}
        <footer className="mt-12 text-center text-xs leading-6 text-[#102C23]/50 sm:mt-16 sm:text-sm">
          Painel administrativo • Amigo Secreto {event.event_year}
        </footer>
      </div>
    </main>
  );
}
