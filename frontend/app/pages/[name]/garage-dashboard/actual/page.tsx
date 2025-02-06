'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/** Typy statusu */
type StatusType = 'NEW' | 'IN_PROGRESS' | 'COMPLETED';

/** Struktura garazu */
interface Garage {
  id: number;
  nip: string;
  regon: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  ibans: string[];
  userId: number;
  userName: string;
}

/** Pojedyncze zgłoszenie (zlecenie) z /api/report/garage/reports */
interface ServiceRequest {
  id: number;
  dateHistory: string[];
  garage: Garage;
  status: StatusType;
  operations: string[];
  operationDates: string[];
  vehicleId: number;
  userId: number;
  userName: string;
  description: string;
  car?: string;        // np. "Opel Astra"
  userEmail?: string;  // tu wpiszemy mail dociągnięty z nowego API
}

/** Przykładowy typ pojazdu zwracanego przez /api/client/vehicle/user/:userId */
interface Vehicle {
  id: number;
  brand: string;
  model: string;
}

/** Struktura odpowiedzi z nowego API:
/api/report/reports/:reportId => { report: ..., user: ... }
*/
interface SingleReportResponse {
  report: {
    id: number;
    // ... pomijam pozostałe pola, bo ich nie używamy tutaj
  };
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export default function GarageDashboardEdit() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Tutaj zapisujemy zgłoszenia pobrane z API
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  
  // Stany do obsługi ładowania i błędów
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Sprawdzamy, czy jesteśmy w środowisku przeglądarki
  useEffect(() => {
    setIsClient(true);
    setUsername(localStorage.getItem('username'));
  }, []);

  // 2. Autoryzacja i pobranie zleceń
  useEffect(() => {
    if (!isClient) return;

    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!token || !username || !role) {
      router.push('/pages/auth/login');
      return;
    }
    if (role !== 'ROLE_GARAGE') {
      router.push('/pages/auth/login');
      return;
    }

    fetchServiceRequests(token);
  }, [router, isClient, username]);

  /**
   * Pobiera listę zleceń z /api/report/garage/reports,
   * a następnie dla każdego zlecenia:
   *  - pobiera markę i model pojazdu (z endpointu /api/client/vehicle/user/:userId)
   *  - pobiera email użytkownika z nowego API ( /api/report/reports/:reportId ).
   */
  const fetchServiceRequests = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      // 1) Pobieramy listę wszystkich zleceń (raportów) w warsztacie
      const response = await fetch('/api/report/garage/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Błąd pobierania zleceń. Status: ${response.status}`);
      }

      const data: ServiceRequest[] = await response.json();

      // 2) Zbierzmy unikalne userId, żeby hurtowo pobrać pojazdy
      const uniqueUserIds = Array.from(new Set(data.map((req) => req.userId)));

      // 3) Pobieramy pojazdy dla każdego userId i budujemy mapę userId -> Vehicle[]
      const vehiclesMap = new Map<number, Vehicle[]>();
      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const vRes = await fetch(`/api/client/vehicle/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (vRes.ok) {
              const userVehicles: Vehicle[] = await vRes.json();
              vehiclesMap.set(userId, userVehicles);
            } else {
              console.warn(`Błąd pobierania pojazdów dla userId=${userId}`);
              vehiclesMap.set(userId, []);
            }
          } catch (vehErr) {
            console.warn('Błąd fetchowania pojazdów:', vehErr);
            vehiclesMap.set(userId, []);
          }
        })
      );

      // 4) Dla każdego zlecenia (request) pobieramy email z nowego API
      //    (endpoint: /api/report/reports/:reportId => { user: { email } })
      const requestsWithData = await Promise.all(
        data.map(async (request) => {
          // a) Dociągnięcie marki i modelu pojazdu z naszej mapy
          const userVehicles = vehiclesMap.get(request.userId) || [];
          const foundVehicle = userVehicles.find((v) => v.id === request.vehicleId);
          let carInfo = 'Brak danych o pojeździe';
          if (foundVehicle) {
            carInfo = `${foundVehicle.brand} ${foundVehicle.model}`;
          }

          // b) Wywołanie nowego API dla konkretnego reportId, aby pobrać email
          let userEmail = 'brak e‑maila';
          try {
            const singleResp = await fetch(`/api/report/reports/${request.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (singleResp.ok) {
              const singleReportData: SingleReportResponse = await singleResp.json();
              userEmail = singleReportData.user.email;
            } else {
              console.warn(
                `Nie udało się pobrać szczegółów reportId=${request.id}. Status=${singleResp.status}`
              );
            }
          } catch (singleErr) {
            console.warn('Błąd fetchowania nowego API dla reportId=', request.id, singleErr);
          }

          // c) Składamy wniosek z nowymi polami
          return {
            ...request,
            car: carInfo,
            userEmail,
          };
        })
      );

      // 5) Ustawiamy w stanie
      setRequests(requestsWithData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd podczas pobierania zleceń.');
    } finally {
      setLoading(false);
    }
  };

  /** Handler: kliknięcie w "Edytuj" -> przejście do widoku szczegółów */
  const handleEdit = (requestId: number) => {
    if (!username) return;
    router.push(`/pages/${username}/garage-dashboard/actual/${requestId}`);
  };

  // Jeżeli jeszcze nie jesteśmy po stronie klienta, nic nie wyświetlamy
  if (!isClient) {
    return null; 
  }

  // Tutaj (przykładowo) pokazujemy tylko te, które są w trakcie (IN_PROGRESS).
  // Możesz to zmienić wedle potrzeb (np. .filter(...) == 'NEW').
  const inProgressRequests = requests.filter((req) => req.status === 'IN_PROGRESS');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Aktualne zlecenia</h1>

      {loading && <p className="text-blue-500">Ładowanie zgłoszeń...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded mb-4 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Klient</th>
              <th className="px-4 py-2 border">E-mail klienta</th>
              <th className="px-4 py-2 border">Samochód</th>
              <th className="px-4 py-2 border">Zgłoszona usługa</th>
              <th className="px-4 py-2 border">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {inProgressRequests.length > 0 ? (
              inProgressRequests.map((request) => (
                <tr key={request.id} className="text-center">
                  <td className="px-4 py-2 border">{request.id}</td>
                  <td className="px-4 py-2 border">{request.userName}</td>
                  <td className="px-4 py-2 border">
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                      {request.userEmail}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{request.car}</td>
                  <td className="px-4 py-2 border">{request.description}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEdit(request.id)}
                    >
                      Edytuj
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-2 border text-center text-sm text-gray-500"
                >
                  Brak zleceń w trakcie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
