"use client";

import { useRef, useState } from "react";
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

function buildPreviewEl(post: DayPost, dia: string): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.style.cssText = [
    "position:fixed", "top:0", "left:0",
    "width:360px", "height:360px",
    "background:#100A1A",
    "display:flex", "flex-direction:column", "align-items:center", "justify-content:space-between",
    "padding:48px", "box-sizing:border-box",
    "z-index:99999", "font-family:sans-serif",
  ].join(";");

  const badgeEl = document.createElement("div");
  badgeEl.style.cssText = "font-size:11px;letter-spacing:3px;color:#C8A96E;border:1px solid #C8A96E;border-radius:20px;padding:4px 12px;font-family:sans-serif;font-weight:600;flex-shrink:0";
  badgeEl.textContent = dia.toUpperCase();

  const symbolEl = document.createElement("div");
  symbolEl.style.cssText = "font-size:72px;line-height:1;color:#C8A96E;text-align:center;font-family:'Segoe UI Symbol',serif;font-variant-emoji:text;flex-shrink:0;margin-bottom:24px";
  symbolEl.textContent = post.simbolo + "︎";

  const sep1 = document.createElement("div");
  sep1.style.cssText = "width:100%;height:1px;background:#2A1F3D;flex-shrink:0";

  const textEl = document.createElement("div");
  textEl.style.cssText = "flex:1;display:flex;align-items:center;text-align:center;font-size:13px;line-height:1.65;color:#F0EDE8;padding:10px 4px;overflow:hidden";
  textEl.textContent = post.texto;

  const sep2 = document.createElement("div");
  sep2.style.cssText = "width:100%;height:1px;background:#2A1F3D;flex-shrink:0";

  const logoEl = document.createElement("div");
  logoEl.style.cssText = "font-size:11px;letter-spacing:3px;color:#C8A96E;font-family:sans-serif;font-weight:600;padding-top:12px;flex-shrink:0";
  logoEl.textContent = "ASTROLIFE.CL";

  wrap.appendChild(badgeEl);
  wrap.appendChild(symbolEl);
  wrap.appendChild(sep1);
  wrap.appendChild(textEl);
  wrap.appendChild(sep2);
  wrap.appendChild(logoEl);
  return wrap;
}

// ─── Slide style constants ────────────────────────────────────────────────────
const SLIDE: React.CSSProperties = {
  width: 360, height: 360,
  background: "#100A1A",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
  boxSizing: "border-box", padding: "40px 36px 28px",
  fontFamily: "Inter, sans-serif",
};
const SEP: React.CSSProperties = { width: "100%", height: 1, background: "#2A1F3D", flexShrink: 0 };
const LOGO: React.CSSProperties = { fontSize: 10, letterSpacing: "3px", color: "#C8A96E", fontFamily: "sans-serif", fontWeight: 600 };
const GLIFO = (size = 64): React.CSSProperties => ({
  fontSize: size, lineHeight: 1, color: "#C8A96E",
  fontFamily: "'Segoe UI Symbol', serif",
  textAlign: "center", flexShrink: 0,
});

// ─── Component ────────────────────────────────────────────────────────────────
export function AdminContent() {
  // 7-posts state
  const [posts, setPosts]       = useState<WeekPosts | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [copied, setCopied]     = useState<DayKey | null>(null);
  const [downloading, setDownloading] = useState<DayKey | null>(null);

  // carousel state
  const [carrusel, setCarrusel]             = useState<CarruselData | null>(null);
  const [loadingCarrusel, setLoadingCarrusel] = useState(false);
  const [errorCarrusel, setErrorCarrusel]   = useState<string | null>(null);
  const [downloadingSlide, setDownloadingSlide] = useState<number | null>(null);
  const slideRefs = useRef<{ [n: number]: HTMLDivElement | null }>({});

  // ── 7-posts actions ──────────────────────────────────────────────────────
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
      const el = buildPreviewEl(posts[key], card.dia);
      document.body.appendChild(el);
      const canvas = await html2canvas(el, { scale: 3, backgroundColor: "#100A1A", useCORS: true, logging: false });
      document.body.removeChild(el);
      const a = Object.assign(document.createElement("a"), { href: canvas.toDataURL("image/png"), download: `astrolife-${key}.png` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (err) { console.error("Error generando imagen:", err); }
    finally { setDownloading(null); }
  }

  // ── Carousel actions ─────────────────────────────────────────────────────
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
    const el = slideRefs.current[n];
    if (!el) return;
    setDownloadingSlide(n);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, { scale: 3, backgroundColor: "#100A1A", useCORS: true, logging: false });
      const a = Object.assign(document.createElement("a"), { href: canvas.toDataURL("image/png"), download: `astrolife-carrusel-slide-${n}.png` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (err) { console.error("Error generando slide:", err); }
    finally { setDownloadingSlide(null); }
  }

  // ── Styles ───────────────────────────────────────────────────────────────
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
    cardText: { fontSize: 13, lineHeight: 1.65, color: "#F0EDE8", margin: 0 } as React.CSSProperties,
    btn:     { backgroundColor: "transparent", border: "1px solid #2A1F3D", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#888880", cursor: "pointer", whiteSpace: "nowrap" as const } as React.CSSProperties,
    error:   { backgroundColor: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 } as React.CSSProperties,
    skeleton: { backgroundColor: "#2A1F3D", borderRadius: 4 } as React.CSSProperties,
    // carousel
    divider:   { height: 1, background: "#2A1F3D", margin: "32px 0" } as React.CSSProperties,
    slideGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } as React.CSSProperties,
    slideCard: { backgroundColor: "#18102A", border: "1px solid #2A1F3D", borderRadius: 12, overflow: "hidden" } as React.CSSProperties,
    slideClip: { width: 180, height: 180, overflow: "hidden" } as React.CSSProperties,
    slideScaler: { transform: "scale(0.5)", transformOrigin: "top left", display: "inline-block" } as React.CSSProperties,
    slideFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" } as React.CSSProperties,
    slideNum:  { fontSize: 11, fontWeight: 600, color: "#888880", letterSpacing: "0.08em" } as React.CSSProperties,
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.inner}>

        {/* ── 7 posts section ── */}
        <p style={s.label}>Panel Admin — Contenido semanal</p>
        <button onClick={generar} disabled={loading} style={{ ...s.btnGen, ...(loading ? s.btnGenDisabled : {}) }}>
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
                    <button onClick={() => copiar(c.key)} style={{ ...s.btn, color: copied === c.key ? "#C8A96E" : "#888880", borderColor: copied === c.key ? "#C8A96E40" : "#2A1F3D" }}>
                      {copied === c.key ? "¡Copiado!" : "Copiar"}
                    </button>
                    <button onClick={() => descargar(c.key)} disabled={downloading === c.key} style={{ ...s.btn, color: "#7B6FA0", borderColor: "#7B6FA040", opacity: downloading === c.key ? 0.5 : 1 }}>
                      {downloading === c.key ? "…" : "Imagen"}
                    </button>
                  </div>
                </div>
                <p style={s.cardText}>{posts[c.key].texto}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Carousel section ── */}
        <div style={s.divider} />
        <p style={s.label}>Carrusel semanal — Instagram</p>

        <button onClick={generarCarrusel} disabled={loadingCarrusel} style={{ ...s.btnGen, background: "#7B6FA0", ...(loadingCarrusel ? s.btnGenDisabled : {}) }}>
          {loadingCarrusel ? "Generando carrusel…" : "Generar carrusel"}
        </button>

        {errorCarrusel && <div style={s.error}>{errorCarrusel}</div>}

        {loadingCarrusel && (
          <div style={s.slideGrid}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ ...s.slideCard, opacity: 0.5 }}>
                <div style={{ ...s.slideClip, background: "#2A1F3D" }} />
                <div style={s.slideFooter}>
                  <div style={{ ...s.skeleton, height: 10, width: 50 }} />
                  <div style={{ ...s.skeleton, height: 24, width: 70, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {carrusel && !loadingCarrusel && (
          <div style={s.slideGrid}>

            {/* Slide 1 — título + subtítulo */}
            <div style={s.slideCard}>
              <div style={s.slideClip}>
                <div style={s.slideScaler}>
                  <div ref={el => { slideRefs.current[1] = el; }} style={SLIDE}>
                    <div style={{ fontSize: 52, lineHeight: 1, color: "#C8A96E", fontFamily: "serif", flexShrink: 0 }}>✦</div>
                    <div style={SEP} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 4px" }}>
                      <p style={{ fontSize: 24, fontFamily: "'Playfair Display', Georgia, serif", color: "#F0EDE8", textAlign: "center", margin: 0, lineHeight: 1.3, fontWeight: 700 }}>
                        {carrusel.slide1.titulo}
                      </p>
                      <p style={{ fontSize: 13, color: "#888880", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                        {carrusel.slide1.subtitulo}
                      </p>
                    </div>
                    <div style={SEP} />
                    <p style={{ ...LOGO, margin: 0, paddingTop: 12 }}>ASTROLIFE.CL</p>
                  </div>
                </div>
              </div>
              <div style={s.slideFooter}>
                <span style={s.slideNum}>Slide 1</span>
                <button onClick={() => descargarSlide(1)} disabled={downloadingSlide === 1} style={{ ...s.btn, color: "#7B6FA0", borderColor: "#7B6FA040", opacity: downloadingSlide === 1 ? 0.5 : 1 }}>
                  {downloadingSlide === 1 ? "…" : "Descargar"}
                </button>
              </div>
            </div>

            {/* Slide 2 — signo principal */}
            <div style={s.slideCard}>
              <div style={s.slideClip}>
                <div style={s.slideScaler}>
                  <div ref={el => { slideRefs.current[2] = el; }} style={SLIDE}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <div style={GLIFO(68)}>{carrusel.slide2.simbolo + "︎"}</div>
                      <p style={{ fontSize: 11, letterSpacing: "4px", color: "#C8A96E", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>
                        {carrusel.slide2.signo}
                      </p>
                    </div>
                    <div style={SEP} />
                    <p style={{ flex: 1, fontSize: 13, lineHeight: 1.65, color: "#F0EDE8", textAlign: "center", margin: 0, display: "flex", alignItems: "center", padding: "0 4px" }}>
                      {carrusel.slide2.texto}
                    </p>
                    <div style={SEP} />
                    <p style={{ ...LOGO, margin: 0, paddingTop: 12 }}>ASTROLIFE.CL</p>
                  </div>
                </div>
              </div>
              <div style={s.slideFooter}>
                <span style={s.slideNum}>Slide 2</span>
                <button onClick={() => descargarSlide(2)} disabled={downloadingSlide === 2} style={{ ...s.btn, color: "#7B6FA0", borderColor: "#7B6FA040", opacity: downloadingSlide === 2 ? 0.5 : 1 }}>
                  {downloadingSlide === 2 ? "…" : "Descargar"}
                </button>
              </div>
            </div>

            {/* Slide 3 — dos signos */}
            <div style={s.slideCard}>
              <div style={s.slideClip}>
                <div style={s.slideScaler}>
                  <div ref={el => { slideRefs.current[3] = el; }} style={{ ...SLIDE, padding: "32px 0 24px" }}>
                    <div style={{ display: "flex", flex: 1, width: "100%", alignItems: "center" }}>
                      {/* Left sign */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 20px" }}>
                        <div style={GLIFO(48)}>{carrusel.slide3.simbolo1 + "︎"}</div>
                        <p style={{ fontSize: 10, letterSpacing: "3px", color: "#C8A96E", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>
                          {carrusel.slide3.signo1}
                        </p>
                        <div style={{ width: "100%", height: 1, background: "#2A1F3D" }} />
                        <p style={{ fontSize: 11, lineHeight: 1.6, color: "#F0EDE8", textAlign: "center", margin: 0 }}>
                          {carrusel.slide3.texto1}
                        </p>
                      </div>
                      {/* Vertical divider */}
                      <div style={{ width: 1, height: "75%", background: "#2A1F3D", flexShrink: 0 }} />
                      {/* Right sign */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 20px" }}>
                        <div style={GLIFO(48)}>{carrusel.slide3.simbolo2 + "︎"}</div>
                        <p style={{ fontSize: 10, letterSpacing: "3px", color: "#C8A96E", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>
                          {carrusel.slide3.signo2}
                        </p>
                        <div style={{ width: "100%", height: 1, background: "#2A1F3D" }} />
                        <p style={{ fontSize: 11, lineHeight: 1.6, color: "#F0EDE8", textAlign: "center", margin: 0 }}>
                          {carrusel.slide3.texto2}
                        </p>
                      </div>
                    </div>
                    {/* Bottom */}
                    <div style={{ width: "100%", paddingTop: 16 }}>
                      <div style={{ height: 1, background: "#2A1F3D", marginBottom: 12 }} />
                      <p style={{ ...LOGO, margin: 0, textAlign: "center" }}>ASTROLIFE.CL</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={s.slideFooter}>
                <span style={s.slideNum}>Slide 3</span>
                <button onClick={() => descargarSlide(3)} disabled={downloadingSlide === 3} style={{ ...s.btn, color: "#7B6FA0", borderColor: "#7B6FA040", opacity: downloadingSlide === 3 ? 0.5 : 1 }}>
                  {downloadingSlide === 3 ? "…" : "Descargar"}
                </button>
              </div>
            </div>

            {/* Slide 4 — CTA */}
            <div style={s.slideCard}>
              <div style={s.slideClip}>
                <div style={s.slideScaler}>
                  <div ref={el => { slideRefs.current[4] = el; }} style={{ ...SLIDE, justifyContent: "center", gap: 20 }}>
                    <div style={{ fontSize: 48, lineHeight: 1, color: "#C8A96E", fontFamily: "serif", flexShrink: 0 }}>✦</div>
                    <div style={SEP} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flex: 1, justifyContent: "center" }}>
                      <p style={{ fontSize: 17, fontFamily: "'Playfair Display', Georgia, serif", color: "#F0EDE8", textAlign: "center", margin: 0, lineHeight: 1.4, fontWeight: 600 }}>
                        {carrusel.slide4.cta}
                      </p>
                      <p style={{ fontSize: 12, color: "#888880", textAlign: "center", margin: 0, fontStyle: "italic" }}>
                        Astrid te espera
                      </p>
                    </div>
                    <div style={SEP} />
                    <p style={{ fontSize: 14, letterSpacing: "4px", color: "#C8A96E", fontFamily: "sans-serif", fontWeight: 700, margin: 0, paddingTop: 4 }}>
                      ASTROLIFE.CL
                    </p>
                  </div>
                </div>
              </div>
              <div style={s.slideFooter}>
                <span style={s.slideNum}>Slide 4</span>
                <button onClick={() => descargarSlide(4)} disabled={downloadingSlide === 4} style={{ ...s.btn, color: "#7B6FA0", borderColor: "#7B6FA040", opacity: downloadingSlide === 4 ? 0.5 : 1 }}>
                  {downloadingSlide === 4 ? "…" : "Descargar"}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
