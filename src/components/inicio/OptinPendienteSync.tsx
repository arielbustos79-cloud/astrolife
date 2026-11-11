"use client";

import { useEffect } from "react";

const STORAGE_KEY = "astrolife:pending-optin";

export function OptinPendienteSync() {
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    console.log("[OptinSync] localStorage value:", raw);
    if (raw === null) return;

    const optin = raw === "true";

    console.log("[OptinSync] Enviando optin a /api/marketing-optin", { optin });
    fetch("/api/marketing-optin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optin }),
    })
      .then(async (res) => {
        const body = await res.text();
        console.log("[OptinSync] Respuesta:", res.status, body);
        if (res.ok) {
          try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignorar */ }
        }
      })
      .catch((err) => { console.log("[OptinSync] Error fetch:", err); });
  }, []);

  return null;
}
