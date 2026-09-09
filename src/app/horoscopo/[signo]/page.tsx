import Link from "next/link";
import type { Metadata } from "next";
import { NavHeader } from "@/components/ui/NavHeader";
import { ZODIAC_SIGNS, getZodiacSign } from "@/lib/zodiac";
import { getSignoInfo } from "@/lib/signos-info";
import { generarHoroscopo } from "@/lib/horoscopo-servidor";

export const revalidate = 86400;

export async function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ signo: s.id }));
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fechaHoy() {
  return new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ signo: string }>;
}): Promise<Metadata> {
  const { signo } = await params;
  const sign = getZodiacSign(signo);
  const fecha = fechaHoy();

  return {
    title: `Horóscopo de ${sign.name} hoy — AstroLife.cl`,
    description: `Horóscopo de ${sign.name} para hoy, ${fecha}. Generado por inteligencia artificial, actualizado cada día. Descubre qué te deparan los astros.`,
    openGraph: {
      title: `Horóscopo ${sign.name} — ${fecha}`,
      description: `Tu horóscopo de ${sign.name} para hoy en AstroLife.cl`,
      url: `https://astrolife.cl/horoscopo/${signo}`,
      siteName: "AstroLife",
      locale: "es_CL",
      type: "article",
    },
    alternates: {
      canonical: `https://astrolife.cl/horoscopo/${signo}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Horóscopo ${sign.name} hoy — AstroLife`,
      description: `Horóscopo de ${sign.name} para hoy, ${fecha}. Generado por inteligencia artificial en AstroLife.cl`,
    },
  };
}

export default async function HoroscopoSignoPage({
  params,
}: {
  params: Promise<{ signo: string }>;
}) {
  const { signo } = await params;

  const sign = getZodiacSign(signo);
  const info = getSignoInfo(signo);

  let horoscopo = { texto: "", aspectos: [] as string[], planeta: "" };
  try {
    horoscopo = await generarHoroscopo(sign.name);
  } catch {
    horoscopo = {
      texto: `El horóscopo de ${sign.name} para hoy se está actualizando. Vuelve en unos momentos.`,
      aspectos: [],
      planeta: info.planeta,
    };
  }

  const fechaCap = capitalize(fechaHoy());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Horóscopo de ${sign.name} hoy`,
    description: `Horóscopo diario de ${sign.name} generado por inteligencia artificial en AstroLife.cl`,
    publisher: {
      "@type": "Organization",
      name: "AstroLife",
      url: "https://astrolife.cl",
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen" style={{ background: "#100A1A", color: "#F0EDE8" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <NavHeader variant="dark" />

      {/* Hero del signo */}
      <section className="px-5 pb-8 pt-6 text-center">
        <div
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-5xl"
          style={{
            background: "rgba(200,169,110,0.12)",
            border: "1px solid rgba(200,169,110,0.25)",
          }}
        >
          {sign.symbol}
        </div>
        <h1 className="font-display mb-1 text-[2rem] font-bold" style={{ color: "#F0EDE8" }}>
          {sign.name}
        </h1>
        <p className="mb-3 text-[13px]" style={{ color: "#888880" }}>
          {sign.dateRange}
        </p>
        <div className="flex justify-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-[12px] font-medium"
            style={{ background: "rgba(200,169,110,0.12)", color: "#C8A96E" }}
          >
            {info.elemento}
          </span>
          <span
            className="rounded-full px-3 py-1 text-[12px] font-medium"
            style={{ background: "rgba(123,111,160,0.15)", color: "#A898C8" }}
          >
            {info.planeta}
          </span>
        </div>
      </section>

      {/* Horóscopo del día */}
      <section
        className="mx-5 mb-6 rounded-[18px] p-6"
        style={{ background: "#18102A", border: "1px solid #2A1F3D" }}
      >
        <h2
          className="font-display mb-4 text-[1.1rem] font-semibold"
          style={{ color: "#C8A96E" }}
        >
          Horóscopo de {sign.name} para hoy, {fechaCap}
        </h2>
        <p className="mb-5 text-[15px] leading-[1.8]" style={{ color: "#D0CAE0" }}>
          {horoscopo.texto}
        </p>
        {horoscopo.aspectos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {horoscopo.aspectos.map((chip) => (
              <span
                key={chip}
                className="rounded-full px-3 py-1 text-[11px]"
                style={{
                  background: "rgba(200,169,110,0.1)",
                  color: "#C8A96E",
                  border: "1px solid rgba(200,169,110,0.2)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* CTA de registro */}
      <section
        className="mx-5 mb-8 rounded-[18px] p-6 text-center"
        style={{ background: "#1C1535", border: "1px solid #7B6FA040" }}
      >
        <p className="font-display mb-2 text-[1.1rem] font-bold" style={{ color: "#F0EDE8" }}>
          ✨ ¿Quieres tu horóscopo personalizado?
        </p>
        <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "#A898A8" }}>
          Calcula tu carta natal real y Astrid te guía cada día según tus planetas.
        </p>
        <Link
          href="/carta-natal"
          className="inline-block rounded-full px-6 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#7B6FA0", color: "#F0EDE8" }}
        >
          Calcular mi carta natal →
        </Link>
      </section>

      {/* Información del signo */}
      <section className="mx-5 mb-8">
        <h2 className="font-display mb-5 text-[1.3rem] font-bold" style={{ color: "#F0EDE8" }}>
          Sobre {sign.name}
        </h2>
        <div className="space-y-4">
          {info.descripcion.map((parrafo, i) => (
            <p key={i} className="text-[15px] leading-[1.8]" style={{ color: "#A898A8" }}>
              {parrafo}
            </p>
          ))}
        </div>

        <div
          className="mt-6 rounded-[14px] p-5"
          style={{ background: "#18102A", border: "1px solid #2A1F3D" }}
        >
          <h3 className="font-display mb-3 font-semibold" style={{ color: "#C8A96E" }}>
            Características de {sign.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {info.caracteristicas.map((c) => (
              <span
                key={c}
                className="rounded-full px-3 py-1 text-[12px]"
                style={{ background: "#201535", color: "#D0CAE0", border: "1px solid #2A1F3D" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div
          className="mt-3 rounded-[14px] p-5"
          style={{ background: "#18102A", border: "1px solid #2A1F3D" }}
        >
          <h3 className="font-display mb-3 font-semibold" style={{ color: "#C8A96E" }}>
            Mayor compatibilidad
          </h3>
          <div className="flex flex-wrap gap-2">
            {info.compatibilidades.map((c) => (
              <span
                key={c}
                className="rounded-full px-3 py-1 text-[12px]"
                style={{ background: "#201535", color: "#D0CAE0", border: "1px solid #2A1F3D" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Navegación entre signos */}
      <section className="mx-5 mb-8">
        <h3 className="font-display mb-4 text-[1rem] font-semibold" style={{ color: "#888880" }}>
          Otros signos
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {ZODIAC_SIGNS.map((s) => (
            <Link
              key={s.id}
              href={`/horoscopo/${s.id}`}
              className="flex flex-col items-center gap-1 rounded-[10px] p-3 transition-colors"
              style={
                s.id === signo
                  ? { background: "rgba(200,169,110,0.15)", border: "1px solid #C8A96E" }
                  : { background: "#18102A", border: "1px solid #2A1F3D" }
              }
            >
              <span className="text-xl">{s.symbol}</span>
              <span
                className="text-[9px]"
                style={{ color: s.id === signo ? "#C8A96E" : "#888880" }}
              >
                {s.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-5 py-6" style={{ borderColor: "#2A1F3D" }}>
        <p className="mb-2 text-center text-[11px]" style={{ color: "#888880" }}>
          © 2026 LongViva SpA
        </p>
        <div
          className="flex items-center justify-center gap-1 text-[11px]"
          style={{ color: "#888880" }}
        >
          <Link href="/terminos" className="px-2 hover:underline">
            Términos
          </Link>
          <span>·</span>
          <Link href="/privacidad" className="px-2 hover:underline">
            Privacidad
          </Link>
          <span>·</span>
          <Link href="/contacto" className="px-2 hover:underline">
            Contacto
          </Link>
        </div>
      </footer>
    </div>
  );
}
