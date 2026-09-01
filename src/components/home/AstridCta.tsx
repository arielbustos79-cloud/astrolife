import Link from "next/link";

export function AstridCta() {
  return (
    <Link
      href="/astrid"
      className="mx-5 mb-5 flex items-center gap-3.5 rounded-card px-5 py-4"
      style={{ background: "#7B6FA0" }}
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-xl">
        ✨
      </span>
      <div className="flex-1">
        <p className="mb-0.5 text-[13px] font-semibold" style={{ color: "#F0EDE8" }}>
          Habla con Astrid
        </p>
        <p className="text-xs" style={{ color: "rgba(240,237,232,0.8)" }}>
          Pregúntale lo que necesites saber hoy
        </p>
      </div>
      <span className="text-base" style={{ color: "#C8A96E" }}>→</span>
    </Link>
  );
}
