"use client";

import { useState } from "react";

const STEPS = [
  {
    emoji: "🔢",
    title: "Calcula tu carta natal",
    description:
      "Ingresa tu fecha, hora y lugar de nacimiento. En segundos tienes tu carta natal real.",
  },
  {
    emoji: "📧",
    title: "Guárdala con tu email",
    description:
      "Al guardar tu carta natal, te registras gratis. Sin contraseña — solo tu correo. Te enviamos un enlace de acceso directo y tu carta queda guardada para siempre.",
  },
  {
    emoji: "✨",
    title: "Conoce a Astrid",
    description:
      "Astrid ya revisó tu carta. Cuéntale lo que estás viviendo y ella te guía desde los astros.",
  },
  {
    emoji: "🌟",
    title: "Tu horóscopo real",
    description:
      "Cada día, un horóscopo generado por IA específico para tu signo solar.",
  },
  {
    emoji: "🪐",
    title: "Tránsitos del mes",
    description:
      "Qué planetas te afectan este mes y cómo prepararte para lo que viene.",
  },
];

export function QueEsAstrolifeModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-3 cursor-pointer text-center text-[11px] uppercase tracking-[0.12em] text-ink-muted underline-offset-2 hover:text-ink hover:underline"
      >
        ¿Qué es AstroLife?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(16,10,26,0.88)", backdropFilter: "blur(6px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-4 mb-8 w-full max-w-[480px] overflow-y-auto rounded-[18px]"
            style={{
              background: "#18102A",
              border: "1px solid #2A1F3D",
              maxHeight: "80vh",
              padding: "28px 24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <h2
                className="font-display font-bold"
                style={{ fontSize: "1.4rem", color: "#F0EDE8" }}
              >
                ¿Qué es AstroLife?
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-4 flex-shrink-0 text-[20px] leading-none"
                style={{ color: "#888880" }}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {/* Description */}
            <div
              className="mb-6 space-y-3"
              style={{ fontSize: "14px", lineHeight: "1.7", color: "#F0EDE8" }}
            >
              <p>
                AstroLife es una plataforma de astrología occidental personalizada,
                impulsada por inteligencia artificial. No es un horóscopo genérico de
                revista — es una guía construida a partir de tu carta natal real,
                calculada con tu fecha, hora y lugar de nacimiento exactos.
              </p>
              <p>
                Astrid, nuestra IA astrológica, combina los datos de tu carta natal
                con los tránsitos planetarios actuales para ofrecerte una conversación
                personalizada, profunda y relevante para lo que estás viviendo hoy.
              </p>
              <p>
                AstroLife es gratuito, en español, y está diseñado para quienes
                buscan una perspectiva distinta para entenderse mejor a sí mismos.
              </p>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-2.5">
              {STEPS.map((step) => (
                <div
                  key={step.title}
                  className="rounded-[10px]"
                  style={{ background: "#201535", padding: "12px 16px" }}
                >
                  <p
                    className="font-semibold"
                    style={{ fontSize: "13px", color: "#F0EDE8" }}
                  >
                    {step.emoji} {step.title}
                  </p>
                  <p
                    className="mt-1"
                    style={{ fontSize: "12px", lineHeight: "1.6", color: "#A898A8" }}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
