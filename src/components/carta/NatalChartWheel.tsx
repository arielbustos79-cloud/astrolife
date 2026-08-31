import type { NatalChart } from "@/lib/astro/ephemeris";
import { ZODIAC_SIGNS } from "@/lib/zodiac";

const PLANETS = [
  { key: "sun", glyph: "☉", color: "#FFD080" },
  { key: "moon", glyph: "☽", color: "#C4B8E8" },
  { key: "venus", glyph: "♀", color: "#F0D0E8" },
  { key: "mars", glyph: "♂", color: "#E8785A" },
  { key: "saturn", glyph: "♄", color: "#C8A96E" },
] as const;

const CX = 130;
const CY = 130;

function point(radius: number, relDeg: number) {
  const screenAngle = ((180 + relDeg) * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(screenAngle),
    y: CY - radius * Math.sin(screenAngle),
  };
}

export function NatalChartWheel({ chart }: { chart: NatalChart }) {
  const ascSignIndex = ZODIAC_SIGNS.findIndex((s) => s.id === chart.ascendant.sign.id);
  const wheelZeroLon = ascSignIndex * 30;
  const rel = (lonDeg: number) => ((lonDeg - wheelZeroLon) % 360 + 360) % 360;

  const houseSegments = Array.from({ length: 12 }, (_, i) => {
    const sign = ZODIAC_SIGNS[(ascSignIndex + i) % 12];
    return { house: i + 1, sign, startRel: i * 30, midRel: i * 30 + 15 };
  });

  const ascRel = rel(chart.ascendant.longitude);
  const mcRel = rel(chart.midheaven.longitude);

  return (
    <svg viewBox="0 0 260 260" className="h-auto w-full max-w-[480px]">
      <defs>
        <filter id="planet-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx={CX} cy={CY} r={120} stroke="#4A3870" strokeWidth="1.5" fill="none" />
      <circle cx={CX} cy={CY} r={95} stroke="#3A2D5A" strokeWidth="1" fill="none" />
      <circle cx={CX} cy={CY} r={2.5} fill="#7B6FA0" />

      {houseSegments.map(({ house, sign, startRel, midRel }) => {
        const lineOuter = point(120, startRel);
        const lineInner = point(95, startRel);
        const glyphPos = point(107, midRel);
        const housePos = point(101, midRel);
        return (
          <g key={house}>
            <line
              x1={lineInner.x}
              y1={lineInner.y}
              x2={lineOuter.x}
              y2={lineOuter.y}
              stroke="#4A3870"
              strokeWidth="0.8"
            />
            <text
              x={glyphPos.x}
              y={glyphPos.y}
              fontSize="11"
              fill="#C8A96E"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="serif"
            >
              {sign.symbol}
            </text>
            <text
              x={housePos.x}
              y={housePos.y + 9}
              fontSize="7"
              fill="#6B6099"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {house}
            </text>
          </g>
        );
      })}

      {[
        { label: "ASC", rel: ascRel, color: "#FFD080" },
        { label: "DESC", rel: (ascRel + 180) % 360, color: "#6B6099" },
        { label: "MC", rel: mcRel, color: "#C4B8E8" },
        { label: "IC", rel: (mcRel + 180) % 360, color: "#6B6099" },
      ].map(({ label, rel: r, color }) => {
        const outer = point(120, r);
        const inner = point(95, r);
        const labelPos = point(128, r);
        return (
          <g key={label}>
            <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={color} strokeWidth="1.2" opacity="0.8" />
            <text
              x={labelPos.x}
              y={labelPos.y}
              fontSize="8"
              fontWeight="600"
              fill={color}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {label}
            </text>
          </g>
        );
      })}

      {PLANETS.map(({ key, glyph, color }) => {
        const p = chart[key];
        const pos = point(75, rel(p.longitude));
        return (
          <g key={key}>
            <circle cx={pos.x} cy={pos.y} r={7} fill={color} filter="url(#planet-glow)" />
            <text
              x={pos.x}
              y={pos.y}
              fontSize="9"
              fontWeight="bold"
              fill="#100A1A"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="serif"
            >
              {glyph}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
