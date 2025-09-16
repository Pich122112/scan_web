import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode
  reactStrictMode: true,

  // Optional: custom headers for fonts
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

