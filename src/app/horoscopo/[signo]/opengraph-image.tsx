import { ImageResponse } from "next/og";
import { getZodiacSign } from "@/lib/zodiac";
import { generarHoroscopo } from "@/lib/horoscopo-servidor";

export const runtime = "edge";
export const revalidate = 86400;

export default async function OGImage({
  params,
}: {
  params: Promise<{ signo: string }>;
}) {
  const { signo } = await params;
  const sign = getZodiacSign(signo);

  let textoCorto = "";
  try {
    const horoscopo = await generarHoroscopo(sign.name);
    textoCorto = horoscopo.texto.split(".").slice(0, 2).join(".") + ".";
  } catch {
    // imagen se renderiza sin texto si falla la API
  }

  const fecha = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const fechaCap = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #100A1A 0%, #18102A 50%, #201535 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Borde dorado */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1px solid rgba(200,169,110,0.3)",
            borderRadius: "20px",
          }}
        />

        {/* Símbolo del signo */}
        <div style={{ fontSize: "72px", marginBottom: "16px" }}>
          {sign.symbol}
        </div>

        {/* Nombre */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "700",
            color: "#C8A96E",
            marginBottom: "8px",
          }}
        >
          {sign.name}
        </div>

        {/* Fecha */}
        <div
          style={{
            fontSize: "18px",
            color: "#888880",
            marginBottom: "28px",
          }}
        >
          {fechaCap}
        </div>

        {/* Divisor */}
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "rgba(200,169,110,0.5)",
            marginBottom: "28px",
          }}
        />

        {/* Texto horóscopo */}
        {textoCorto ? (
          <div
            style={{
              fontSize: "21px",
              color: "#F0EDE8",
              textAlign: "center",
              lineHeight: "1.65",
              maxWidth: "900px",
              marginBottom: "48px",
            }}
          >
            {textoCorto}
          </div>
        ) : (
          <div
            style={{
              fontSize: "18px",
              color: "#A898A8",
              textAlign: "center",
              marginBottom: "48px",
            }}
          >
            Horóscopo diario generado por inteligencia artificial
          </div>
        )}

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "22px", color: "#C8A96E" }}>✦</div>
          <div
            style={{
              fontSize: "20px",
              color: "#C8A96E",
              fontWeight: "600",
              letterSpacing: "0.06em",
            }}
          >
            AstroLife.cl
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
