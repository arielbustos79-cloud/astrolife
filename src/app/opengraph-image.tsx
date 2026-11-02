import { ImageResponse } from "next/og";

export const revalidate = 86400;

export default function OGImage() {
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

        {/* Luna */}
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🌙</div>

        {/* Nombre */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "700",
            color: "#C8A96E",
            marginBottom: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          AstroLife
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "30px",
            color: "#F0EDE8",
            textAlign: "center",
            lineHeight: "1.4",
            maxWidth: "760px",
            marginBottom: "24px",
          }}
        >
          Una guía entre nosotros.
        </div>

        {/* Divisor */}
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "rgba(200,169,110,0.5)",
            marginBottom: "24px",
          }}
        />

        {/* Subtítulo */}
        <div
          style={{
            fontSize: "19px",
            color: "#888880",
            textAlign: "center",
            maxWidth: "720px",
          }}
        >
          Carta natal gratis · Horóscopo diario por IA · Astrid, tu guía astrológica
        </div>

        {/* Logo bottom */}
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
            astrolife.cl
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
