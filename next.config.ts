import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode
  reactStrictMode: true,

    // Configure allowed external image domains
  images: {
    domains: ['redeem.piikmall.com'], // ✅ add your API image host here
  },

  
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

