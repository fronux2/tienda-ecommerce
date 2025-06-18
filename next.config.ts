import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    viewTransition: true,
  },
  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname: "btjhgqekbffxzzvvaqsq.supabase.co",
      },
    ]
  }
};

export default nextConfig;
