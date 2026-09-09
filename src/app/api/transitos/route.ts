import { NextResponse } from "next/server";
import { calcularTransitos } from "@/lib/transitos-reales";
import { generarDescripcionTransito } from "@/lib/transitos-descripcion";
import type { TransitoReal } from "@/lib/transitos-reales";

// Caché en memoria: sobrevive reinicios cálidos del servidor en Vercel
let cache: { data: TransitoReal[]; fecha: string } | null = null;

function fechaHoyKey() {
  return new Date().toISOString().slice(0, 10); // "2026-09-08"
}

export async function GET() {
  const hoy = fechaHoyKey();

  if (cache && cache.fecha === hoy) {
    return NextResponse.json(cache.data);
  }

  try {
    const transitosBase = calcularTransitos(new Date());

    // Generar descripciones en paralelo (8 llamadas simultáneas)
    const transitosCompletos = await Promise.all(
      transitosBase.map(async (t) => ({
        ...t,
        descripcion: await generarDescripcionTransito(t.transito),
      }))
    );

    cache = { data: transitosCompletos, fecha: hoy };

    return NextResponse.json(transitosCompletos);
  } catch (error) {
    console.error("Error calculando tránsitos:", error);
    return NextResponse.json({ error: "Error calculando tránsitos" }, { status: 500 });
  }
}
