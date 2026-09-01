"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function LandingCta() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });
  }, []);

  // During SSR / loading: show no-session state (safe default)
  const showSession = hasSession === true;

  return (
    <div className="flex flex-col items-center">
      <Link
        href={showSession ? "/inicio" : "/carta-natal"}
        className="mb-4 w-full max-w-[280px] rounded-full py-4 text-center text-[15px] font-semibold transition-opacity hover:opacity-[.88]"
        style={{ background: "#C8A96E", color: "#100A1A" }}
      >
        {showSession ? "Ver mi horóscopo →" : "Calcular mi carta natal →"}
      </Link>

      {!showSession && (
        <p className="text-[13px] text-ink-muted">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            style={{ color: "#C8A96E" }}
            className="underline underline-offset-2"
          >
            Ingresa aquí
          </Link>
        </p>
      )}
    </div>
  );
}
