"use client";

import { useState, type KeyboardEvent } from "react";

type ChatInputProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submit();
  }

  return (
    <div className="flex items-center gap-2.5 border-t border-[#E8E0F0] bg-chat-bg px-4 pb-7 pt-3">
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
