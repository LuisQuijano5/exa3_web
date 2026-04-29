import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/tecnm-api/:path*',
        destination: 'https://sii.celaya.tecnm.mx/:path*',
      },
    ];
  },
};

export default nextConfig;