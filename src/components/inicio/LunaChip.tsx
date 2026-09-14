"use client";

import { useEffect, useState } from "react";
import type { FaseLunar } from "@/lib/luna";

export function LunaChip() {
  const [luna, setLuna] = useState<FaseLunar | null>(null);

  useEffect(() => {
    fetch("/api/luna")
      .then((r) => r.json())
      .then((data: FaseLunar) => setLuna(data))
      .catch(() => {});
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-gold-dim/50 bg-gold-dim/15 px-3 py-1.5 text-xs font-medium text-[#6B4F20]">
      <span style={{ color: "initial" }}>{luna?.emoji ?? "🌙"}</span>
      {luna?.texto ?? "Cargando fase lunar..."}
    </span>
  );
}
