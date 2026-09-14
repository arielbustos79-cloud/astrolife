import { NavHeader } from "@/components/ui/NavHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { SignAndHoroscope } from "@/components/home/SignAndHoroscope";
import { AstridCta } from "@/components/home/AstridCta";
import { CartaPendienteSync } from "@/components/inicio/CartaPendienteSync";
import { LunaChip } from "@/components/inicio/LunaChip";
import { PwaBanner } from "@/components/ui/PwaBanner";

// Force SSR so new Date() evaluates per-request, not at build time
export const dynamic = "force-dynamic";

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
        <LunaChip />
      </div>

      <SignAndHoroscope />
      <AstridCta />

      <PwaBanner />
      <BottomNav />
    </div>
  );
}
