import type { MetadataRoute } from "next";
import { ZODIAC_SIGNS } from "@/lib/zodiac";

export const revalidate = 86400;

const SITE = "https://astrolife.cl";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().slice(0, 10);

  return [
    {
      url: SITE,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE}/carta-natal`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE}/transitos`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...ZODIAC_SIGNS.map((s) => ({
      url: `${SITE}/horoscopo/${s.id}`,
      lastModified: today,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE}/terminos`,
      lastModified: "2026-10-01",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${SITE}/privacidad`,
      lastModified: "2026-10-01",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${SITE}/contacto`,
      lastModified: "2026-10-01",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];
}
