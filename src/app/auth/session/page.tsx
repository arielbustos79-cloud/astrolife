"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Handles implicit flow: tokens arrive in URL hash (#access_token=...).
// The Supabase client detects them automatically and sets the session.
export default function AuthSessionPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();
        router.replace("/inicio");
      }
    });

    // Fallback: if already signed in or hash already processed
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        router.replace("/inicio");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <p className="text-sm text-ink-muted">Iniciando sesión…</p>
    </div>
  );
}
