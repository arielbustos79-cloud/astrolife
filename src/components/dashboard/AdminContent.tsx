"use client";

import { useState } from "react";

type Posts = { lunes: string; miercoles: string; viernes: string };

const CARDS: { key: keyof Posts; dia: string; descripcion: string }[] = [
  { key: "lunes", dia: "Lunes", descripcion: "Tránsito planetario de la semana" },
  { key: "miercoles", dia: "Miércoles", descripcion: "Compatibilidad de signos" },
  { key: "viernes", dia: "Viernes", descripcion: "Predicción fin de semana" },
];

export function AdminContent() {
  const [posts, setPosts] = useState<Posts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<keyof Posts | null>(null);

  async function generar() {
    setLoading(true);
    setError(null);
    setPosts(null);

    try {
      const res = await fetch("/api/content/facebook");
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `Error ${res.status}`);
      }
      const data = (await res.json()) as Posts;
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function copiar(key: keyof Posts) {
    if (!posts) return;
    try {
      await navigator.clipboard.writeText(posts[key]);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback: seleccionar el texto manualmente
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="mb-8">
        <h1 className="font-display mb-1 text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-muted">Generador de contenido semanal para Facebook</p>
      </div>

      <button
        onClick={generar}
        disabled={loading}
        className="mb-8 w-full rounded-full bg-gold py-3.5 text-[15px] font-semibold text-bg transition-opacity hover:opacity-[.88] disabled:opacity-50"
      >
        {loading ? "Generando con Claude…" : "Generar contenido semanal"}
      </button>

      {error && (
        <div className="mb-6 rounded-[10px] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-4">
          {CARDS.map((c) => (
            <div
              key={c.key}
              className="animate-pulse rounded-[14px] border border-line bg-surface p-5"
            >
              <div className="mb-3 h-4 w-24 rounded bg-line" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-line" />
                <div className="h-3 w-4/5 rounded bg-line" />
                <div className="h-3 w-3/5 rounded bg-line" />
              </div>
            </div>
          ))}
        </div>
      )}

      {posts && !loading && (
        <div className="flex flex-col gap-4">
          {CARDS.map((c) => (
            <div key={c.key} className="rounded-[14px] border border-line bg-surface p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-semibold text-ink">{c.dia}</span>
                  <span className="ml-2 text-xs text-ink-muted">{c.descripcion}</span>
                </div>
                <button
                  onClick={() => copiar(c.key)}
                  className="flex-shrink-0 rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-gold hover:text-gold"
                >
                  {copied === c.key ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
              <p className="text-sm leading-relaxed text-ink">{posts[c.key]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
