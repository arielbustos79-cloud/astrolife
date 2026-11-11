"use client";

import { useEffect } from "react";

const STORAGE_KEY = "astrolife:pending-optin";

export function OptinPendienteSync() {
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) localStorage.removeItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (raw === null) return;

    const optin = raw === "true";
    fetch("/api/marketing-optin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optin }),
    }).catch(() => {});
  }, []);

  return null;
}
