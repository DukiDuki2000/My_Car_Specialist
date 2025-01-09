import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Dekodowanie VIN
      {
        source: '/api/vehicle/decode-info/:vin', 
        destination: 'http://MCS_API_Gateway:8080/vehicle/decode-info/:vin',
      },
      // Logowanie
      {
        source: '/api/user/auth/signin',
        destination: 'http://MCS_API_Gateway:8080/user/auth/signin'
      },
      // Rejestrowanie
      {
        source: '/api/user/auth/signup',
        destination: 'http://MCS_API_Gateway:8080/user/auth/signup'
      },
      // Informacje z NIP
      {
        source: '/api/nip-garage/:nip',
        destination: 'http://MCS_API_Gateway:8080/garage/openApi/:nip'
      },
      // Dodawanie auta do klienta
      {
        source: '/api/vehicle/add',
        destination: 'http://MCS_API_Gateway:8080/vehicle/add'
      },
      // Wypisywanie wszystkich aut użytkownika
      {
        source: '/api/vehicle/search',
        destination: 'http://MCS_API_Gateway:8080/vehicle/search'
      },
      // Wyszukiwanie auta po VIN dla moderatora
      {
        source: '/api/vehicle/searchByVin/:vin',
        destination: 'http://MCS_API_Gateway:8080/vehicle/searchByVin/:vin'
      },
      // Wyszukiwanie auta po tablicy rejestracyjnej dla moderatora
      {
        source: '/api/vehicle/searchByReg/:reg',
        destination: 'http://MCS_API_Gateway:8080/vehicle/searchByReg/:reg'
      },
      // Dodawanie warsztatu przez moderatora
      {
        source: '/api/mod/garage-add',
        destination: 'http://MCS_API_Gateway:8080/garage/add'
      },
      // Składanie prośby o zarejestrowanie warsztatu
      {
        source: '/api/garage-request',
        destination: 'http://MCS_API_Gateway:8080/garage/openApi/add_request'
      },
      // Wyświetlanie wszystkich prośb o rejestrację przez moderatora
      {
        source: '/api/mod/garage/requests',
        destination: "http://MCS_API_Gateway:8080/garage/request/all"
      },
      // 
      {
        source: '/api/mod/garage/request/:nip',
        destination: 'http://MCS_API_Gateway:8080/garage/request/:nip'
      },
      // Odświeżanie accessTokenu
      {
        source: '/api/user/auth/refresh',
        destination: 'http://MCS_API_Gateway:8080/user/auth/refresh'
      },
      // Tworzenie zgłoszenia przez klienta
      {
        source: '/api/client/create-report',
        destination: 'http://MCS_API_Gateway:8080/report/create'
      },
      // Zmiana statusu zlecenia przez warsztat
      {
        source: '/api/garage/report/status/:reportId?newStatus=:status',
        destination: 'http://MCS_API_Gateway:8080/report/status/:reportId?newStatus=:status'
      },
      // Dodanie czynności do zlecenia przez warsztat
      {
        source: '/api/garage/report/operations/:reportId',
        destination: 'http://MCS_API_Gateway:8080/report/operations/:reportId'
      },
      // Wyświetlenie zleceń u użytkownika z odpowiednim statusem 
      {
        source: '/api/client/report/all/:status',
        destination: 'http://MCS_API_Gateway:8080/report/all/:status'
      },
      // Wszystkie zlecenia warsztatu
      {
        source: '/api/report/garage/reports',
        destination: 'http://MCS_API_Gateway:8080/report/garage/reports'
      },
      // Zlecenia związane z pojazdem
      {
        source: '/api/report/vehicle/:vehicleId',
        destination: 'http://MCS_API_Gateway:8080/report/vehicle/:vehicleId'
      },
      // Wszystkie warsztaty
      {
        source: '/api/garage/all',
        destination: 'http://MCS_API_Gateway:8080/garage/all'
      },
      // Zwraca listę pojazdów użytkownika
      {
        source: '/api/client/vehicle/user/:userId',
        destination: 'http://MCS_API_Gateway:8080/vehicle/user/:userId'
      },
      // Zwraca dane klienta (id, email, username)
      {
        source: '/api/client/user/info/:userId',
        destination: 'http://MCS_API_Gateway:8080/user/info/:userId'
      }
    ];
  },
};

export default nextConfig;
