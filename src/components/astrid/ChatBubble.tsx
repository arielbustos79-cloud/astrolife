import Link from "next/link";
import { AstridAvatar } from "./AstridAvatar";

export type ChatBubbleMessage = {
  id: string;
  role: "user" | "astrid";
  text: string;
  time: string;
  cta?: { label: string; href: string };
};

export function ChatBubble({ message }: { message: ChatBubbleMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && <AstridAvatar />}
      <div className={`flex flex-col ${isUser ? "items-end" : ""}`}>
        <div
          className={`max-w-[72vw] whitespace-pre-wrap rounded-[18px] px-3.5 py-3 text-sm leading-[1.55] sm:max-w-xs ${
            isUser
              ? "rounded-br-[4px] bg-violet text-white"
              : "rounded-bl-[4px] bg-white text-chat-ink shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
          }`}
        >
          {message.text}
        </div>
        {message.cta && (
          <Link
            href={message.cta.href}
            className="mt-1.5 rounded-full bg-violet px-3.5 py-1.5 text-xs font-medium text-white"
          >
            {message.cta.label} →
          </Link>
        )}
        <span className="mt-1 px-1 text-[10px] text-[#aaa]">{message.time}</span>
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex items-end gap-2">
      <AstridAvatar />
      <div className="flex items-center gap-1 rounded-[18px] rounded-bl-[4px] bg-white px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#999]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
