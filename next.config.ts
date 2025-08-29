import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: ["app-build-manifest.json"],
  fallbacks: {
    document: '/offline.html'
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    },
    {
      urlPattern: /\/api\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 6 // 6 hours
        },
        networkTimeoutSeconds: 3
      }
    }
  ]
});

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
