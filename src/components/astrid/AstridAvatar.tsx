export function AstridAvatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const dimensions = size === "lg" ? "h-14 w-14 text-2xl" : "h-8 w-8 text-[15px]";

  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-dim to-gold-dim ${dimensions}`}
    >
      ✨
    </span>
  );
}
