
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function generateAccessCode() {
  return `AS-${randomBytes(5).toString("hex").toUpperCase()}`;
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    // Evento selecionado no ambiente
    const eventId = process.env.SECRET_SANTA_EVENT_ID;

    if (!eventId) {
      console.error("SECRET_SANTA_EVENT_ID não configurado.");

      return NextResponse.json(
        { error: "O evento ainda não foi configurado." },
        { status: 503 }
      );
    }

    const body = await request.json();

    const fullName = clean(body.fullName);
    const displayName = clean(body.displayName);
    const password = body.password;

    const likes = clean(body.likes);
    const giftSuggestions = clean(body.giftSuggestions);
    const clothingSize = clean(body.clothingSize);
    const shoeSize = clean(body.shoeSize);
    const productLinks = clean(body.productLinks);
    const notes = clean(body.notes);

    // Validação dos dados principais
    if (
      fullName.length < 2 ||
      fullName.length > 100 ||
      displayName.length < 2 ||
      displayName.length > 40 ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return NextResponse.json(
        {
          error:
            "Confira o nome e a palavra-chave (mínimo de 8 caracteres).",
        },
        { status: 400 }
      );
    }

    // Validação das dicas de presentes
    if (
      likes.length > 1000 ||
      giftSuggestions.length > 2000 ||
      clothingSize.length > 30 ||
      shoeSize.length > 30 ||
      productLinks.length > 2000 ||
      notes.length > 1000
    ) {
      return NextResponse.json(
        {
          error:
            "Um dos campos ultrapassou o tamanho permitido.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Busca exclusivamente o evento configurado
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

    // Impede cadastro após o encerramento das inscrições
    if (event.status !== "registration") {
      return NextResponse.json(
        {
          error: "Nenhum evento está aceitando inscrições.",
        },
        { status: 403 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let participant: { id: string } | null = null;
    let accessCode = "";

    // Tenta gerar um código individual único
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateAccessCode();

      const { data, error } = await supabase
        .from("participants")
        .insert({
          event_id: event.id,
          full_name: fullName,
          display_name: displayName,
          access_code: code,
          password_hash: passwordHash,
          is_admin: false,
        })
        .select("id")
        .single();

      if (!error && data) {
        participant = data;
        accessCode = code;
        break;
      }

      // Repetir somente se houver colisão do código único
      if (error?.code !== "23505") {
        throw error ?? new Error("Falha ao criar participante.");
      }
    }

    if (!participant) {
      throw new Error("Não foi possível gerar um código único.");
    }

    // Salva as dicas do participante
    const { error: preferencesError } = await supabase
      .from("gift_preferences")
      .insert({
        participant_id: participant.id,
        likes,
        gift_suggestions: giftSuggestions,
        clothing_size: clothingSize,
        shoe_size: shoeSize,
        product_links: productLinks,
        notes,
      });

    if (preferencesError) {
      // Desfaz o cadastro se as dicas não forem salvas
      const { error: rollbackError } = await supabase
        .from("participants")
        .delete()
        .eq("id", participant.id);

      if (rollbackError) {
        console.error(
          "Falha ao desfazer cadastro:",
          rollbackError
        );
      }

      throw preferencesError;
    }

    return NextResponse.json(
      {
        message: "Cadastro realizado com sucesso!",
        accessCode,
        displayName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no cadastro:", error);

    return NextResponse.json(
      {
        error: "Não foi possível concluir o cadastro.",
      },
      { status: 500 }
    );
  }
}
