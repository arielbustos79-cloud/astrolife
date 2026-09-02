"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "astrolife:pwa-banner-shown";

export function PwaBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const shown = window.localStorage.getItem(STORAGE_KEY);
      if (!shown) setVisible(true);
    } catch { /* ignore */ }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch { /* ignore */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed left-4 right-4 z-40 flex items-center gap-3 rounded-[12px]"
      style={{
        bottom: "80px",
        background: "#18102A",
        border: "1px solid #C8A96E",
        padding: "12px 16px",
      }}
    >
      <span className="text-xl">⊕</span>
      <div className="flex-1">
        <p className="font-semibold" style={{ fontSize: "13px", color: "#F0EDE8" }}>
          Agrega AstroLife a tu pantalla
        </p>
        <p style={{ fontSize: "11px", color: "#888880" }}>
          Accede más rápido desde tu celular
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar"
        className="ml-auto flex-shrink-0 text-[18px] leading-none"
        style={{ color: "#888880" }}
      >
        ×
      </button>
    </div>
  );
}
