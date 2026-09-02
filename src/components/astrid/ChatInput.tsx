"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

type ChatInputProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [recording, setRecording] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    const SR =
      (typeof window !== "undefined" &&
        ((window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)) ||
      null;
    setHasMic(Boolean(SR));
  }, []);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submit();
  }

  function toggleMic() {
    if (recording) {
      (recognitionRef.current as { stop: () => void } | null)?.stop();
      setRecording(false);
      return;
    }

    const SR =
      (window as unknown as { SpeechRecognition?: new () => unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
    if (!SR) return;

    const r = new SR() as {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: ((e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    };
    r.lang = "es-CL";
    r.continuous = false;
    r.interimResults = false;

    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setValue(transcript);
    };
    r.onerror = () => setRecording(false);
    r.onend = () => setRecording(false);

    recognitionRef.current = r;
    r.start();
    setRecording(true);
  }

  return (
    <div className="flex items-center gap-2.5 border-t border-[#E8E0F0] bg-chat-bg px-4 pb-7 pt-3">
      {hasMic && (
        <button
          type="button"
          onClick={toggleMic}
          disabled={disabled}
          aria-label={recording ? "Detener grabación" : "Grabar voz"}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-all disabled:opacity-40"
          style={
            recording
              ? {
                  background: "rgba(200,169,110,0.15)",
                  borderColor: "#C8A96E",
                  color: "#C8A96E",
                  animation: "pulse 1s infinite",
                }
              : {
                  background: "var(--surface, #fff)",
                  borderColor: "#E0D8F0",
                  color: "#888880",
                }
          }
        >
          🎤
        </button>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escríbele a Astrid…"
        disabled={disabled}
        className="flex-1 rounded-full border border-[#E0D8F0] bg-white px-4 py-2.5 text-sm text-chat-ink placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-violet/30"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Enviar"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet text-base text-white disabled:opacity-50"
      >
        ↑
      </button>
    </div>
  );
}
