"use client";

import { useState } from "react";

type Posts = { lunes: string; miercoles: string; viernes: string };

const CARDS: { key: keyof Posts; dia: string; descripcion: string }[] = [
  { key: "lunes",     dia: "Lunes",     descripcion: "Tránsito de la semana" },
  { key: "miercoles", dia: "Miércoles", descripcion: "Compatibilidad" },
  { key: "viernes",   dia: "Viernes",   descripcion: "Fin de semana astral" },
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
      // sin clipboard API: el usuario puede copiar manualmente
    }
  }

  const s = {
    page:    { minHeight: "100vh", backgroundColor: "#100A1A", padding: "40px 20px" } as React.CSSProperties,
    inner:   { maxWidth: 640, margin: "0 auto" } as React.CSSProperties,
    label:   { fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#888880", marginBottom: 20 },
    btnGen:  { width: "100%", backgroundColor: "#C8A96E", color: "#100A1A", border: "none", borderRadius: 8, padding: "13px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 24 } as React.CSSProperties,
    btnGenDisabled: { opacity: 0.5, cursor: "not-allowed" } as React.CSSProperties,
    cards:   { display: "flex", flexDirection: "column" as const, gap: 12 },
    card:    { backgroundColor: "#18102A", border: "1px solid #2A1F3D", borderRadius: 12, padding: "16px 20px" } as React.CSSProperties,
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } as React.CSSProperties,
    cardTitle: { fontSize: 14, fontWeight: 600, color: "#C8A96E" } as React.CSSProperties,
    cardText:  { fontSize: 14, lineHeight: 1.6, color: "#F0EDE8", margin: 0 } as React.CSSProperties,
    btnCopy: { backgroundColor: "transparent", border: "1px solid #2A1F3D", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#888880", cursor: "pointer" } as React.CSSProperties,
    error:   { backgroundColor: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 } as React.CSSProperties,
    skeleton:{ backgroundColor: "#2A1F3D", borderRadius: 4 } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <p style={s.label}>Panel Admin — Contenido semanal</p>

        <button
          onClick={generar}
          disabled={loading}
          style={{ ...s.btnGen, ...(loading ? s.btnGenDisabled : {}) }}
        >
          {loading ? "Generando con Claude…" : "Generar contenido semanal"}
        </button>

        {error && <div style={s.error}>{error}</div>}

        {loading && (
          <div style={s.cards}>
            {CARDS.map((c) => (
              <div key={c.key} style={{ ...s.card, opacity: 0.5 }}>
                <div style={{ ...s.skeleton, height: 14, width: 140, marginBottom: 12 }} />
                <div style={{ ...s.skeleton, height: 12, width: "100%", marginBottom: 8 }} />
                <div style={{ ...s.skeleton, height: 12, width: "80%", marginBottom: 8 }} />
                <div style={{ ...s.skeleton, height: 12, width: "55%" }} />
              </div>
            ))}
          </div>
        )}

        {posts && !loading && (
          <div style={s.cards}>
            {CARDS.map((c) => (
              <div key={c.key} style={s.card}>
                <div style={s.cardTop}>
                  <span style={s.cardTitle}>{c.dia} — {c.descripcion}</span>
                  <button
                    onClick={() => copiar(c.key)}
                    style={{ ...s.btnCopy, color: copied === c.key ? "#C8A96E" : "#888880" }}
                  >
                    {copied === c.key ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
                <p style={s.cardText}>{posts[c.key]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
