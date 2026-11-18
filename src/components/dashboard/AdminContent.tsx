"use client";

import { useState } from "react";
import type { WeekPosts, DayPost } from "@/app/api/content/facebook/route";

type DayKey = keyof WeekPosts;

const CARDS: { key: DayKey; dia: string; descripcion: string }[] = [
  { key: "lunes",     dia: "Lunes",     descripcion: "Horóscopo semanal" },
  { key: "martes",    dia: "Martes",    descripcion: "Dato astral" },
  { key: "miercoles", dia: "Miércoles", descripcion: "Tránsito planetario" },
  { key: "jueves",    dia: "Jueves",    descripcion: "Pregunta interactiva" },
  { key: "viernes",   dia: "Viernes",   descripcion: "Fin de semana astral" },
  { key: "sabado",    dia: "Sábado",    descripcion: "Carta natal" },
  { key: "domingo",   dia: "Domingo",   descripcion: "Reflexión" },
];

function buildPreviewEl(post: DayPost, dia: string): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.style.cssText = [
    "position:fixed",
    "top:0",
    "left:0",
    "width:360px",
    "height:360px",
    "background:#100A1A",
    "display:flex",
    "flex-direction:column",
    "align-items:center",
    "justify-content:space-between",
    "padding:48px",
    "box-sizing:border-box",
    "z-index:99999",
    "font-family:sans-serif",
  ].join(";");

  // Badge del día — arriba centrado
  const badgeEl = document.createElement("div");
  badgeEl.style.cssText = [
    "font-size:11px",
    "letter-spacing:3px",
    "color:#C8A96E",
    "border:1px solid #C8A96E",
    "border-radius:20px",
    "padding:4px 12px",
    "font-family:sans-serif",
    "font-weight:600",
    "flex-shrink:0",
  ].join(";");
  badgeEl.textContent = dia.toUpperCase();

  // Símbolo zodiacal — ︎ fuerza presentación texto (no emoji con caja de color)
  const symbolEl = document.createElement("div");
  symbolEl.style.cssText = [
    "font-size:72px",
    "line-height:1",
    "color:#C8A96E",
    "text-align:center",
    "font-family:'Segoe UI Symbol',serif",
    "font-variant-emoji:text",
    "flex-shrink:0",
    "margin-bottom:24px",
  ].join(";");
  symbolEl.textContent = post.simbolo + "︎";

  const sep1 = document.createElement("div");
  sep1.style.cssText = "width:100%;height:1px;background:#2A1F3D;flex-shrink:0";

  const textEl = document.createElement("div");
  textEl.style.cssText = [
    "flex:1",
    "display:flex",
    "align-items:center",
    "text-align:center",
    "font-size:13px",
    "line-height:1.65",
    "color:#F0EDE8",
    "padding:10px 4px",
    "overflow:hidden",
  ].join(";");
  textEl.textContent = post.texto;

  const sep2 = document.createElement("div");
  sep2.style.cssText = "width:100%;height:1px;background:#2A1F3D;flex-shrink:0";

  const logoEl = document.createElement("div");
  logoEl.style.cssText = [
    "font-size:11px",
    "letter-spacing:3px",
    "color:#C8A96E",
    "font-family:sans-serif",
    "font-weight:600",
    "padding-top:12px",
    "flex-shrink:0",
  ].join(";");
  logoEl.textContent = "ASTROLIFE.CL";

  wrap.appendChild(badgeEl);
  wrap.appendChild(symbolEl);
  wrap.appendChild(sep1);
  wrap.appendChild(textEl);
  wrap.appendChild(sep2);
  wrap.appendChild(logoEl);

  return wrap;
}

export function AdminContent() {
  const [posts, setPosts] = useState<WeekPosts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<DayKey | null>(null);
  const [downloading, setDownloading] = useState<DayKey | null>(null);

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
      const data = (await res.json()) as WeekPosts;
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function copiar(key: DayKey) {
    if (!posts) return;
    try {
      await navigator.clipboard.writeText(posts[key].texto);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // sin clipboard API
    }
  }

  async function descargar(key: DayKey) {
    if (!posts) return;
    setDownloading(key);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const card = CARDS.find((c) => c.key === key)!;
      const el = buildPreviewEl(posts[key], card.dia);
      document.body.appendChild(el);

      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: "#100A1A",
        useCORS: true,
        logging: false,
      });

      document.body.removeChild(el);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `astrolife-${key}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error generando imagen:", err);
    } finally {
      setDownloading(null);
    }
  }

  const s = {
    page:    { minHeight: "100vh", backgroundColor: "#100A1A", padding: "40px 20px" } as React.CSSProperties,
    inner:   { maxWidth: 680, margin: "0 auto" } as React.CSSProperties,
    label:   { fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#888880", marginBottom: 20 },
    btnGen:  { width: "100%", backgroundColor: "#C8A96E", color: "#100A1A", border: "none", borderRadius: 8, padding: "13px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 24 } as React.CSSProperties,
    btnGenDisabled: { opacity: 0.5, cursor: "not-allowed" } as React.CSSProperties,
    cards:   { display: "flex", flexDirection: "column" as const, gap: 10 },
    card:    { backgroundColor: "#18102A", border: "1px solid #2A1F3D", borderRadius: 12, padding: "14px 18px" } as React.CSSProperties,
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } as React.CSSProperties,
    cardTitle: { fontSize: 13, fontWeight: 600, color: "#C8A96E" } as React.CSSProperties,
    cardActions: { display: "flex", gap: 6, alignItems: "center" } as React.CSSProperties,
    simbolo: { fontSize: 20, lineHeight: 1, marginRight: 8, color: "#C8A96E" } as React.CSSProperties,
    cardText:  { fontSize: 13, lineHeight: 1.65, color: "#F0EDE8", margin: 0 } as React.CSSProperties,
    btn:     { backgroundColor: "transparent", border: "1px solid #2A1F3D", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#888880", cursor: "pointer", whiteSpace: "nowrap" as const } as React.CSSProperties,
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
          {loading ? "Generando con Claude…" : "Generar 7 posts semanales"}
        </button>

        {error && <div style={s.error}>{error}</div>}

        {loading && (
          <div style={s.cards}>
            {CARDS.map((c) => (
              <div key={c.key} style={{ ...s.card, opacity: 0.5 }}>
                <div style={{ ...s.skeleton, height: 12, width: 160, marginBottom: 10 }} />
                <div style={{ ...s.skeleton, height: 11, width: "100%", marginBottom: 7 }} />
                <div style={{ ...s.skeleton, height: 11, width: "80%", marginBottom: 7 }} />
                <div style={{ ...s.skeleton, height: 11, width: "55%" }} />
              </div>
            ))}
          </div>
        )}

        {posts && !loading && (
          <div style={s.cards}>
            {CARDS.map((c) => (
              <div key={c.key} style={s.card}>
                <div style={s.cardTop}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={s.simbolo}>{posts[c.key].simbolo}</span>
                    <span style={s.cardTitle}>{c.dia} — {c.descripcion}</span>
                  </div>
                  <div style={s.cardActions}>
                    <button
                      onClick={() => copiar(c.key)}
                      style={{ ...s.btn, color: copied === c.key ? "#C8A96E" : "#888880", borderColor: copied === c.key ? "#C8A96E40" : "#2A1F3D" }}
                    >
                      {copied === c.key ? "¡Copiado!" : "Copiar"}
                    </button>
                    <button
                      onClick={() => descargar(c.key)}
                      disabled={downloading === c.key}
                      style={{ ...s.btn, color: "#7B6FA0", borderColor: "#7B6FA040", opacity: downloading === c.key ? 0.5 : 1 }}
                    >
                      {downloading === c.key ? "…" : "Imagen"}
                    </button>
                  </div>
                </div>
                <p style={s.cardText}>{posts[c.key].texto}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
