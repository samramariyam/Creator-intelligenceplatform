import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Enforce HTTPS for 1 year (set only in production)
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
            : []),
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // Next.js requires unsafe-inline for hydration
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://cdninstagram.com https://*.cdninstagram.com https://*.fbcdn.net",
              "font-src 'self'",
              "connect-src 'self' https://integrate.api.nvidia.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
