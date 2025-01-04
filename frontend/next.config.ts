import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/vehicle/decode-info/:vin', // Nowa ścieżka, którą będzie używać frontend
        destination: 'http://localhost:8083/vehicle/decode-info/:vin', // Oryginalny adres API
      },
      {
        source: '/api/user/auth/signin',
        destination: 'http://localhost:8081/user/auth/signin'
      },
      {
        source: '/api/user/auth/signup',
        destination: 'http://localhost:8081/user/auth/signup'
      },
    ];
  },
};

export default nextConfig;
