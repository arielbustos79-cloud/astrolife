import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import type { CarruselData } from "@/app/api/content/carrusel/route";

const SYMBOLS = "♈♉♊♋♌♍♎♏♐♑♒♓✦";

// ─── Font cache (module-level) ────────────────────────────────────────────────
const cache = new Map<string, ArrayBuffer>();

async function gfont(family: string, weight: number, italic = false): Promise<ArrayBuffer> {
  const key = `${family}:${weight}:${italic}`;
  if (cache.has(key)) return cache.get(key)!;
  const q = italic
    ? `family=${family.replace(/ /g, "+")}:ital,wght@1,${weight}`
    : `family=${family.replace(/ /g, "+")}:wght@${weight}`;
  const css = await fetch(`https://fonts.googleapis.com/css2?${q}&display=swap`, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
  }).then((r) => r.text());
  const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map((m) => m[1]);
  if (!urls.length) throw new Error(`Font not found: ${family}`);
  const data = await fetch(urls.at(-1)!).then((r) => r.arrayBuffer());
  cache.set(key, data);
  return data;
}

async function sfont(): Promise<ArrayBuffer> {
  if (cache.has("symbols")) return cache.get("symbols")!;
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+Symbols+2&text=${encodeURIComponent(SYMBOLS)}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" } }
  ).then((r) => r.text());
  const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map((m) => m[1]);
  if (!urls.length) throw new Error("Symbols font not found");
  const data = await fetch(urls[0]).then((r) => r.arrayBuffer());
  cache.set("symbols", data);
  return data;
}

async function getFonts() {
  const [playfair, inter, interItalic, symbols] = await Promise.all([
    gfont("Playfair Display", 700),
    gfont("Inter", 400),
    gfont("Inter", 400, true),
    sfont(),
  ]);
  return [
    { name: "Playfair Display", data: playfair, weight: 700 as const, style: "normal" as const },
    { name: "Inter", data: inter, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: interItalic, weight: 400 as const, style: "italic" as const },
    { name: "Noto Sans Symbols 2", data: symbols, weight: 400 as const, style: "normal" as const },
  ];
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG = "#100A1A";
const GOLD = "#C8A96E";
const TEXT = "#F0EDE8";
const VIO = "#7B6FA0";
const SEP_C = "#2A1F3D";
const GS = "Noto Sans Symbols 2";

const Sep = () => <div style={{ width: "100%", height: 1, background: SEP_C, flexShrink: 0 }} />;
const Logo = () => (
  <div style={{ fontSize: 18, letterSpacing: "6px", color: GOLD, fontFamily: "Inter" }}>
    astrolife.cl
  </div>
);

const base: React.CSSProperties = {
  width: 1080, height: 1080, background: BG,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "space-between",
  padding: "80px 100px 60px", boxSizing: "border-box",
};

// ─── Slide components ─────────────────────────────────────────────────────────
function Slide1({ d }: { d: CarruselData["slide1"] }) {
  return (
    <div style={base}>
      <div style={{ fontSize: 80, color: GOLD, fontFamily: GS, lineHeight: 1, flexShrink: 0 }}>✦</div>
      <Sep />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "24px 20px" }}>
        <div style={{ fontSize: 52, fontFamily: "Playfair Display", color: TEXT, textAlign: "center", fontWeight: 700, lineHeight: 1.3 }}>
          {d.titulo}
        </div>
        <div style={{ fontSize: 24, fontFamily: "Inter", color: VIO, textAlign: "center", lineHeight: 1.5 }}>
          {d.subtitulo}
        </div>
      </div>
      <Sep />
      <Logo />
    </div>
  );
}

function Slide2({ d }: { d: CarruselData["slide2"] }) {
  return (
    <div style={base}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 96, color: GOLD, fontFamily: GS, lineHeight: 1 }}>{d.simbolo}</div>
        <div style={{ fontSize: 16, letterSpacing: "4px", color: GOLD, fontFamily: "Inter", fontWeight: 600 }}>
          {d.signo.toUpperCase()}
        </div>
      </div>
      <Sep />
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 60px" }}>
        <div style={{ fontSize: 22, fontFamily: "Inter", color: TEXT, textAlign: "center", lineHeight: 1.7 }}>
          {d.texto}
        </div>
      </div>
      <Sep />
      <Logo />
    </div>
  );
}

function Slide3({ d }: { d: CarruselData["slide3"] }) {
  const Col = ({ sym, signo, texto }: { sym: string; signo: string; texto: string }) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "0 48px" }}>
      <div style={{ fontSize: 72, color: GOLD, fontFamily: GS, lineHeight: 1 }}>{sym}</div>
      <div style={{ fontSize: 14, letterSpacing: "3px", color: GOLD, fontFamily: "Inter", fontWeight: 600 }}>
        {signo.toUpperCase()}
      </div>
      <div style={{ width: "100%", height: 1, background: SEP_C }} />
      <div style={{ fontSize: 18, fontFamily: "Inter", color: TEXT, textAlign: "center", lineHeight: 1.65 }}>
        {texto}
      </div>
    </div>
  );

  return (
    <div style={{ width: 1080, height: 1080, background: BG, display: "flex", flexDirection: "column", boxSizing: "border-box", padding: "60px 0 48px" }}>
      <div style={{ display: "flex", flex: 1, width: "100%" }}>
        <Col sym={d.simbolo1} signo={d.signo1} texto={d.texto1} />
        <div style={{ width: 1, background: SEP_C, flexShrink: 0 }} />
        <Col sym={d.simbolo2} signo={d.signo2} texto={d.texto2} />
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 24 }}>
        <div style={{ width: "100%", height: 1, background: SEP_C }} />
        <Logo />
      </div>
    </div>
  );
}

function Slide4({ d }: { d: CarruselData["slide4"] }) {
  return (
    <div style={base}>
      <div style={{ fontSize: 80, color: GOLD, fontFamily: GS, lineHeight: 1, flexShrink: 0 }}>✦</div>
      <Sep />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, padding: "24px 40px" }}>
        <div style={{ fontSize: 40, fontFamily: "Playfair Display", color: TEXT, textAlign: "center", fontWeight: 700, lineHeight: 1.4 }}>
          {d.cta}
        </div>
        <div style={{ fontSize: 24, fontFamily: "Inter", color: VIO, textAlign: "center", fontStyle: "italic" }}>
          Astrid te espera
        </div>
      </div>
      <Sep />
      <Logo />
    </div>
  );
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { slide: 1 | 2 | 3 | 4; data: unknown };
    const fonts = await getFonts();

    let element: React.ReactElement;
    switch (body.slide) {
      case 1: element = <Slide1 d={body.data as CarruselData["slide1"]} />; break;
      case 2: element = <Slide2 d={body.data as CarruselData["slide2"]} />; break;
      case 3: element = <Slide3 d={body.data as CarruselData["slide3"]} />; break;
      case 4: element = <Slide4 d={body.data as CarruselData["slide4"]} />; break;
      default: return NextResponse.json({ error: "Invalid slide" }, { status: 400 });
    }

    return new ImageResponse(element, { width: 1080, height: 1080, fonts });
  } catch (err) {
    console.error("[carrusel-imagen] Error:", err);
    return NextResponse.json({ error: "Error generando imagen" }, { status: 500 });
  }
}
