import type { MetadataRoute } from "next";

const SITE = "https://astrolife.cl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/"] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
