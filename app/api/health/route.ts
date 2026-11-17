
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("events")
      .select("id, title, event_year, status");

    if (error) {
      console.error("Erro no Supabase:", error.message);

      return NextResponse.json(
        {
          status: "error",
          message: "Falha ao consultar eventos",
          error: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "ok",
      database: "connected",
      totalEvents: data?.length ?? 0,
      events: data,
    });
  } catch (error) {
    console.error("Erro na verificação:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Serviço indisponível",
      },
      { status: 503 }
    );
  }
}
