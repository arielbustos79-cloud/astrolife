"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BIRTH_DATA_STORAGE_KEY } from "@/lib/astro/storage";
import type { BirthFormData } from "@/components/carta/BirthDataForm";

export function UserMenu({ isLight }: { isLight: boolean }) {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [nombre, setNombre] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const loadSession = async () => {
      let session = null;
      try {
        const { data } = await supabase.auth.getSession();
        session = data.session;
        setEmail(session?.user?.email ?? null);
      } catch {
        setEmail(null);
      }

      // Try localStorage first for the name
      try {
        const raw = window.localStorage.getItem(BIRTH_DATA_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as BirthFormData;
          if (parsed.name?.trim()) {
            setNombre(parsed.name.trim());
            return;
          }
        }
      } catch { /* continue to Supabase */ }

      // Fallback: query carta_natal.nombre from Supabase
      if (session) {
        try {
          const { data: carta } = await supabase
            .from("carta_natal")
            .select("nombre")
            .eq("user_id", session.user.id)
            .maybeSingle();
          const nombre = (carta as { nombre?: string | null } | null)?.nombre;
          if (nombre?.trim()) setNombre(nombre.trim());
        } catch { /* no name available */ }
      }
    };

    void loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
  }

  const loading = email === undefined;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !loading && setOpen((o) => !o)}
        aria-label="Menú"
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-opacity ${
          loading ? "opacity-0 pointer-events-none" : "opacity-100"
        } ${
          isLight
            ? "border-[#C8C0B4] bg-white text-[#1A1020]"
            : "border-line bg-surface text-ink"
        }`}
      >
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <rect width="16" height="2" rx="1" fill="currentColor" />
          <rect y="5" width="16" height="2" rx="1" fill="currentColor" />
          <rect y="10" width="16" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>

      {open && !loading && (
        <div
          className="absolute right-0 top-12 z-50 min-w-[200px] overflow-hidden rounded-[12px]"
          style={{
            background: "#18102A",
            border: "1px solid #2A1F3D",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {email ? (
            <>
              <p
                className="px-4 pb-2 pt-3 text-[13px]"
                style={{ color: "#888880" }}
              >
                Hola{nombre ? `, ${nombre}` : ""} 👋
              </p>

              <div style={{ borderTop: "1px solid #2A1F3D", margin: "4px 0" }} />

              <Link
                href="/inicio"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-[14px] transition-colors hover:bg-white/5"
                style={{ color: "#F0EDE8" }}
              >
                🌟 Mi horóscopo
              </Link>
              <Link
                href="/astrid"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-[14px] transition-colors hover:bg-white/5"
                style={{ color: "#F0EDE8" }}
              >
                ✨ Hablar con Astrid
              </Link>
              <Link
                href="/carta-natal"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-[14px] transition-colors hover:bg-white/5"
                style={{ color: "#F0EDE8" }}
              >
                ⭕ Mi carta natal
              </Link>

              <div style={{ borderTop: "1px solid #2A1F3D", margin: "4px 0" }} />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-[14px] transition-colors hover:bg-white/5"
                style={{ color: "#E8785A" }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-[14px] transition-colors hover:bg-white/5"
              style={{ color: "#F0EDE8" }}
            >
              Iniciar sesión <span>→</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
