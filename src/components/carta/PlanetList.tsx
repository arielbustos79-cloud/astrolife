import type { NatalChart } from "@/lib/astro/ephemeris";

const PLANET_ROWS = [
  { key: "sun", name: "Sol", glyph: "☉", color: "#FFD080" },
  { key: "moon", name: "Luna", glyph: "☽", color: "#C4B8E8" },
  { key: "venus", name: "Venus", glyph: "♀", color: "#F0D0E8" },
  { key: "mars", name: "Marte", glyph: "♂", color: "#E8785A" },
  { key: "saturn", name: "Saturno", glyph: "♄", color: "#C8A96E" },
] as const;

export function PlanetList({ chart }: { chart: NatalChart }) {
  return (
    <div className="px-5">
      {PLANET_ROWS.map(({ key, name, glyph, color }, i) => {
        const p = chart[key];
        return (
          <div
            key={key}
            className={`flex items-center gap-3 py-3 ${i < PLANET_ROWS.length - 1 ? "border-b border-line" : ""}`}
          >
            <span className="w-8 text-center text-xl" style={{ color }}>
              {glyph}
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-ink">{name}</p>
              <p className="text-xs text-ink-muted">
                {p.degree.toFixed(0)}° {p.sign.name}
              </p>
            </div>
            <span className="rounded-full border border-violet/40 bg-violet/25 px-2 py-1 text-[11px] text-[#C4B8E8]">
              Casa {p.house}
            </span>
          </div>
        );
      })}
    </div>
  );
}
