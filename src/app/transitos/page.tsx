"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NavHeader } from "@/components/ui/NavHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import type { TransitoReal, TransitoPersonal } from "@/lib/transitos-reales";

type TransitosResponse = {
  generales: TransitoReal[];
  personales: TransitoPersonal[];
  tieneCartaNatal: boolean;
};

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

function CardGeneral({ t }: { t: TransitoReal }) {
  return (
    <div className="flex cursor-default select-none items-center gap-4 rounded-[18px] border border-line bg-surface p-4">
      <span
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-2xl leading-none"
        style={{ color: t.color, background: `${t.color}18` }}
      >
        {t.simbolo}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-ink">{t.transito}</p>
        <p className="mt-0.5 text-[12px] leading-[1.4] text-ink-muted">{t.descripcion}</p>
      </div>
      <span
        className="flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
        style={{ background: "#7B6FA022", color: "#A898C8" }}
      >
        Activo
      </span>
    </div>
  );
}

function CardPersonal({ t }: { t: TransitoPersonal }) {
  const esAlta = t.intensidad === "alta";
  return (
    <div
      className="cursor-default select-none rounded-[18px] p-4"
      style={{
        background: esAlta ? "rgba(200,169,110,0.08)" : "var(--surface)",
        border: esAlta
          ? "1px solid rgba(200,169,110,0.35)"
          : "1px solid var(--line)",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl leading-none"
          style={{
            color: t.transito.color,
            background: `${t.transito.color}18`,
          }}
        >
          {t.transito.simbolo}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-ink">
            {t.transito.planeta}{" "}
            <span className="font-normal text-ink-muted">{t.simboloAspecto}</span>{" "}
            tu {t.planetaNatal} natal
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">
            {t.aspecto} · {t.diferencia}°
            {esAlta && (
              <span
                className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: "rgba(200,169,110,0.18)", color: "#C8A96E" }}
              >
                Alta intensidad
              </span>
            )}
          </p>
          <p className="mt-1.5 text-[12px] leading-[1.4] text-ink-muted">
            {t.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
}

function CTACartaNatal() {
  return (
    <div
      className="rounded-[18px] p-5 text-center"
      style={{ background: "rgba(123,111,160,0.12)", border: "1px solid rgba(123,111,160,0.25)" }}
    >
      <p className="text-[22px]">✨</p>
      <p className="mt-1 text-[15px] font-semibold text-ink">
        Descubre tus tránsitos personales
      </p>
      <p className="mt-1 text-[13px] text-ink-muted">
        Calcula tu carta natal para ver qué planetas te afectan este mes.
      </p>
      <Link
        href="/carta-natal"
        className="mt-4 inline-block rounded-full px-5 py-2.5 text-[13px] font-semibold text-[#100A1A]"
        style={{ background: "#C8A96E" }}
      >
        Calcular mi carta natal →
      </Link>
    </div>
  );
}

export default function TransitosPage() {
  const [data, setData] = useState<TransitosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/transitos")
      .then((r) => {
        if (!r.ok) throw new Error("Error HTTP");
        return r.json();
      })
      .then((res: TransitosResponse) => {
        setData(res);
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

      <div className="px-5 pb-5 pt-2">
        <h1 className="font-display text-[26px] font-bold leading-tight text-ink">
          Tránsitos de {mesNombre()}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{mesActual()}</p>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {loading && Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)}

        {error && (
          <p className="py-8 text-center text-sm text-ink-muted">
            No se pudieron cargar los tránsitos. Intenta de nuevo en unos momentos.
          </p>
        )}

        {!loading && !error && data && (
          <>
            {/* Sección personal — solo si hay carta natal */}
            {data.tieneCartaNatal && data.personales.length > 0 && (
              <section className="mb-2">
                <h2 className="mb-3 px-1 text-[13px] font-semibold uppercase tracking-wider text-ink-muted">
                  Tránsitos que te afectan
                </h2>
                <div className="flex flex-col gap-3">
                  {data.personales.map((t, i) => (
                    <CardPersonal key={`${t.transito.planeta}-${t.planetaNatal}-${i}`} t={t} />
                  ))}
                </div>
              </section>
            )}

            {/* CTA carta natal — si no tiene */}
            {!data.tieneCartaNatal && <CTACartaNatal />}

            {/* Separador antes de generales */}
            {data.tieneCartaNatal && (
              <h2 className="mt-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-ink-muted">
                Tránsitos del mes
              </h2>
            )}

            {/* Tránsitos generales */}
            {data.generales.map((t) => (
              <CardGeneral key={t.planeta} t={t} />
            ))}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
