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
      {
        source: '/api/nip-garage/:nip',
        destination: 'http://localhost:8080/garage/openApi/:nip'
      },
      {
        source: '/api/vehicle/add',
        destination: 'http://localhost:8080/vehicle/add'
      },
      {
        source: '/api/vehicle/search',
        destination: 'http://localhost:8080/vehicle/search'
      },
      {
        source: '/api/vehicle/searchByVin/:vin',
        destination: 'http://localhost:8080/vehicle/searchByVin/:vin'
      },
      {
        source: '/api/vehicle/searchByReg/:reg',
        destination: 'http://localhost:8080/vehicle/searchByReg/:reg'
      }
    ];
  },
};

export default nextConfig;
