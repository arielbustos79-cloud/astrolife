"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { guardarCartaNatal } from "@/lib/supabase/actions";
import { CARTA_PENDIENTE_KEY } from "@/lib/astro/storage";
import type { BirthFormData } from "@/components/carta/BirthDataForm";
import type { NatalChart } from "@/lib/astro/ephemeris";

export function CartaPendienteSync() {
  useEffect(() => {
    const supabase = createClient();

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // No session — wipe all local astrolife data so the user starts fresh
        Object.keys(window.localStorage)
          .filter((k) => k.startsWith("astrolife:"))
          .forEach((k) => window.localStorage.removeItem(k));
        return;
      }

      // Session active — sync any carta natal saved before login
      const raw = window.localStorage.getItem(CARTA_PENDIENTE_KEY);
      if (!raw) return;
      try {
        const { birthData, chart } = JSON.parse(raw) as {
          birthData: BirthFormData;
          chart: NatalChart;
        };
        const result = await guardarCartaNatal(birthData, chart);
        if (result.success) {
          window.localStorage.removeItem(CARTA_PENDIENTE_KEY);
        }
      } catch {
        window.localStorage.removeItem(CARTA_PENDIENTE_KEY);
      }
    };

    void checkSession();
  }, []);

  return null;
}
