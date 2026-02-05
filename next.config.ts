import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "ai-sdk-provider-gemini-cli",
    "@google/gemini-cli-core",
    "@lydell/node-pty-win32-x64",
    "tree-sitter-bash",
    "web-tree-sitter",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;
