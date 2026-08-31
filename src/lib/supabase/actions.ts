"use server";

import { createClient } from "@/lib/supabase/server";
import type { BirthFormData } from "@/components/carta/BirthDataForm";
import type { NatalChart } from "@/lib/astro/ephemeris";

export async function guardarCartaNatal(
  birthData: BirthFormData,
  chart: NatalChart,
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sin sesión" };

  const payload = {
    user_id: user.id,
    nombre: birthData.name?.trim() || null,
    fecha_nacimiento: birthData.date,
    hora_nacimiento: birthData.time,
    lugar_nacimiento: `${birthData.latitude},${birthData.longitude}`,
    utc_offset: birthData.utcOffsetHours,
    planetas: {
      sol: chart.sun,
      luna: chart.moon,
      venus: chart.venus,
      marte: chart.mars,
      saturno: chart.saturn,
    },
    casas: null,
    ascendente: `${chart.ascendant.sign} ${chart.ascendant.degree.toFixed(1)}°`,
    medio_cielo: `${chart.midheaven.sign} ${chart.midheaven.degree.toFixed(1)}°`,
    updated_at: new Date().toISOString(),
  };

  // Upsert: update if exists, insert if not
  const { data: existing } = await supabase
    .from("carta_natal")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("carta_natal").update(payload).eq("id", existing.id)
    : await supabase.from("carta_natal").insert(payload);

  if (error) return { error: error.message };
  return { success: true };
}
