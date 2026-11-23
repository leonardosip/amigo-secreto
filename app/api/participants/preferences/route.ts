
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const fields = [
  "likes",
  "gift_suggestions",
  "clothing_size",
  "shoe_size",
  "product_links",
  "notes",
] as const;

const limits: Record<(typeof fields)[number], number> = {
  likes: 1000,
  gift_suggestions: 2000,
  clothing_size: 30,
  shoe_size: 30,
  product_links: 2000,
  notes: 1000,
};

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("gift_preferences")
    .select(fields.join(","))
    .eq("participant_id", session.participantId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao carregar dicas" },
      { status: 500 }
    );
  }

  return NextResponse.json({ preferences: data });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }

  // Proteção básica contra requisições de outra origem.
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;

  if (origin !== expectedOrigin) {
    return NextResponse.json(
      { error: "Origem não autorizada" },
      { status: 403 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido" },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Dados inválidos" },
      { status: 400 }
    );
  }

  const input = body as Record<string, unknown>;
  const updates: Record<string, string> = {};

  for (const field of fields) {
    const value = input[field];

    if (
      typeof value !== "string" ||
      value.trim().length > limits[field]
    ) {
      return NextResponse.json(
        { error: `Campo inválido: ${field}` },
        { status: 400 }
      );
    }

    updates[field] = value.trim();
  }

  const supabase = getSupabaseAdmin();

  const { data: participant, error: participantError } =
    await supabase
      .from("participants")
      .select("event_id")
      .eq("id", session.participantId)
      .maybeSingle();

  if (participantError || !participant) {
    return NextResponse.json(
      { error: "Participante não encontrado" },
      { status: 404 }
    );
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("status")
    .eq("id", participant.event_id)
    .single();

  if (eventError || !event) {
    return NextResponse.json(
      { error: "Evento não encontrado" },
      { status: 404 }
    );
  }

  // Permite editar antes e depois do sorteio, até o evento ser finalizado.
  if (event.status !== "registration" && event.status !== "drawn") {
    return NextResponse.json(
      { error: "As edições deste evento estão encerradas." },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("gift_preferences")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("participant_id", session.participantId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "Não foi possível salvar as alterações." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Dicas atualizadas com sucesso!",
  });
}
