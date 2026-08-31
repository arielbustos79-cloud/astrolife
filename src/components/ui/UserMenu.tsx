"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UserMenu({ isLight }: { isLight: boolean }) {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setEmail(session?.user?.email ?? null);
      } catch {
        setEmail(null);
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
        aria-label="Perfil"
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-base transition-opacity ${
          loading ? "opacity-0 pointer-events-none" : "opacity-100"
        } ${
          isLight
            ? "border-[#C8C0B4] bg-white text-[#1A1020]"
            : "border-line bg-surface text-ink"
        }`}
      >
        👤
      </button>

      {open && !loading && (
        <div className="absolute right-0 top-11 z-50 min-w-[190px] overflow-hidden rounded-[10px] border border-line bg-surface shadow-lg">
          {email ? (
            <>
              <p className="truncate px-3 py-2.5 text-[11px] text-ink-muted">
                {email}
              </p>
              <div className="border-t border-line" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-3 py-2.5 text-left text-[13px] hover:bg-surface-2"
                style={{ color: "#E8785A" }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-[13px] text-ink hover:bg-surface-2"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
