import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/vehicle/decode-info/:vin', 
        destination: 'http://localhost:8080/vehicle/decode-info/:vin',
      },
      {
        source: '/api/user/auth/signin',
        destination: 'http://localhost:8080/user/auth/signin'
      },
      {
        source: '/api/user/auth/signup',
        destination: 'http://localhost:8080/user/auth/signup'
      },
    ];
  },
};

export default nextConfig;
