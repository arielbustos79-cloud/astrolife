import type { Transit } from "@/lib/mock-content";

export function TransitList({ transits }: { transits: Transit[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-5">
        <span className="text-[11px] uppercase tracking-[0.12em] text-[#4A4540]">
          Tránsitos del mes
        </span>
        <span className="text-xs text-gold-dim">Ver todos</span>
      </div>

      <div className="flex flex-col gap-2.5 px-5">
        {transits.map((t) => (
          <div
            key={t.name}
            className="flex items-center gap-3.5 rounded-btn border border-[#D4CEC4] bg-white px-4 py-3.5"
          >
            <span className="w-9 text-center text-xl">{t.planetSymbol}</span>
            <div className="flex-1">
              <p className="mb-0.5 text-[13px] font-medium text-[#1A1020]">
                {t.name}
              </p>
              <p className="text-xs text-[#2A2020]/65">{t.description}</p>
            </div>
            <span className="text-[11px] text-violet">{t.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
