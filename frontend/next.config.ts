import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/vehicle/decode-info/:vin', 
        destination: 'http://MCS_API_Gateway:8080/vehicle/decode-info/:vin',
      },
      {
        source: '/api/user/auth/signin',
        destination: 'http://MCS_API_Gateway:8080/user/auth/signin'
      },
      {
        source: '/api/user/auth/signup',
        destination: 'http://MCS_API_Gateway:8080/user/auth/signup'
      },
      {
        source: '/api/nip-garage/:nip',
        destination: 'http://MCS_API_Gateway:8080/garage/openApi/:nip'
      }
    ];
  },
};

export default nextConfig;
