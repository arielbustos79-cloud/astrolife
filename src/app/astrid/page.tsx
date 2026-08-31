"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChatBubble, TypingBubble, type ChatBubbleMessage } from "@/components/astrid/ChatBubble";
import { ChatInput } from "@/components/astrid/ChatInput";
import {
  ASTRID_WELCOME_MESSAGE_NO_CHART,
  ASTRID_WELCOME_MESSAGE_WITH_CHART,
  type AstridChatMessage,
} from "@/lib/anthropic/astrid";
import { getNatalChart } from "@/lib/astro/actions";
import type { NatalChart } from "@/lib/astro/ephemeris";
import { BIRTH_DATA_STORAGE_KEY } from "@/lib/astro/storage";
import type { BirthFormData } from "@/components/carta/BirthDataForm";

const SUGGESTIONS = ["¿Y en el amor?", "Ver mis tránsitos", "¿Qué dice Venus?"];

function nowLabel() {
  return new Date().toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

let nextId = 1;
function newId() {
  return `msg-${nextId++}`;
}

const WELCOME_ID = "msg-welcome";

export default function AstridPage() {
  const [messages, setMessages] = useState<ChatBubbleMessage[]>(() => [
    { id: WELCOME_ID, role: "astrid", text: "", time: "" },
  ]);
  const [sending, setSending] = useState(false);
  const [chatStartedAt, setChatStartedAt] = useState("");
  const [natalChart, setNatalChart] = useState<NatalChart | null>(null);
  const [birthData, setBirthData] = useState<BirthFormData | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The clock and localStorage can't be read during SSR without risking a
    // mismatch against the client, so both the timestamp and the
    // chart-dependent welcome message are filled in here, post-mount.
    const t = nowLabel();
    const stored = window.localStorage.getItem(BIRTH_DATA_STORAGE_KEY);
    const hasBirthData = Boolean(stored);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChatStartedAt(t);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === WELCOME_ID
          ? {
              ...m,
              time: t,
              text: hasBirthData ? ASTRID_WELCOME_MESSAGE_WITH_CHART : ASTRID_WELCOME_MESSAGE_NO_CHART,
              cta: hasBirthData ? undefined : { label: "Ir a Carta Natal", href: "/carta-natal" },
            }
          : m,
      ),
    );

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as BirthFormData;
        setBirthData(parsed);
        getNatalChart(parsed)
          .then((chart) => {
            console.log("[astrid/page] natalChart calculated:", chart);
            console.log("[astrid/page] birthData (name, date):", parsed.name, parsed.date);
            setNatalChart(chart);
          })
          .catch(() => {
            /* no natal chart available; Astrid still works without it */
          });
      } catch {
        window.localStorage.removeItem(BIRTH_DATA_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function sendMessage(text: string) {
    const history: AstridChatMessage[] = [
      ...messages.map((m) => ({
        role: (m.role === "astrid" ? "assistant" : "user") as "assistant" | "user",
        content: m.text,
      })),
      { role: "user", content: text },
    ];

    setMessages((prev) => [...prev, { id: newId(), role: "user", text, time: nowLabel() }]);
    setSending(true);

    const astridMessageId = newId();

    try {
      const res = await fetch("/api/astrid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          natalChart: natalChart ?? undefined,
          birthData: birthData ?? undefined,
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo conectar con Astrid.");
      }

      setMessages((prev) => [
        ...prev,
        { id: astridMessageId, role: "astrid", text: "", time: nowLabel() },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === astridMessageId ? { ...m, text: m.text + chunk } : m,
          ),
        );
      }
    } catch (error) {
      const text =
        error instanceof Error
          ? `Astrid no pudo responder ahora mismo. (${error.message})`
          : "Astrid no pudo responder ahora mismo.";
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === astridMessageId);
        if (exists) {
          return prev.map((m) => (m.id === astridMessageId ? { ...m, text } : m));
        }
        return [...prev, { id: astridMessageId, role: "astrid", text, time: nowLabel() }];
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-svh flex-col bg-chat-bg text-chat-ink">
      <div className="flex flex-shrink-0 items-center gap-3 bg-bg px-5 py-3">
        <Link href="/inicio" className="text-[14px] text-[#888880]">
          ← Inicio
        </Link>
        <div className="flex-1 text-center">
          <p className="font-display text-lg font-bold text-ink">Astrid</p>
          <p className="flex items-center justify-center gap-1 text-xs text-[#7BC47B]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7BC47B]" />
            En línea
          </p>
        </div>
        <span className="w-6" />
      </div>

      {natalChart && (
        <p className="flex-shrink-0 bg-bg pb-2.5 text-center text-[11px] text-gold">
          ✨ Astrid conoce tu carta natal
        </p>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 text-center text-[11px] text-[#999]">Hoy · {chatStartedAt}</p>
        <div className="flex flex-col gap-3">
          {messages.map((m) =>
            m.role === "astrid" && m.text === "" && sending ? (
              <TypingBubble key={m.id} />
            ) : (
              <ChatBubble key={m.id} message={m} />
            ),
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-shrink-0 flex-wrap gap-2 px-4 pb-1">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => sendMessage(s)}
            disabled={sending}
            className="whitespace-nowrap rounded-full border border-[#E0D8F0] bg-white px-3.5 py-1.5 text-xs text-violet disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <ChatInput onSend={sendMessage} disabled={sending} />
    </div>
  );
}
