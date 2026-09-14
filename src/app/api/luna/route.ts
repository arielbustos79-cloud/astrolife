import { NextResponse } from "next/server";
import { calcularFaseLunar } from "@/lib/luna";
import type { FaseLunar } from "@/lib/luna";

// Caché en memoria — revalidar cada 6 horas
let cache: { data: FaseLunar; timestamp: number } | null = null;
const CACHE_TTL = 6 * 60 * 60 * 1000;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const faseLunar = calcularFaseLunar(new Date());
  cache = { data: faseLunar, timestamp: Date.now() };
  return NextResponse.json(faseLunar);
}
