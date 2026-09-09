"use client";

import { useEffect, useState } from "react";
import { NavHeader } from "@/components/ui/NavHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import type { TransitoReal } from "@/lib/transitos-reales";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function mesActual() {
  return capitalize(
    new Date().toLocaleDateString("es-CL", { month: "long", year: "numeric" })
  );
}

function mesNombre() {
  return new Date().toLocaleDateString("es-CL", { month: "long" });
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-line bg-surface p-4">
      <div className="h-11 w-11 flex-shrink-0 animate-pulse rounded-full bg-[#D4CEC4]" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-[#D4CEC4]" />
        <div className="h-2.5 w-full animate-pulse rounded-full bg-[#D4CEC4]" />
        <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-[#D4CEC4]" />
      </div>
      <div className="h-6 w-14 animate-pulse flex-shrink-0 rounded-full bg-[#D4CEC4]" />
    </div>
  );
}

export default function TransitosPage() {
  const [transitos, setTransitos] = useState<TransitoReal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/transitos")
      .then((r) => {
        if (!r.ok) throw new Error("Error HTTP");
        return r.json();
      })
      .then((data: TransitoReal[]) => {
        setTransitos(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-bg pb-28">
      <NavHeader variant="dark" />

      {/* Header */}
      <div className="px-5 pb-5 pt-2">
        <h1 className="font-display text-[26px] font-bold leading-tight text-ink">
          Tránsitos de {mesNombre()}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{mesActual()}</p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 px-4">
        {loading &&
          Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)}

        {error && (
          <p className="py-8 text-center text-sm text-ink-muted">
            No se pudieron cargar los tránsitos. Intenta de nuevo en unos momentos.
          </p>
        )}

        {!loading &&
          !error &&
          transitos.map((t) => (
            <div
              key={t.planeta}
              className="flex cursor-default select-none items-center gap-4 rounded-[18px] border border-line bg-surface p-4"
            >
              {/* Símbolo */}
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-2xl leading-none"
                style={{ color: t.color, background: `${t.color}18` }}
              >
                {t.simbolo}
              </span>

              {/* Texto */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">
                  {t.transito}
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.4] text-ink-muted">
                  {t.descripcion}
                </p>
              </div>

              {/* Badge */}
              <span
                className="flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{ background: "#7B6FA022", color: "#A898C8" }}
              >
                Activo
              </span>
            </div>
          ))}
      </div>

      {/* Nota */}
      <p className="mt-6 px-5 text-center text-[12px] text-ink-muted">
        ✨ Próximamente: tránsitos personalizados según tu carta natal
      </p>

      <BottomNav />
    </div>
  );
}
