import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/admin/templates/preview": [
      "./public/templates/**/*",
      "./lib/engine/templates/custom/**/*",
    ],
  },
};

export default nextConfig;
