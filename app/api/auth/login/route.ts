
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Identifica o evento configurado neste ambiente.
    const eventId = process.env.SECRET_SANTA_EVENT_ID;

    if (!eventId) {
      console.error("SECRET_SANTA_EVENT_ID não configurado.");

      return NextResponse.json(
        { error: "O evento ainda não foi configurado." },
        { status: 503 }
      );
    }

    const body = await request.json();

    const accessCode =
      typeof body.accessCode === "string"
        ? body.accessCode.trim().toUpperCase()
        : "";

    const password = body.password;

    // Mantém as validações originais.
    if (
      !/^AS-[A-F0-9]{10}$/.test(accessCode) ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return NextResponse.json(
        { error: "Código ou palavra-chave inválidos." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Busca o participante apenas no evento configurado.
    const { data: participant, error } = await supabase
      .from("participants")
      .select("id, display_name, password_hash, event_id")
      .eq("access_code", accessCode)
      .eq("event_id", eventId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!participant) {
      return NextResponse.json(
        { error: "Código ou palavra-chave inválidos." },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      participant.password_hash
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Código ou palavra-chave inválidos." },
        { status: 401 }
      );
    }

    await createSession(participant.id);

    return NextResponse.json({
      message: "Login realizado com sucesso!",
      displayName: participant.display_name,
    });
  } catch (error) {
    console.error("Erro no login:", error);

    return NextResponse.json(
      { error: "Não foi possível realizar o login." },
      { status: 500 }
    );
  }
}
