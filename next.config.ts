import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OpenAI SDK の Node.js モジュール参照を解決
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
