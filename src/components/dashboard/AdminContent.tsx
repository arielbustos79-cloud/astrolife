"use client";

import { useState } from "react";
import type { WeekPosts, DayPost } from "@/app/api/content/facebook/route";
import type { CarruselData } from "@/app/api/content/carrusel/route";

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

// ─── Post download element ────────────────────────────────────────────────────
function buildPreviewEl(post: DayPost, dia: string): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:fixed;top:0;left:0;width:360px;height:360px;background:#100A1A;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:48px;box-sizing:border-box;z-index:99999;font-family:sans-serif";

  const badge = document.createElement("div");
  badge.style.cssText = "font-size:11px;letter-spacing:3px;color:#C8A96E;border:1px solid #C8A96E;border-radius:20px;padding:4px 12px;font-weight:600;flex-shrink:0";
  badge.textContent = dia.toUpperCase();

  const sym = document.createElement("div");
  sym.style.cssText = "font-size:72px;line-height:1;color:#C8A96E;text-align:center;font-family:'Segoe UI Symbol',serif;font-variant-emoji:text;flex-shrink:0;margin-bottom:24px";
  sym.textContent = post.simbolo + "︎";

  const sep1 = document.createElement("div");
  sep1.style.cssText = "width:100%;height:1px;background:#2A1F3D;flex-shrink:0";

  const txt = document.createElement("div");
  txt.style.cssText = "flex:1;display:flex;align-items:center;text-align:center;font-size:13px;line-height:1.65;color:#F0EDE8;padding:10px 4px;overflow:hidden";
  txt.textContent = post.texto;

  const sep2 = document.createElement("div");
  sep2.style.cssText = "width:100%;height:1px;background:#2A1F3D;flex-shrink:0";

  const logo = document.createElement("div");
  logo.style.cssText = "font-size:11px;letter-spacing:3px;color:#C8A96E;font-weight:600;padding-top:12px;flex-shrink:0";
  logo.textContent = "ASTROLIFE.CL";

  wrap.append(badge, sym, sep1, txt, sep2, logo);
  return wrap;
}

// ─── Mini preview (180×180, native render — no transforms) ───────────────────
const P: React.CSSProperties = { margin: 0 };
const msep: React.CSSProperties = { width: "100%", height: 1, background: "#2A1F3D", flexShrink: 0 };
const mlogo: React.CSSProperties = { fontSize: 6, letterSpacing: "3px", color: "#C8A96E", fontFamily: "sans-serif", fontWeight: 600, margin: 0, paddingTop: 6 };
const mbase: React.CSSProperties = { width: 180, height: 180, background: "#100A1A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 14px", boxSizing: "border-box" };

function MiniSlide1({ d }: { d: CarruselData["slide1"] }) {
  return (
    <div style={mbase}>
      <div style={{ fontSize: 26, color: "#C8A96E", fontFamily: "serif", lineHeight: 1, flexShrink: 0 }}>✦</div>
      <div style={msep} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 2px" }}>
        <p style={{ ...P, fontSize: 11, fontFamily: "Georgia, serif", color: "#F0EDE8", textAlign: "center", lineHeight: 1.3, fontWeight: 700 }}>{d.titulo}</p>
        <p style={{ ...P, fontSize: 7, color: "#888880", textAlign: "center", lineHeight: 1.4 }}>{d.subtitulo}</p>
      </div>
      <div style={msep} />
      <p style={mlogo}>ASTROLIFE.CL</p>
    </div>
  );
}

function MiniSlide2({ d }: { d: CarruselData["slide2"] }) {
  return (
    <div style={mbase}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0 }}>
        <div style={{ fontSize: 34, lineHeight: 1, color: "#C8A96E", fontFamily: "'Segoe UI Symbol',serif" }}>{d.simbolo + "︎"}</div>
        <p style={{ ...P, fontSize: 7, letterSpacing: "2px", color: "#C8A96E", textTransform: "uppercase", fontWeight: 600 }}>{d.signo}</p>
      </div>
      <div style={msep} />
      <p style={{ ...P, flex: 1, fontSize: 8, lineHeight: 1.6, color: "#F0EDE8", textAlign: "center", display: "flex", alignItems: "center", padding: "0 2px" }}>{d.texto}</p>
      <div style={msep} />
      <p style={mlogo}>ASTROLIFE.CL</p>
    </div>
  );
}

function MiniSlide3({ d }: { d: CarruselData["slide3"] }) {
  const col: React.CSSProperties = { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "0 8px" };
  return (
    <div style={{ ...mbase, padding: "14px 0 12px" }}>
      <div style={{ display: "flex", flex: 1, width: "100%", alignItems: "center" }}>
        <div style={col}>
          <div style={{ fontSize: 24, lineHeight: 1, color: "#C8A96E", fontFamily: "'Segoe UI Symbol',serif" }}>{d.simbolo1 + "︎"}</div>
          <p style={{ ...P, fontSize: 6, letterSpacing: "2px", color: "#C8A96E", textTransform: "uppercase", fontWeight: 600 }}>{d.signo1}</p>
          <div style={{ width: "100%", height: 1, background: "#2A1F3D" }} />
          <p style={{ ...P, fontSize: 7, lineHeight: 1.5, color: "#F0EDE8", textAlign: "center" }}>{d.texto1}</p>
        </div>
        <div style={{ width: 1, height: "70%", background: "#2A1F3D", flexShrink: 0 }} />
        <div style={col}>
          <div style={{ fontSize: 24, lineHeight: 1, color: "#C8A96E", fontFamily: "'Segoe UI Symbol',serif" }}>{d.simbolo2 + "︎"}</div>
          <p style={{ ...P, fontSize: 6, letterSpacing: "2px", color: "#C8A96E", textTransform: "uppercase", fontWeight: 600 }}>{d.signo2}</p>
          <div style={{ width: "100%", height: 1, background: "#2A1F3D" }} />
          <p style={{ ...P, fontSize: 7, lineHeight: 1.5, color: "#F0EDE8", textAlign: "center" }}>{d.texto2}</p>
        </div>
      </div>
      <div style={{ width: "100%", paddingTop: 8 }}>
        <div style={{ height: 1, background: "#2A1F3D", marginBottom: 6 }} />
        <p style={{ ...mlogo, textAlign: "center" }}>ASTROLIFE.CL</p>
      </div>
    </div>
  );
}

function MiniSlide4({ d }: { d: CarruselData["slide4"] }) {
  return (
    <div style={{ ...mbase, justifyContent: "center", gap: 10 }}>
      <div style={{ fontSize: 24, lineHeight: 1, color: "#C8A96E", fontFamily: "serif", flexShrink: 0 }}>✦</div>
      <div style={msep} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, justifyContent: "center" }}>
        <p style={{ ...P, fontSize: 9, fontFamily: "Georgia, serif", color: "#F0EDE8", textAlign: "center", lineHeight: 1.4, fontWeight: 600 }}>{d.cta}</p>
        <p style={{ ...P, fontSize: 7, color: "#888880", textAlign: "center", fontStyle: "italic" }}>Astrid te espera</p>
      </div>
      <div style={msep} />
      <p style={{ ...mlogo, fontSize: 7, letterSpacing: "2px", paddingTop: 4 }}>ASTROLIFE.CL</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AdminContent() {
  const [posts, setPosts]       = useState<WeekPosts | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [copied, setCopied]     = useState<DayKey | null>(null);
  const [downloading, setDownloading] = useState<DayKey | null>(null);

  const [carrusel, setCarrusel]               = useState<CarruselData | null>(null);
  const [loadingCarrusel, setLoadingCarrusel] = useState(false);
  const [errorCarrusel, setErrorCarrusel]     = useState<string | null>(null);
  const [downloadingSlide, setDownloadingSlide] = useState<number | null>(null);

  async function generar() {
    setLoading(true); setError(null); setPosts(null);
    try {
      const res = await fetch("/api/content/facebook");
      if (!res.ok) { const b = (await res.json()) as { error?: string }; throw new Error(b.error ?? `Error ${res.status}`); }
      setPosts((await res.json()) as WeekPosts);
    } catch (err) { setError(err instanceof Error ? err.message : "Error desconocido"); }
    finally { setLoading(false); }
  }

  async function copiar(key: DayKey) {
    if (!posts) return;
    try { await navigator.clipboard.writeText(posts[key].texto); setCopied(key); setTimeout(() => setCopied(null), 2000); } catch { /* sin clipboard */ }
  }

  async function descargar(key: DayKey) {
    if (!posts) return;
    setDownloading(key);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const card = CARDS.find((c) => c.key === key)!;
      const domEl = buildPreviewEl(posts[key], card.dia);
      document.body.appendChild(domEl);
      const canvas = await html2canvas(domEl, { scale: 3, backgroundColor: "#100A1A", useCORS: true, logging: false });
      document.body.removeChild(domEl);
      const a = Object.assign(document.createElement("a"), { href: canvas.toDataURL("image/png"), download: `astrolife-${key}.png` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (err) { console.error("Error generando imagen:", err); }
    finally { setDownloading(null); }
  }

  async function generarCarrusel() {
    setLoadingCarrusel(true); setErrorCarrusel(null); setCarrusel(null);
    try {
      const res = await fetch("/api/content/carrusel");
      if (!res.ok) { const b = (await res.json()) as { error?: string }; throw new Error(b.error ?? `Error ${res.status}`); }
      setCarrusel((await res.json()) as CarruselData);
    } catch (err) { setErrorCarrusel(err instanceof Error ? err.message : "Error desconocido"); }
    finally { setLoadingCarrusel(false); }
  }

  async function descargarSlide(n: number) {
    if (!carrusel) return;
    setDownloadingSlide(n);
    try {
      const key = `slide${n}` as keyof CarruselData;
      const res = await fetch("/api/content/carrusel-imagen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slide: n, data: carrusel[key] }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: `astrolife-carrusel-slide-${n}.png`,
      });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) { console.error("Error descargando slide:", err); }
    finally { setDownloadingSlide(null); }
  }

  const s = {
    page:    { minHeight: "100vh", backgroundColor: "#100A1A", padding: "40px 20px" } as React.CSSProperties,
    inner:   { maxWidth: 680, margin: "0 auto" } as React.CSSProperties,
    label:   { fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#888880", marginBottom: 20 },
    btnGen:  { width: "100%", backgroundColor: "#C8A96E", color: "#100A1A", border: "none", borderRadius: 8, padding: "13px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 24 } as React.CSSProperties,
    dis:     { opacity: 0.5, cursor: "not-allowed" } as React.CSSProperties,
    cards:   { display: "flex", flexDirection: "column" as const, gap: 10 },
    card:    { backgroundColor: "#18102A", border: "1px solid #2A1F3D", borderRadius: 12, padding: "14px 18px" } as React.CSSProperties,
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } as React.CSSProperties,
    cardTitle: { fontSize: 13, fontWeight: 600, color: "#C8A96E" } as React.CSSProperties,
    cardActions: { display: "flex", gap: 6 } as React.CSSProperties,
    cardText: { fontSize: 13, lineHeight: 1.65, color: "#F0EDE8", margin: 0 } as React.CSSProperties,
    btn:     { backgroundColor: "transparent", border: "1px solid #2A1F3D", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#888880", cursor: "pointer", whiteSpace: "nowrap" as const } as React.CSSProperties,
    error:   { backgroundColor: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 } as React.CSSProperties,
    skel:    { backgroundColor: "#2A1F3D", borderRadius: 4 } as React.CSSProperties,
    divider: { height: 1, background: "#2A1F3D", margin: "32px 0" } as React.CSSProperties,
    grid:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } as React.CSSProperties,
    sCard:   { backgroundColor: "#18102A", border: "1px solid #2A1F3D", borderRadius: 12, overflow: "hidden" } as React.CSSProperties,
    sFoot:   { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" } as React.CSSProperties,
    sNum:    { fontSize: 11, fontWeight: 600, color: "#888880" } as React.CSSProperties,
  };

  const slideData = [
    { n: 1, label: "Slide 1 — Tránsito", mini: carrusel ? <MiniSlide1 d={carrusel.slide1} /> : null },
    { n: 2, label: "Slide 2 — Signo principal", mini: carrusel ? <MiniSlide2 d={carrusel.slide2} /> : null },
    { n: 3, label: "Slide 3 — Dos signos", mini: carrusel ? <MiniSlide3 d={carrusel.slide3} /> : null },
    { n: 4, label: "Slide 4 — CTA", mini: carrusel ? <MiniSlide4 d={carrusel.slide4} /> : null },
  ];

  return (
    <div style={s.page}>
      <div style={s.inner}>

        {/* ── 7 posts ── */}
        <p style={s.label}>Panel Admin — Contenido semanal</p>
        <button onClick={generar} disabled={loading} style={{ ...s.btnGen, ...(loading ? s.dis : {}) }}>
          {loading ? "Generando con Claude…" : "Generar 7 posts semanales"}
        </button>
        {error && <div style={s.error}>{error}</div>}
        {loading && (
          <div style={s.cards}>
            {CARDS.map((c) => (
              <div key={c.key} style={{ ...s.card, opacity: 0.5 }}>
                <div style={{ ...s.skel, height: 12, width: 160, marginBottom: 10 }} />
                <div style={{ ...s.skel, height: 11, width: "100%", marginBottom: 7 }} />
                <div style={{ ...s.skel, height: 11, width: "80%", marginBottom: 7 }} />
                <div style={{ ...s.skel, height: 11, width: "55%" }} />
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
                    <span style={{ fontSize: 20, lineHeight: 1, marginRight: 8, color: "#C8A96E" }}>{posts[c.key].simbolo}</span>
                    <span style={s.cardTitle}>{c.dia} — {c.descripcion}</span>
                  </div>
                  <div style={s.cardActions}>
                    <button onClick={() => copiar(c.key)} style={{ ...s.btn, color: copied === c.key ? "#C8A96E" : "#888880" }}>
                      {copied === c.key ? "¡Copiado!" : "Copiar"}
                    </button>
                    <button onClick={() => descargar(c.key)} disabled={downloading === c.key} style={{ ...s.btn, color: "#7B6FA0", opacity: downloading === c.key ? 0.5 : 1 }}>
                      {downloading === c.key ? "…" : "Imagen"}
                    </button>
                  </div>
                </div>
                <p style={s.cardText}>{posts[c.key].texto}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Carrusel ── */}
        <div style={s.divider} />
        <p style={s.label}>Carrusel semanal — Instagram</p>
        <button onClick={generarCarrusel} disabled={loadingCarrusel} style={{ ...s.btnGen, background: "#7B6FA0", ...(loadingCarrusel ? s.dis : {}) }}>
          {loadingCarrusel ? "Generando carrusel…" : "Generar carrusel"}
        </button>
        {errorCarrusel && <div style={s.error}>{errorCarrusel}</div>}

        {loadingCarrusel && (
          <div style={s.grid}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ ...s.sCard, opacity: 0.5 }}>
                <div style={{ width: 180, height: 180, background: "#2A1F3D" }} />
                <div style={s.sFoot}>
                  <div style={{ ...s.skel, height: 10, width: 50 }} />
                  <div style={{ ...s.skel, height: 24, width: 70, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {carrusel && !loadingCarrusel && (
          <div style={s.grid}>
            {slideData.map(({ n, label, mini }) => (
              <div key={n} style={s.sCard}>
                {mini}
                <div style={s.sFoot}>
                  <span style={s.sNum}>{label}</span>
                  <button onClick={() => descargarSlide(n)} disabled={downloadingSlide === n} style={{ ...s.btn, color: "#7B6FA0", opacity: downloadingSlide === n ? 0.5 : 1 }}>
                    {downloadingSlide === n ? "…" : "Descargar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
