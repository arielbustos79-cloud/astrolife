"use server";

import { calculateNatalChart, type BirthInput, type NatalChart } from "@/lib/astro/ephemeris";

export async function getNatalChart(input: BirthInput): Promise<NatalChart> {
  return calculateNatalChart(input);
}
