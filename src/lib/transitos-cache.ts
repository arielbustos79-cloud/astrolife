// Server-only — caché de tránsitos generales con Next.js unstable_cache (24 h)

import { unstable_cache } from "next/cache";
import { calcularTransitos } from "@/lib/transitos-reales";
import { generarDescripcionTransito } from "@/lib/transitos-descripcion";
import type { TransitoReal } from "@/lib/transitos-reales";

export const getTransitosGenerales = unstable_cache(
  async (): Promise<TransitoReal[]> => {
    const base = calcularTransitos(new Date());
    return Promise.all(
      base.map(async (t) => ({
        ...t,
        descripcion: await generarDescripcionTransito(t.transito),
      }))
    );
  },
  ["transitos-generales"],
  { revalidate: 86400, tags: ["transitos-generales"] }
);
