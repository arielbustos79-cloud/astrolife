import { NavHeader } from "@/components/ui/NavHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { SignAndHoroscope } from "@/components/home/SignAndHoroscope";
import { AstridCta } from "@/components/home/AstridCta";
import { TransitList } from "@/components/home/TransitList";
import { CartaPendienteSync } from "@/components/inicio/CartaPendienteSync";
import { PwaBanner } from "@/components/ui/PwaBanner";
import { MOON_PHASE_TODAY, MONTHLY_TRANSITS } from "@/lib/mock-content";

const rawTodayLabel = new Intl.DateTimeFormat("es-CL", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());
const TODAY_LABEL =
  rawTodayLabel.charAt(0).toUpperCase() + rawTodayLabel.slice(1);

export default function InicioPage() {
  return (
    <div className="min-h-screen bg-home-bg pb-28">
      <CartaPendienteSync />
      <NavHeader variant="light" />

      <div className="bg-gradient-to-b from-violet/10 to-transparent px-5 pb-6 pt-1">
        <p className="mb-1 text-[13px] font-medium text-[#4A4540]">Hoy es</p>
        <p className="font-display mb-4 text-2xl font-semibold text-[#1A1020]">
          {TODAY_LABEL}
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-gold-dim/50 bg-gold-dim/15 px-3 py-1.5 text-xs font-medium text-[#6B4F20]">
          <span style={{ color: "initial" }}>🌙</span>
          {MOON_PHASE_TODAY}
        </span>
      </div>

      <SignAndHoroscope />
      <AstridCta />
      <TransitList transits={MONTHLY_TRANSITS} />

      <PwaBanner />
      <BottomNav />
    </div>
  );
}
