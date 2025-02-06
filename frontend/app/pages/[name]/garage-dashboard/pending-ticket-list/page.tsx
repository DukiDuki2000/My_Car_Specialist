'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StatusType = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/** Struktura "garage" */
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

/** 
 * Struktura Twojego pojedynczego zlecenia (raportu).
 * Dodajemy opcjonalne pola `car?` i `userEmail?`
 */
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
  car?: string;
  userEmail?: string;   // <-- Tutaj będziemy dopisywać e‑mail pobrany z nowego API
}

/** Struktura pojazdu */
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  // ...inne pola, np. year, vin
}

/** Struktura "user" z nowego API (SingleReportResponse.user) */
interface SingleUser {
  id: number;
  username: string;
  email: string;
}

/** Struktura "report" z nowego API (SingleReportResponse.report) */
interface SingleReport {
  id: number;
  // ...inne pola, np. dateHistory, status, operations...
  userId: number;
  userName: string;
}

/** Struktura odpowiedzi z nowego API */
interface SingleReportResponse {
  report: SingleReport;
  user: SingleUser;
}

export default function GarageDashboard() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Tutaj zapisujemy zgłoszenia pobrane z API
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  
  // Stany do obsługi ładowania i błędów
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sprawdzamy, czy jesteśmy już po stronie klienta
  useEffect(() => {
    setIsClient(true);
    setUsername(localStorage.getItem('username'));
  }, []);

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
   * Pobiera wszystkie zgłoszenia (raporty) i:
   * 1) Dla każdego zlecenia pobiera e-mail użytkownika z nowego API `/api/report/reports/:reportId`
   * 2) Pobiera pojazdy dla userId, aby wypełnić pole `car`.
   */
  const fetchServiceRequests = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      // 1. Pobranie listy zleceń (raportów)
      const response = await fetch('/api/report/garage/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Błąd pobierania zleceń. Status: ${response.status}`);
      }

      const data: ServiceRequest[] = await response.json();

      // 2. Dla każdego zlecenia pobieramy maila z nowego API
      //    oraz pobieramy pojazdy z /api/client/vehicle/user/{userId}.
      const requestsWithEmailAndCar = await Promise.all(
        data.map(async (request) => {
          try {
            // ---- Pobranie maila z nowego API: /api/report/reports/{reportId}
            const singleRes = await fetch(`/api/report/reports/${request.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (singleRes.ok) {
              const singleData: SingleReportResponse = await singleRes.json();
              // Ustawiamy e‑mail
              request.userEmail = singleData.user.email;
            } else {
              console.warn(
                `Nie udało się pobrać e-maila dla reportId=${request.id}. Status: ${singleRes.status}`
              );
            }

            // ---- Pobranie pojazdów (brand, model) użytkownika
            const vehicleRes = await fetch(`/api/client/vehicle/user/${request.userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (vehicleRes.ok) {
              const userVehicles: Vehicle[] = await vehicleRes.json();
              // Znajdujemy pojazd pasujący do request.vehicleId
              const foundVehicle = userVehicles.find((v) => v.id === request.vehicleId);
              if (foundVehicle) {
                request.car = `${foundVehicle.brand} ${foundVehicle.model}`;
              } else {
                request.car = 'Nieznany pojazd';
              }
            } else {
              console.warn(
                `Błąd pobierania pojazdów dla userId=${request.userId}. Status: ${vehicleRes.status}`
              );
              request.car = 'Nie udało się pobrać pojazdu';
            }
          } catch (innerErr) {
            console.error('Błąd przy dociąganiu maila/pojazdów:', innerErr);
          }

          return request;
        })
      );

      // 3. Zapisujemy w stanie
      setRequests(requestsWithEmailAndCar);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd podczas pobierania zleceń.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Zmiana statusu zlecenia (np. z NEW -> IN_PROGRESS).
   */
  const changeReportStatus = async (reportId: number, newStatus: StatusType) => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Brak tokena uwierzytelniającego.');
      }

      const response = await fetch(
        `/api/garage/report/status/${reportId}?newStatus=${newStatus}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd zmiany statusu. Status: ${response.status}`);
      }

      // Po udanej zmianie statusu ponownie pobierz listę zleceń (zaktualizuje się widok)
      await fetchServiceRequests(token);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd podczas zmiany statusu.');
    } finally {
      setLoading(false);
    }
  };

  // Obsługa zaakceptowania zlecenia (z NEW -> IN_PROGRESS)
  const handleAccept = (id: number) => {
    changeReportStatus(id, 'IN_PROGRESS');
  };

  // Obsługa odrzucenia (z NEW -> CANCELLED)
  const handleCancel = (id: number) => {
    changeReportStatus(id, 'CANCELLED');
  };

  if (!isClient) {
    return null; // Jeszcze nie jesteśmy po stronie klienta
  }

  // Filtrujemy tylko te zgłoszenia, które mają status NEW
  const newRequests = requests.filter((req) => req.status === 'NEW');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Zarządzanie Zgłoszeniami</h1>

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
            {newRequests.length > 0 ? (
              newRequests.map((request) => (
                <tr key={request.id} className="text-center">
                  <td className="px-4 py-2 border">{request.id}</td>
                  <td className="px-4 py-2 border">{request.userName}</td>
                  <td className="px-4 py-2 border">
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                      {request.userEmail || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{request.car || '—'}</td>
                  <td className="px-4 py-2 border">{request.description}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleAccept(request.id)}
                      >
                        Akceptuj
                      </button>
                      {/* <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleCancel(request.id)}
                      >
                        Odrzuć
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-2 border text-center text-sm text-gray-500"
                >
                  Brak nowych zgłoszeń do wyświetlenia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
