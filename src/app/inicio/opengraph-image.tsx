import { ImageResponse } from "next/og";

export const revalidate = 86400;

export default function OGImage() {
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

        {/* Símbolo central */}
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>✦</div>

        {/* Título */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "700",
            color: "#F0EDE8",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          Mi horóscopo de hoy
        </div>

        {/* Fecha */}
        <div
          style={{
            fontSize: "20px",
            color: "#C8A96E",
            marginBottom: "36px",
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
            marginBottom: "36px",
          }}
        />

        {/* Subtítulo */}
        <div
          style={{
            fontSize: "22px",
            color: "#A898A8",
            textAlign: "center",
          }}
        >
          Descubre el tuyo en AstroLife.cl
        </div>

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
