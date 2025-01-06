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
      },
      {
        source: '/api/vehicle/add',
        destination: 'http://MCS_API_Gateway:8080/vehicle/add'
      },
      {
        source: '/api/vehicle/search',
        destination: 'http://MCS_API_Gateway:8080/vehicle/search'
      },
      {
        source: '/api/vehicle/searchByVin/:vin',
        destination: 'http://MCS_API_Gateway:8080/vehicle/searchByVin/:vin'
      },
      {
        source: '/api/vehicle/searchByReg/:reg',
        destination: 'http://MCS_API_Gateway:8080/vehicle/searchByReg/:reg'
      }
    ];
  },
};

export default nextConfig;
