import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "ik.imagekit.io",
  //       port: "",
  //     },
  //   ],
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Mark Firebase Admin SDK as server-only to prevent it from being bundled on the client
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // These Node.js modules should not be bundled on the client
      fs: false,
      path: false,
      crypto: false,
      os: false,
      http: false,
      https: false,
      zlib: false,
      stream: false,
      util: false,
      url: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
