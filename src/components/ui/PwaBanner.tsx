"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "astrolife:pwa-banner-shown";

type OS = "ios" | "android" | "other";

function detectOS(): OS {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

export function PwaBanner() {
  const [visible, setVisible] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [os, setOs] = useState<OS>("other");
  const deferredPromptRef = useRef<{ prompt: () => void } | null>(null);

  useEffect(() => {
    try {
      const yaInstalada = window.matchMedia("(display-mode: standalone)").matches;
      const yaMostrado = window.localStorage.getItem(STORAGE_KEY);
      if (yaInstalada || yaMostrado) return;
      setOs(detectOS());
      setVisible(true);
    } catch { /* ignore */ }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as unknown as { prompt: () => void };
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    try { window.localStorage.setItem(STORAGE_KEY, "true"); } catch { /* ignore */ }
    setVisible(false);
    setShowTip(false);
  }

  async function handleInstall() {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      dismiss();
      return;
    }
    // No native prompt available → show manual instructions
    setShowTip((prev) => !prev);
  }

  if (!visible) return null;

  const tipText =
    os === "ios"
      ? 'En Safari: toca el ícono compartir → "Agregar a pantalla de inicio"'
      : 'En Chrome: toca el menú ⋮ → "Agregar a pantalla de inicio"';

  return (
    <div
      className="fixed left-4 right-4 z-40 rounded-[12px]"
      style={{
        bottom: "80px",
        background: "#18102A",
        border: "1px solid #C8A96E",
        padding: "12px 16px",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleInstall}
          className="flex flex-1 items-center gap-3 text-left"
          aria-label="Instalar AstroLife"
        >
          <span className="text-xl">⊕</span>
          <div>
            <p className="font-semibold" style={{ fontSize: "13px", color: "#F0EDE8" }}>
              Agrega AstroLife a tu pantalla
            </p>
            <p style={{ fontSize: "11px", color: "#888880" }}>
              Accede más rápido desde tu celular
            </p>
          </div>
        </button>
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

      {showTip && (
        <p
          className="mt-2 rounded-[8px] px-3 py-2 text-[11px] leading-snug"
          style={{ background: "rgba(200,169,110,0.12)", color: "#C8A96E" }}
        >
          {tipText}
        </p>
      )}
    </div>
  );
}
