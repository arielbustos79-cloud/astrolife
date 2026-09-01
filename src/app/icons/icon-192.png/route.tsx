import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "#100A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
          {/* Star shape */}
          <path
            d="M55 8 L62 38 L92 38 L68 57 L78 88 L55 70 L32 88 L42 57 L18 38 L48 38 Z"
            fill="#C8A96E"
          />
          {/* Crescent overlay */}
          <circle cx="55" cy="55" r="22" fill="#100A1A" />
          <circle cx="63" cy="50" r="22" fill="#C8A96E" />
        </svg>
      </div>
    ),
    { width: 192, height: 192 },
  );
}
