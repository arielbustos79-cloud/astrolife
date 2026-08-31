"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/inicio", label: "Inicio", icon: "🌟" },
  { href: "/transitos", label: "Tránsitos", icon: "🪐" },
  { href: "/carta-natal", label: "Carta natal", icon: "⭕" },
  { href: "/astrid", label: "Astrid", icon: "✨" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[480px] -translate-x-1/2 justify-around border-t border-line bg-surface px-2 pb-6 pt-3">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              active ? "text-gold" : "text-ink-muted"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
