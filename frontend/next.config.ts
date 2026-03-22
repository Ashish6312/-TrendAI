import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "accelerometer=*, gyroscope=*, magnetometer=*, microphone=(), camera=()"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
