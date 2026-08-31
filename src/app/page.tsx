import Link from "next/link";

const FEATURES = [
  {
    icon: "🌟",
    title: "Horóscopo diario",
    description: "Generado por IA para tu signo, cada día.",
    href: "/inicio",
  },
  {
    icon: "⭕",
    title: "Carta natal real",
    description: "Calculada con tu fecha y lugar exacto de nacimiento.",
    href: "/carta-natal",
  },
  {
    icon: "✨",
    title: "Astrid, tu guía",
    description: "Tu guía astrológica personal disponible 24/7.",
    href: "/astrid",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">

      {/* Header */}
      <header className="flex items-center px-5 py-4">
        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#9C7F4F" strokeWidth="1.5" />
            <path
              d="M14 4 L15.4 12.6 L24 14 L15.4 15.4 L14 24 L12.6 15.4 L4 14 L12.6 12.6 Z"
              fill="#8B6A3A"
            />
            <circle cx="14" cy="14" r="1.5" fill="#5A5078" />
          </svg>
          <span className="font-display text-lg font-bold text-ink">AstroLife</span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-8 text-center">
        {/* Decorative glow */}
        <div
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-full text-4xl"
          style={{
            background:
              "radial-gradient(circle, rgba(123,111,160,0.3) 0%, rgba(200,169,110,0.15) 60%, transparent 100%)",
          }}
        >
          🌙
        </div>

        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-[11px] tracking-wide text-violet">
          ✨ Astrología con inteligencia artificial
        </div>

        <h1 className="font-display mb-3 text-[2.6rem] font-bold leading-[1.15] text-ink">
          Una guía entre<br />tanto caos.
        </h1>

        <p className="mb-8 max-w-[280px] text-[14px] leading-relaxed text-ink-muted">
          Astrología real. Personalizada por IA. En español.
        </p>

        <Link
          href="/inicio"
          className="mb-4 w-full max-w-[280px] rounded-full py-4 text-center text-[15px] font-semibold transition-opacity hover:opacity-[.88]"
          style={{ background: "#C8A96E", color: "#100A1A" }}
        >
          Comenzar gratis →
        </Link>

        <p className="text-[13px] text-ink-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "#C8A96E" }} className="underline underline-offset-2">
            Ingresa aquí
          </Link>
        </p>
      </section>

      {/* Features */}
      <section className="px-4 pb-8">
        <p className="mb-3 text-center text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          ¿Qué es AstroLife?
        </p>
        <div className="flex flex-col gap-2.5">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="flex items-center gap-4 rounded-[14px] border border-line bg-surface px-4 py-3.5 transition-colors duration-150 hover:border-gold"
            >
              <span
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl"
                style={{ background: "rgba(123,111,160,0.12)" }}
              >
                {f.icon}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-ink">{f.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">{f.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line px-5 py-5">
        <p className="mb-2.5 text-center text-[11px] text-ink-muted">© 2026 LongViva SpA</p>
        <div className="flex items-center justify-center gap-1 text-[11px] text-ink-muted">
          <Link href="/terminos" className="px-2 hover:text-ink">Términos</Link>
          <span>·</span>
          <Link href="/privacidad" className="px-2 hover:text-ink">Privacidad</Link>
          <span>·</span>
          <a href="mailto:hola@astrolife.cl" className="px-2 hover:text-ink">Contacto</a>
        </div>
      </footer>

    </div>
  );
}
