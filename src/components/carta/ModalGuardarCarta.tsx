"use client";

import { useState } from "react";

type ModalGuardarCartaProps = {
  onGuardar: (email: string) => Promise<void>;
  onContinuar: () => void;
};

export function ModalGuardarCarta({ onGuardar, onContinuar }: ModalGuardarCartaProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setError(null);
    try {
      await onGuardar(email.trim());
      setSent(true);
    } catch {
      setError("No se pudo enviar el enlace. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: "rgba(16, 10, 26, 0.85)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-[360px] rounded-[18px] border border-line bg-surface p-7"
      >
        {sent ? (
          <div className="text-center">
            <p className="mb-3 text-3xl">📬</p>
            <p className="font-display mb-2 text-xl font-bold text-ink">
              Revisa tu email
            </p>
            <p className="text-sm leading-relaxed text-ink-muted">
              Te enviamos un enlace de acceso a{" "}
              <span className="text-ink">{email}</span>. Haz clic en él y tu
              carta quedará guardada.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-1 text-2xl">✨</p>
            <p className="font-display mb-2 text-[1.3rem] font-bold leading-tight text-ink">
              Tu carta natal está lista
            </p>
            <p className="mb-5 text-[14px] leading-relaxed text-ink-muted">
              Guárdala con tu email para no perderla la próxima vez.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-[10px] border-[1.5px] border-line bg-bg px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-gold"
              />
              {error && <p className="text-[12px] text-[#E8785A]">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-gold py-3.5 text-[15px] font-semibold text-bg transition-opacity hover:opacity-[.88] disabled:opacity-50"
              >
                {sending ? "Enviando…" : "Guardar gratis →"}
              </button>
            </form>

            <button
              type="button"
              onClick={onContinuar}
              className="mt-4 w-full text-center text-[13px] text-ink-muted underline"
            >
              Continuar sin guardar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
