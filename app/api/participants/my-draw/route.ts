
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { connection } from "next/server";

export async function GET() {
  await connection();
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Você precisa estar conectado." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: participant, error: participantError } =
      await supabase
        .from("participants")
        .select("id, event_id")
        .eq("id", session.participantId)
        .maybeSingle();

    if (participantError) throw participantError;

    if (!participant) {
      return NextResponse.json(
        { error: "Participante não encontrado." },
        { status: 404 }
      );
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("status")
      .eq("id", participant.event_id)
      .single();

    if (eventError) throw eventError;

    if (event.status !== "drawn") {
      return NextResponse.json({
        drawn: false,
        message: "O sorteio ainda não foi realizado.",
      });
    }

    const { data: draw, error: drawError } = await supabase
      .from("draw_results")
      .select("receiver_id")
      .eq("event_id", participant.event_id)
      .eq("giver_id", participant.id)
      .maybeSingle();

    if (drawError) throw drawError;

    if (!draw) {
      return NextResponse.json(
        { error: "Resultado não encontrado." },
        { status: 404 }
      );
    }

    const { data: receiver, error: receiverError } =
      await supabase
        .from("participants")
        .select("full_name, display_name")
        .eq("id", draw.receiver_id)
        .eq("event_id", participant.event_id)
        .single();

    if (receiverError) throw receiverError;

    const { data: preferences, error: preferencesError } =
      await supabase
        .from("gift_preferences")
        .select(
          "likes, gift_suggestions, clothing_size, shoe_size, product_links, notes"
        )
        .eq("participant_id", draw.receiver_id)
        .maybeSingle();

    if (preferencesError) throw preferencesError;

    return NextResponse.json(
      {
        drawn: true,
        receiver: {
          fullName: receiver.full_name,
          displayName: receiver.display_name,
          preferences,
        },
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao buscar sorteio:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar o sorteio." },
      { status: 500 }
    );
  }
}
