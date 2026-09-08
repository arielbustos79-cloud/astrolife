import type { MetadataRoute } from "next";

const SIGNOS = [
  "aries", "tauro", "geminis", "cancer", "leo", "virgo",
  "libra", "escorpio", "sagitario", "capricornio", "acuario", "piscis",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paginasPrincipales: MetadataRoute.Sitemap = [
    {
      url: "https://astrolife.cl",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://astrolife.cl/terminos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://astrolife.cl/privacidad",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://astrolife.cl/contacto",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const paginasSignos: MetadataRoute.Sitemap = SIGNOS.map((signo) => ({
    url: `https://astrolife.cl/horoscopo/${signo}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...paginasPrincipales, ...paginasSignos];
}
