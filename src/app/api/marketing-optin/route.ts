import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { optin } = (await request.json()) as { optin: boolean };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sin sesión" }, { status: 401 });

  // 1. Upsert marketing_optin en perfil
  await supabase.from("perfil").upsert(
    { user_id: user.id, marketing_optin: optin },
    { onConflict: "user_id" }
  );

  // 2. Si optin activo, suscribir a Brevo lista #4
  if (optin && process.env.BREVO_API_KEY) {
    const { data: carta } = await supabase
      .from("carta_natal")
      .select("planetas")
      .eq("user_id", user.id)
      .maybeSingle();

    const signo: string | undefined =
      (carta?.planetas as { sol?: { sign?: string } } | null)?.sol?.sign;

    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: user.email,
        listIds: [4],
        attributes: { SIGNO: signo ?? "" },
        updateEnabled: true,
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
