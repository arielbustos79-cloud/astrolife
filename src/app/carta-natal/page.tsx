import type { Metadata } from "next";
import { CartaNatalPageClient } from "@/components/carta/CartaNatalPageClient";

export const metadata: Metadata = {
  title: {
    absolute: "Carta natal gratis con IA — calcula la tuya | AstroLife",
  },
  description:
    "Ingresa tu fecha, hora y lugar de nacimiento y obtén tu carta natal con planetas, casas y ascendente. Gratis y en español.",
  alternates: {
    canonical: "/carta-natal",
  },
  openGraph: {
    title: "Carta natal gratis con IA | AstroLife",
    description:
      "Ingresa tu fecha, hora y lugar de nacimiento y obtén tu carta natal con planetas, casas y ascendente. Gratis y en español.",
    url: "https://astrolife.cl/carta-natal",
    siteName: "AstroLife",
    locale: "es_CL",
    type: "website",
  },
};

export default function CartaNatalPage() {
  return <CartaNatalPageClient />;
}
