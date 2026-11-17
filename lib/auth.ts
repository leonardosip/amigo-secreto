
import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const COOKIE_NAME = "amigo_secreto_session";

function getSecret() {
  const value = process.env.SESSION_SECRET;

  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET não configurada");
  }

  return new TextEncoder().encode(value);
}

function getConfiguredEventId() {
  const eventId = process.env.SECRET_SANTA_EVENT_ID;

  if (!eventId) {
    throw new Error(
      "SECRET_SANTA_EVENT_ID não configurado."
    );
  }

  return eventId;
}

export async function createSession(participantId: string) {
  // Confirma que o participante pertence ao evento
  // configurado antes de criar sua sessão.
  const eventId = getConfiguredEventId();

  const supabase = getSupabaseAdmin();

  const { data: participant, error } = await supabase
    .from("participants")
    .select("id")
    .eq("id", participantId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!participant) {
    throw new Error(
      "Participante não pertence ao evento configurado."
    );
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(participantId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    // Verifica a assinatura e a validade do JWT.
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });

    if (typeof payload.sub !== "string") {
      return null;
    }

    // Identifica o evento autorizado neste ambiente.
    const eventId = getConfiguredEventId();

    const supabase = getSupabaseAdmin();

    // Garante que a conta pertence ao evento atual.
    // Essa consulta também protege sessões criadas
    // antes da implementação dessa verificação.
    const { data: participant, error } = await supabase
      .from("participants")
      .select("id")
      .eq("id", payload.sub)
      .eq("event_id", eventId)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao verificar evento da sessão:",
        error
      );

      return null;
    }

    if (!participant) {
      return null;
    }

    return {
      participantId: participant.id,
    };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}
