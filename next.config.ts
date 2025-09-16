import type { NextConfig } from "next";

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
};

export default nextConfig;
