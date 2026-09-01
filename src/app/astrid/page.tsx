"use client";

import { useEffect, useRef, useState } from "react";
import { ChatBubble, TypingBubble, type ChatBubbleMessage } from "@/components/astrid/ChatBubble";
import { NavHeader } from "@/components/ui/NavHeader";
import { ChatInput } from "@/components/astrid/ChatInput";
import {
  welcomeFirstTime,
  welcomeReturning,
  ASTRID_WELCOME_MESSAGE_NO_CHART,
  type AstridChatMessage,
} from "@/lib/anthropic/astrid";
import { getNatalChart } from "@/lib/astro/actions";
import type { NatalChart } from "@/lib/astro/ephemeris";
import { BIRTH_DATA_STORAGE_KEY } from "@/lib/astro/storage";
import type { BirthFormData } from "@/components/carta/BirthDataForm";
import { createClient } from "@/lib/supabase/client";

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
    const t = nowLabel();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChatStartedAt(t);

    const stored = window.localStorage.getItem(BIRTH_DATA_STORAGE_KEY);
    const hasBirthData = Boolean(stored);
    let parsedData: BirthFormData | null = null;

    if (stored) {
      try {
        parsedData = JSON.parse(stored) as BirthFormData;
        setBirthData(parsedData);
        getNatalChart(parsedData)
          .then((chart) => setNatalChart(chart))
          .catch(() => { /* Astrid works without chart */ });
      } catch {
        window.localStorage.removeItem(BIRTH_DATA_STORAGE_KEY);
      }
    }

    if (!hasBirthData) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === WELCOME_ID
            ? { ...m, time: t, text: ASTRID_WELCOME_MESSAGE_NO_CHART, cta: { label: "Ir a Carta Natal", href: "/carta-natal" } }
            : m,
        ),
      );
      return;
    }

    // Check Supabase for first-time vs returning user
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const name = parsedData?.name?.trim() || null;
      let esPrimeraVez = true;

      if (session) {
        const { data: historial } = await supabase
          .from("chat_astrid")
          .select("id")
          .eq("user_id", session.user.id)
          .limit(1)
          .maybeSingle();

        esPrimeraVez = !historial;
      }

      const welcomeText = esPrimeraVez
        ? welcomeFirstTime(name)
        : welcomeReturning(name);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === WELCOME_ID ? { ...m, time: t, text: welcomeText } : m,
        ),
      );
    });
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
      <NavHeader
        variant="dark"
        centerContent={
          <>
            <p className="font-display text-lg font-bold text-ink">Astrid</p>
            <p className="flex items-center gap-1 text-[12px]" style={{ color: "#7BC47B" }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7BC47B]" />
              En línea
            </p>
          </>
        }
      />

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

      <ChatInput onSend={sendMessage} disabled={sending} />
    </div>
  );
}
