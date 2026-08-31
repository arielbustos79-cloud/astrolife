"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { NavHeader } from "@/components/ui/NavHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { BirthDataForm, type BirthFormData } from "@/components/carta/BirthDataForm";
import { ModalGuardarCarta } from "@/components/carta/ModalGuardarCarta";
import { NatalChartWheel } from "@/components/carta/NatalChartWheel";
import { PlanetList } from "@/components/carta/PlanetList";
import type { NatalChart } from "@/lib/astro/ephemeris";
import { getNatalChart } from "@/lib/astro/actions";
import { guardarCartaNatal } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import { BIRTH_DATA_STORAGE_KEY, CARTA_PENDIENTE_KEY } from "@/lib/astro/storage";

function formatBirthSubtitle(data: BirthFormData) {
  const [year, month, day] = data.date.split("-");
  return `${day}/${month}/${year} · ${data.time}h`;
}

export default function CartaNatalPage() {
  const [birthData, setBirthData] = useState<BirthFormData | null>(null);
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // After a successful calculation: save silently if session exists,
  // or show the save modal if not (only on explicit form submissions).
  const afterCalc = useCallback(
    async (data: BirthFormData, result: NatalChart, showSavePrompt: boolean) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { success } = await guardarCartaNatal(data, result);
        if (success) setGuardado(true);
      } else if (showSavePrompt) {
        setShowModal(true);
      }
    },
    [],
  );

  const loadChart = useCallback(
    async (data: BirthFormData, showSavePrompt = false) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getNatalChart(data);
        setChart(result);
        await afterCalc(data, result, showSavePrompt);
      } catch {
        setError("No se pudo calcular tu carta natal. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    },
    [afterCalc],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(BIRTH_DATA_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as BirthFormData;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBirthData(parsed);
        void loadChart(parsed, false); // no modal on auto-load
      } catch {
        window.localStorage.removeItem(BIRTH_DATA_STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, [loadChart]);

  function handleSubmit(data: BirthFormData) {
    setBirthData(data);
    setGuardado(false);
    window.localStorage.setItem(BIRTH_DATA_STORAGE_KEY, JSON.stringify(data));
    void loadChart(data, true); // show modal if no session
  }

  function handleEdit() {
    setChart(null);
    setShowModal(false);
    setGuardado(false);
  }

  async function handleGuardarConEmail(email: string) {
    if (!birthData || !chart) return;
    // Persist carta to localStorage so CartaPendienteSync can save it after login
    window.localStorage.setItem(
      CARTA_PENDIENTE_KEY,
      JSON.stringify({ birthData, chart }),
    );
    const supabase = createClient();
    const { error: sbError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (sbError) throw new Error(sbError.message);
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-bg pb-28">
        <NavHeader variant="dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-28">
      <NavHeader variant="dark" />

      {showModal && (
        <ModalGuardarCarta
          onGuardar={handleGuardarConEmail}
          onContinuar={() => setShowModal(false)}
        />
      )}

      {!birthData || !chart ? (
        <>
          <div className="px-4 pt-6">
            <p className="font-display text-[2rem] font-bold text-ink">
              {birthData ? "Editar datos de nacimiento" : "Tu carta natal"}
            </p>
            <p className="mt-1 text-sm leading-[1.6] text-ink-muted">
              Con tu fecha, hora y lugar de nacimiento calculamos tu carta
              real — no es un ejemplo genérico.
            </p>
          </div>
          <BirthDataForm
            onSubmit={handleSubmit}
            submitting={loading}
            initial={birthData ?? undefined}
          />
          {error && <p className="px-4 text-sm text-[#E8785A]">{error}</p>}
        </>
      ) : (
        <>
          <div className="px-5 pb-2 pt-1 text-center">
            <p
              className="font-display text-2xl font-semibold text-ink"
              style={{ textShadow: "0 0 20px rgba(200,169,110,0.3)" }}
            >
              {birthData.name || "Tu carta natal"}
            </p>
            <p className="text-[13px] text-ink-muted">
              {formatBirthSubtitle(birthData)}
            </p>
            {guardado && (
              <p className="mt-1 text-[11px] text-[#7BC47B]">✓ Guardada en tu cuenta</p>
            )}
          </div>

          <div className="mx-auto mb-5 w-full max-w-[480px] flex items-center justify-center rounded-card border border-[#3A2D5A] bg-surface-2 p-5 shadow-[inset_0_0_40px_rgba(123,111,160,0.1)]">
            <NatalChartWheel chart={chart} />
          </div>

          <div className="mb-3 flex items-center justify-between px-5">
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              Planetas
            </span>
            <button
              type="button"
              onClick={handleEdit}
              className="text-xs text-gold-dim"
            >
              Editar datos
            </button>
          </div>

          <PlanetList chart={chart} />

          <div className="px-5 pb-2 pt-4">
            <Link
              href="/astrid"
              className="flex items-center justify-center gap-2 rounded-full border border-violet/40 bg-gradient-to-br from-violet/30 to-gold/20 px-4 py-3.5 text-[13px] font-medium text-ink"
            >
              ✨ Interpretar con Astrid
            </Link>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
