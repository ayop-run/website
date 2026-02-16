/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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

module.exports = nextConfig;
