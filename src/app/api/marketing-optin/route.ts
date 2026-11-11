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
  console.log("[marketing-optin] optin:", optin, "BREVO_API_KEY set:", !!process.env.BREVO_API_KEY);
  if (optin && process.env.BREVO_API_KEY) {
    const { data: carta } = await supabase
      .from("carta_natal")
      .select("planetas")
      .eq("user_id", user.id)
      .maybeSingle();

    const signo: string | undefined =
      (carta?.planetas as { sol?: { sign?: string } } | null)?.sol?.sign;

    const brevoPayload = {
      email: user.email,
      listIds: [4],
      attributes: { SIGNO: signo ?? "" },
      updateEnabled: true,
    };
    console.log("[marketing-optin] Enviando a Brevo:", JSON.stringify(brevoPayload));

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(brevoPayload),
    });
    const brevoBody = await brevoRes.text();
    console.log("[marketing-optin] Brevo respuesta:", brevoRes.status, brevoBody);
  }

  return NextResponse.json({ ok: true });
}
