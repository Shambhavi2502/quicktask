import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cccswtsmweoserbblhau.supabase.co", // 👈 your Supabase project domain
        pathname: "/storage/v1/object/public/avatars/**", // 👈 allow only avatars bucket
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: isVercel, // ✅ ignore ESLint errors only on Vercel
  },
  typescript: {
    ignoreBuildErrors: isVercel, // ✅ ignore TS errors only on Vercel
  },
};

export default nextConfig;
