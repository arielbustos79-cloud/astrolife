"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setError(null);

    const supabase = createClient();
    const { error: sbError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (sbError) {
      console.error("OTP error:", sbError.message, sbError.status);
      setError(`Error: ${sbError.message}`);
    } else {
      setSent(true);
    }
    setSending(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-5 py-10">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="#9C7F4F" strokeWidth="1.5" />
          <path
            d="M14 4 L15.4 12.6 L24 14 L15.4 15.4 L14 24 L12.6 15.4 L4 14 L12.6 12.6 Z"
            fill="#8B6A3A"
          />
          <circle cx="14" cy="14" r="1.5" fill="#5A5078" />
        </svg>
        <span className="font-display text-xl font-bold text-ink">AstroLife</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] rounded-[18px] border border-line bg-surface p-8">
        {sent ? (
          <div className="text-center">
            <p className="mb-2 text-3xl">📬</p>
            <h2 className="font-display mb-2 text-xl font-bold text-ink">
              Revisa tu email
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Te enviamos un enlace de acceso a{" "}
              <span className="text-ink">{email}</span>. Haz clic en él para
              entrar.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display mb-1 text-2xl font-bold text-ink">
              Acceder
            </h2>
            <p className="mb-6 text-sm text-ink-muted">
              Ingresa tu email y te enviamos un enlace de acceso.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-[10px] border border-line bg-bg px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-gold"
              />

              {error && (
                <p className="text-[12px] text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-gold py-3.5 text-[15px] font-semibold text-bg transition-opacity hover:opacity-[.88] disabled:opacity-50"
              >
                {sending ? "Enviando…" : "Recibir enlace de acceso →"}
              </button>
            </form>

            <p className="mt-4 text-center text-[12px] text-ink-muted">
              Sin contraseña. Solo tu email.
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-[13px] text-ink-muted">
        ¿Primera vez?{" "}
        <Link href="/inicio" className="text-gold hover:underline">
          Comienza gratis →
        </Link>
      </p>
    </div>
  );
}
