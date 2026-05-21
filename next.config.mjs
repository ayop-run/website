import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/strava",
        destination: "https://www.strava.com/clubs/1235607",
        permanent: true,
      },
      {
        source: "/after-sunset-run-1",
        destination:
          "https://www.eventbrite.co.uk/e/ramadanmiles-community-sunset-experience-tickets-1982296810121",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
