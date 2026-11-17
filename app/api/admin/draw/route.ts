
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    // Evita requisições de outras origens.
    const origin = request.headers.get("origin");

    if (origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { error: "Origem não autorizada." },
        { status: 403 }
      );
    }

    // Identifica o evento autorizado neste ambiente.
    const eventId = process.env.SECRET_SANTA_EVENT_ID;

    if (!eventId) {
      console.error("SECRET_SANTA_EVENT_ID não configurado.");

      return NextResponse.json(
        { error: "O evento ainda não foi configurado." },
        { status: 503 }
      );
    }

    // Verifica se existe uma sessão válida.
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Você precisa estar conectado." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Confere se o usuário é administrador.
    const { data: admin, error: adminError } = await supabase
      .from("participants")
      .select("id, is_admin, event_id")
      .eq("id", session.participantId)
      .maybeSingle();

    if (adminError) {
      throw adminError;
    }

    if (!admin?.is_admin) {
      return NextResponse.json(
        { error: "Acesso exclusivo do administrador." },
        { status: 403 }
      );
    }

    // Bloqueia administradores vinculados a outro evento.
    if (admin.event_id !== eventId) {
      return NextResponse.json(
        {
          error:
            "Sua conta administrativa não pertence ao evento configurado neste ambiente.",
        },
        { status: 403 }
      );
    }

    // Busca exclusivamente o evento autorizado.
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, status")
      .eq("id", eventId)
      .maybeSingle();

    if (eventError) {
      throw eventError;
    }

    if (!event) {
      return NextResponse.json(
        { error: "Evento não encontrado." },
        { status: 404 }
      );
    }

    // Impede sorteios repetidos ou em eventos encerrados.
    if (event.status !== "registration") {
      return NextResponse.json(
        { error: "O sorteio já foi realizado ou encerrado." },
        { status: 409 }
      );
    }

    // Confere a quantidade de participantes.
    const { count, error: countError } = await supabase
      .from("participants")
      .select("id", { count: "exact", head: true })
      .eq("event_id", event.id);

    if (countError) {
      throw countError;
    }

    if ((count ?? 0) < 2) {
      return NextResponse.json(
        { error: "São necessários pelo menos 2 participantes." },
        { status: 400 }
      );
    }

    // Executa o sorteio de forma atômica no PostgreSQL.
    const { data, error: drawError } = await supabase.rpc(
      "execute_secret_santa_draw",
      { p_event_id: event.id }
    );

    if (drawError) {
      console.error("Erro no sorteio:", drawError.message);

      return NextResponse.json(
        {
          error:
            "Não foi possível concluir o sorteio. Verifique o estado do evento.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sorteio realizado com sucesso!",
      totalParticipants: data,
    });
  } catch (error) {
    console.error("Erro na API de sorteio:", error);

    return NextResponse.json(
      { error: "Erro interno ao realizar o sorteio." },
      { status: 500 }
    );
  }
}
