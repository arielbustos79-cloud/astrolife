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

function tsLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

let nextId = 1;
function newId() {
  return `msg-${nextId++}`;
}

export default function AstridPage() {
  const [messages, setMessages] = useState<ChatBubbleMessage[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [sending, setSending] = useState(false);
  const [chatStartedAt, setChatStartedAt] = useState("");
  const [natalChart, setNatalChart] = useState<NatalChart | null>(null);
  const [birthData, setBirthData] = useState<BirthFormData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = nowLabel();
    setChatStartedAt(t);

    const init = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user.id ?? null);

      // 1. Load birth data: localStorage → Supabase fallback
      let parsedData: BirthFormData | null = null;
      const stored = window.localStorage.getItem(BIRTH_DATA_STORAGE_KEY);
      if (stored) {
        try {
          parsedData = JSON.parse(stored) as BirthFormData;
        } catch {
          window.localStorage.removeItem(BIRTH_DATA_STORAGE_KEY);
        }
      }

      if (!parsedData && session) {
        const { data: carta } = await supabase
          .from("carta_natal")
          .select("nombre,fecha_nacimiento,hora_nacimiento,lugar_nacimiento,utc_offset")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (carta) {
          const [lat, lon] = (carta.lugar_nacimiento as string).split(",").map(Number);
          parsedData = {
            name: (carta.nombre as string | null) ?? "",
            date: carta.fecha_nacimiento as string,
            time: carta.hora_nacimiento as string,
            utcOffsetHours: carta.utc_offset as number,
            latitude: lat,
            longitude: lon,
          };
          window.localStorage.setItem(BIRTH_DATA_STORAGE_KEY, JSON.stringify(parsedData));
        }
      }

      // 2. No birth data → no-chart welcome
      if (!parsedData) {
        setMessages([{
          id: newId(),
          role: "astrid",
          text: ASTRID_WELCOME_MESSAGE_NO_CHART,
          time: t,
          cta: { label: "Ir a Carta Natal", href: "/carta-natal" },
        }]);
        setInitialized(true);
        return;
      }

      // 3. Start chart calculation in background
      setBirthData(parsedData);
      getNatalChart(parsedData)
        .then((chart) => setNatalChart(chart))
        .catch(() => { /* Astrid works without chart */ });

      // 4. Load chat history if session exists
      if (session) {
        const { data: historial } = await supabase
          .from("chat_astrid")
          .select("id,role,content,created_at")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        const ordered = (historial ?? []).reverse();

        if (ordered.length > 0) {
          // Has history → show history directly
          const mapped: ChatBubbleMessage[] = ordered.map((h) => ({
            id: `hist-${h.id as string}`,
            role: (h.role as string) === "user" ? "user" : "astrid",
            text: h.content as string,
            time: tsLabel(h.created_at as string),
          }));
          setMessages(mapped);
          setInitialized(true);
          return;
        }
      }

      // 5. No history → personalized first-time welcome
      const name = parsedData.name?.trim() || null;
      const welcomeText = welcomeFirstTime(name);
      setMessages([{ id: newId(), role: "astrid", text: welcomeText, time: t }]);
      setInitialized(true);
    };

    void init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function saveMessage(role: "user" | "assistant", content: string) {
    if (!userId) return;
    try {
      await createClient()
        .from("chat_astrid")
        .insert({ user_id: userId, role, content });
    } catch { /* non-critical, ignore */ }
  }

  async function sendMessage(text: string) {
    const history: AstridChatMessage[] = [
      ...messages.map((m) => ({
        role: (m.role === "astrid" ? "assistant" : "user") as "assistant" | "user",
        content: m.text,
      })),
      { role: "user", content: text },
    ];

    const userMsgId = newId();
    setMessages((prev) => [...prev, { id: userMsgId, role: "user", text, time: nowLabel() }]);
    setSending(true);
    void saveMessage("user", text);

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
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === astridMessageId ? { ...m, text: m.text + chunk } : m,
          ),
        );
      }

      void saveMessage("assistant", fullText);
    } catch (error) {
      const errText =
        error instanceof Error
          ? `Astrid no pudo responder ahora mismo. (${error.message})`
          : "Astrid no pudo responder ahora mismo.";
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === astridMessageId);
        if (exists) {
          return prev.map((m) => (m.id === astridMessageId ? { ...m, text: errText } : m));
        }
        return [...prev, { id: astridMessageId, role: "astrid", text: errText, time: nowLabel() }];
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
          {!initialized ? (
            <TypingBubble />
          ) : (
            messages.map((m) =>
              m.role === "astrid" && m.text === "" && sending ? (
                <TypingBubble key={m.id} />
              ) : (
                <ChatBubble key={m.id} message={m} />
              ),
            )
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={sending || !initialized} />
    </div>
  );
}
