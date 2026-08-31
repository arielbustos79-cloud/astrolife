import { NavHeader } from "@/components/ui/NavHeader";
import { BottomNav } from "@/components/ui/BottomNav";

// Planet glyph → display color
const PLANET_COLOR: Record<string, string> = {
  "☉": "#FFD080",
  "☽": "#C4B8E8",
  "♀": "#F0D0E8",
  "♂": "#E8785A",
  "♄": "#C8A96E",
  "☿": "#A8D8A8",
  "♃": "#F0C080",
  "♆": "#80C8F0",
};

type Transit = {
  glyph: string;
  name: string;
  description: string;
  /** "active" muestra badge violeta "Activo", cualquier otro string se muestra en dorado como fecha */
  status: "active" | string;
};

// Hardcoded transits for August 2026 — will be replaced with real
// astronomia calculations once the ephemeris layer for transits is built.
const TRANSITS_AUG_2026: Transit[] = [
  {
    glyph: "☉",
    name: "Sol en Leo",
    description: "Temporada de creatividad, liderazgo y expresión personal.",
    status: "active",
  },
  {
    glyph: "♃",
    name: "Júpiter en Leo",
    description: "Expansión del ego y la confianza. Grandes gestos, grandes aprendizajes.",
    status: "active",
  },
  {
    glyph: "☿",
    name: "Mercurio en Virgo",
    description: "Mente analítica en su domicilio. Ideal para organizar y comunicar con precisión.",
    status: "13 ago",
  },
  {
    glyph: "♀",
    name: "Venus en Cáncer",
    description: "El amor se vuelve doméstico y protector. Necesidad de pertenencia y cuidado.",
    status: "active",
  },
  {
    glyph: "♄",
    name: "Saturno en Aries Rx",
    description: "Revisión de los límites personales. Lecciones sobre la identidad y el coraje.",
    status: "active",
  },
  {
    glyph: "♂",
    name: "Marte en Géminis",
    description: "Energía dispersa y verbal. Acción a través de las palabras y las ideas.",
    status: "28 ago",
  },
];

function currentMonthLabel() {
  return new Date().toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function TransitosPage() {
  const monthLabel = capitalize(currentMonthLabel());

  return (
    <div className="min-h-screen bg-bg pb-28">
      <NavHeader variant="dark" />

      {/* Header */}
      <div className="px-5 pb-5 pt-2">
        <h1 className="font-display text-[26px] font-bold leading-tight text-ink">
          Tránsitos del mes
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{monthLabel}</p>
      </div>

      {/* Transit cards */}
      <div className="flex flex-col gap-3 px-4">
        {TRANSITS_AUG_2026.map((t) => {
          const color = PLANET_COLOR[t.glyph] ?? "#C8A96E";
          const isActive = t.status === "active";

          return (
            <div
              key={t.name}
              className="flex cursor-default select-none items-center gap-4 rounded-[18px] border border-line bg-surface p-4"
            >
              {/* Planet glyph */}
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-2xl leading-none"
                style={{ color, background: `${color}18` }}
              >
                {t.glyph}
              </span>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">
                  {t.name}
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.4] text-ink-muted">
                  {t.description}
                </p>
              </div>

              {/* Status badge */}
              <span
                className="flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={
                  isActive
                    ? { background: "#7B6FA022", color: "#A898C8" }
                    : { background: "#C8A96E18", color: "#C8A96E" }
                }
              >
                {isActive ? "Activo" : t.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Upcoming note */}
      <p className="mt-6 px-5 text-center text-[12px] text-ink-muted">
        Los tránsitos personalizados según tu carta natal llegarán pronto ✨
      </p>

      <BottomNav />
    </div>
  );
}
