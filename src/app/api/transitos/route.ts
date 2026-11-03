import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calcularTransitosPersonales } from "@/lib/transitos-reales";
import { generarDescripcionPersonal } from "@/lib/transitos-descripcion";
import type { TransitoPersonal } from "@/lib/transitos-reales";
import { getTransitosGenerales } from "@/lib/transitos-cache";

export async function GET() {
  try {
    const generales = await getTransitosGenerales();

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ generales, personales: [], tieneCartaNatal: false });
    }

    const { data: carta } = await supabase
      .from("carta_natal")
      .select("planetas")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!carta?.planetas) {
      return NextResponse.json({ generales, personales: [], tieneCartaNatal: false });
    }

    const transitosSinDesc = calcularTransitosPersonales(generales, carta.planetas);

    const personales: TransitoPersonal[] = await Promise.all(
      transitosSinDesc.map(async (t) => ({
        ...t,
        descripcion: await generarDescripcionPersonal(
          t.transito.planeta,
          t.aspecto,
          t.planetaNatal
        ),
      }))
    );

    return NextResponse.json({ generales, personales, tieneCartaNatal: personales.length > 0 });
  } catch (error) {
    console.error("Error calculando tránsitos:", error);
    return NextResponse.json({ error: "Error calculando tránsitos" }, { status: 500 });
  }
}
