"use client";

import { useState } from "react";

type Posts = { lunes: string; miercoles: string; viernes: string };

const CARDS: { key: keyof Posts; dia: string; descripcion: string; badgeBg: string; badgeText: string }[] = [
  { key: "lunes",    dia: "Lunes",     descripcion: "Tránsito planetario de la semana", badgeBg: "#C8A96E", badgeText: "#1A1208" },
  { key: "miercoles", dia: "Miércoles", descripcion: "Compatibilidad de signos",         badgeBg: "#7B6FA0", badgeText: "#FFFFFF" },
  { key: "viernes",  dia: "Viernes",   descripcion: "Predicción fin de semana",          badgeBg: "#C8A96E", badgeText: "#1A1208" },
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#100A1A" }}>
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8">
          <h1
            className="font-display mb-1 text-2xl font-bold"
            style={{ color: "#F0EDE8" }}
          >
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: "#888880" }}>
            Generador de contenido semanal para Facebook
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <button
            onClick={generar}
            disabled={loading}
            style={{
              backgroundColor: "#C8A96E",
              color: "#1A1208",
              borderRadius: "8px",
              padding: "12px 32px",
              fontSize: "15px",
              fontWeight: 600,
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Generando con Claude…" : "Generar contenido semanal"}
          </button>
        </div>

        {error && (
          <div
            className="mb-6 rounded-[10px] px-4 py-3 text-sm"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col gap-4">
            {CARDS.map((c) => (
              <div
                key={c.key}
                style={{
                  backgroundColor: "#18102A",
                  border: "1px solid #2A1F3D",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                  opacity: 0.6,
                }}
              >
                <div style={{ height: 20, width: 80, borderRadius: 4, backgroundColor: "#2A1F3D", marginBottom: 12 }} />
                <div style={{ height: 12, width: "100%", borderRadius: 4, backgroundColor: "#2A1F3D", marginBottom: 8 }} />
                <div style={{ height: 12, width: "80%", borderRadius: 4, backgroundColor: "#2A1F3D", marginBottom: 8 }} />
                <div style={{ height: 12, width: "60%", borderRadius: 4, backgroundColor: "#2A1F3D" }} />
              </div>
            ))}
          </div>
        )}

        {posts && !loading && (
          <div className="flex flex-col gap-4">
            {CARDS.map((c) => (
              <div
                key={c.key}
                style={{
                  backgroundColor: "#18102A",
                  border: "1px solid #2A1F3D",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span
                      style={{
                        backgroundColor: c.badgeBg,
                        color: c.badgeText,
                        borderRadius: "6px",
                        padding: "2px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {c.dia}
                    </span>
                    <span style={{ color: "#888880", fontSize: "13px" }}>{c.descripcion}</span>
                  </div>
                  <button
                    onClick={() => copiar(c.key)}
                    style={{
                      flexShrink: 0,
                      border: "1px solid #2A1F3D",
                      borderRadius: "6px",
                      padding: "3px 12px",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: copied === c.key ? "#C8A96E" : "#888880",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      transition: "color 0.15s, border-color 0.15s",
                    }}
                  >
                    {copied === c.key ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "#F0EDE8", margin: 0 }}>
                  {posts[c.key]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
