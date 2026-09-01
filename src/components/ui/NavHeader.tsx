import { UserMenu } from "./UserMenu";

type NavHeaderProps = {
  variant?: "light" | "dark";
};

export function NavHeader({ variant = "dark" }: NavHeaderProps) {
  const isLight = variant === "light";

  const bg = isLight
    ? "rgba(237, 232, 224, 0.92)"
    : "rgba(16, 10, 26, 0.92)";

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-5 py-3"
      style={{ background: bg, backdropFilter: "blur(8px)" }}
    >
      <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="#9C7F4F" strokeWidth="1.5" />
          <path
            d="M14 4 L15.4 12.6 L24 14 L15.4 15.4 L14 24 L12.6 15.4 L4 14 L12.6 12.6 Z"
            fill="#8B6A3A"
          />
          <circle cx="14" cy="14" r="1.5" fill="#5A5078" />
        </svg>
        <span
          className={`font-display text-lg font-bold ${
            isLight ? "text-[#1A1020]" : "text-ink"
          }`}
        >
          AstroLife
        </span>
      </div>
      <UserMenu isLight={isLight} />
    </header>
  );
}
