import Link from "next/link";

export function AstridCta() {
  return (
    <Link
      href="/astrid"
      className="mx-5 mb-5 flex items-center gap-3.5 rounded-card border border-violet/30 bg-gradient-to-br from-violet/20 to-gold/10 px-5 py-4"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-dim to-gold-dim text-xl">
        ✨
      </span>
      <div className="flex-1">
        <p className="mb-0.5 text-[13px] font-semibold text-ink">
          Habla con Astrid
        </p>
        <p className="text-xs text-ink-muted">
          Pregúntale lo que necesites saber hoy
        </p>
      </div>
      <span className="text-base text-gold">→</span>
    </Link>
  );
}
