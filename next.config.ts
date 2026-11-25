import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.astrolife.cl" }],
        destination: "https://astrolife.cl/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
