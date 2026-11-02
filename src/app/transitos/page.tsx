import type { Metadata } from "next";
import { TransitosPageClient } from "@/components/transitos/TransitosPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const mes = new Date().toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
    timeZone: "America/Santiago",
  });
  const mesCapitalized = mes.charAt(0).toUpperCase() + mes.slice(1);

  return {
    title: {
      absolute: `Tránsitos planetarios de ${mesCapitalized} — AstroLife`,
    },
    description:
      "Dónde están hoy el Sol y los planetas y qué significa cada tránsito. Con tu carta natal, ves los que te afectan a ti.",
    alternates: {
      canonical: "/transitos",
    },
    openGraph: {
      title: `Tránsitos planetarios de ${mesCapitalized} — AstroLife`,
      description:
        "Dónde están hoy el Sol y los planetas y qué significa cada tránsito. Con tu carta natal, ves los que te afectan a ti.",
      url: "https://astrolife.cl/transitos",
      siteName: "AstroLife",
      locale: "es_CL",
      type: "website",
    },
  };
}

export default function TransitosPage() {
  return <TransitosPageClient />;
}
