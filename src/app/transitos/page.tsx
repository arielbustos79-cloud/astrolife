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
  "⛢": "#80D8F0",
};

type Transit = {
  glyph: string;
  name: string;
  description: string;
  /** "active" muestra badge violeta "Activo", cualquier otro string se muestra en dorado como fecha */
  status: "active" | string;
};

// Hardcoded transits for September 2026 — will be replaced with real
// astronomia calculations once the ephemeris layer for transits is built.
const TRANSITS_SEP_2026: Transit[] = [
  {
    glyph: "☉",
    name: "Sol en Virgo",
    description: "Temporada de análisis, orden y perfeccionamiento. Ideal para revisar hábitos, salud y rutinas. La atención al detalle es tu mayor fortaleza este mes.",
    status: "active",
  },
  {
    glyph: "☿",
    name: "Mercurio en Virgo",
    description: "Mente analítica en su máximo potencial. Excelente para contratos, estudios y comunicaciones precisas. Cuidado con el exceso de crítica hacia ti o los demás.",
    status: "active",
  },
  {
    glyph: "♀",
    name: "Venus en Libra",
    description: "Venus en su domicilio: armonía, belleza y diplomacia al centro. Las relaciones florecen cuando hay equilibrio y reciprocidad. Buen momento para resolver conflictos.",
    status: "active",
  },
  {
    glyph: "♂",
    name: "Marte en Géminis",
    description: "Energía dispersa pero versátil. La acción viene a través de las palabras, ideas y conexiones. Múltiples proyectos activos; cuidado con la falta de foco.",
    status: "active",
  },
  {
    glyph: "♃",
    name: "Júpiter en Géminis",
    description: "Expansión a través del conocimiento y la comunicación. Oportunidades que llegan por conversaciones, cursos y redes. La curiosidad es tu camino al crecimiento.",
    status: "active",
  },
  {
    glyph: "♄",
    name: "Saturno en Piscis Rx",
    description: "Revisión profunda de límites emocionales y espirituales. Período de introspección y consolidación interior. Lo que no tiene base sólida se cuestiona.",
    status: "active",
  },
  {
    glyph: "⛢",
    name: "Urano en Tauro",
    description: "Revolución en lo material: finanzas, recursos y valores en transformación. Cambios inesperados que a la larga liberan. La estabilidad se reinventa.",
    status: "active",
  },
  {
    glyph: "♆",
    name: "Neptuno en Piscis Rx",
    description: "Intuición elevada pero también confusión posible. Cuidado con idealizaciones. Buen momento para arte, meditación y conexión espiritual.",
    status: "active",
  },
  {
    glyph: "☽",
    name: "Luna llena en Piscis",
    description: "Clímax emocional y espiritual. Momento de soltar lo que ya no sirve. Las emociones están a flor de piel — escúchalas sin dejarte arrastrar.",
    status: "17 sep",
  },
  {
    glyph: "☿",
    name: "Mercurio entra en Libra",
    description: "La mente se vuelve diplomática y busca el equilibrio en cada decisión. Conversaciones importantes sobre relaciones y justicia. Buen momento para negociar.",
    status: "26 sep",
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
          Tránsitos de septiembre
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{monthLabel}</p>
      </div>

      {/* Transit cards */}
      <div className="flex flex-col gap-3 px-4">
        {TRANSITS_SEP_2026.map((t) => {
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
