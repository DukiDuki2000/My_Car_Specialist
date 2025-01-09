'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StatusType = 'NEW' | 'IN_PROGRESS' | 'COMPLETED';

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
  // Pole, w którym trzymamy dane o wybranym pojeździe
  car?: string;
  // Pole, w którym trzymamy e-mail użytkownika
  userEmail?: string;
}

// Przykładowy typ pojazdu, dostosuj do tego co naprawdę zwraca API
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  // ...inne pola, np. year, vin itd.
}

// Przykładowy typ info o użytkowniku, dostosuj do tego co naprawdę zwraca API
interface UserInfo {
  id: number;
  email: string;
  // ...inne pola np. firstName, lastName itp.
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
   * Pobiera wszystkie zgłoszenia (raporty) i do każdego dociąga:
   * 1) informacje o pojeździe (car)
   * 2) informacje o użytkowniku (email)
   *  - wszystko tak, aby dla każdego userId wykonać TYLKO JEDNO zapytanie.
   */
  const fetchServiceRequests = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/report/garage/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Błąd pobierania zleceń. Status: ${response.status}`);
      }

      const data: ServiceRequest[] = await response.json();
      const uniqueUserIds = [...new Set(data.map((req) => req.userId))];

      // -- 1. Pobieramy pojazdy dla każdego userId (mapa userId -> Vehicle[])
      const vehiclesMap = new Map<number, Vehicle[]>();

      const fetchVehiclesPromises = uniqueUserIds.map(async (userId) => {
        const res = await fetch(`/api/client/vehicle/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.warn(`Błąd pobierania pojazdów dla userId = ${userId}`);
          vehiclesMap.set(userId, []);
          return;
        }

        const userVehicles: Vehicle[] = await res.json();
        vehiclesMap.set(userId, userVehicles);
      });

      // -- 2. Pobieramy dane użytkownika (np. email) – mapa userId -> UserInfo
      const usersMap = new Map<number, UserInfo>();

      const fetchUserInfoPromises = uniqueUserIds.map(async (userId) => {
        const res = await fetch(`/api/client/user/info/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.warn(`Błąd pobierania info o użytkowniku o ID: ${userId}`);
          // Możesz wstawić do mapy jakiś placeholder lub pusty obiekt
          usersMap.set(userId, { id: userId, email: 'brak danych' });
          return;
        }

        const userInfo: UserInfo = await res.json();
        usersMap.set(userId, userInfo);
      });

      // -- 3. Uruchamiamy wszystkie obietnice równolegle
      await Promise.all([...fetchVehiclesPromises, ...fetchUserInfoPromises]);

      // -- 4. Łączymy wyniki: 
      //      dla każdego requesta szukamy w vehiclesMap i usersMap
      const requestsWithCarAndEmail = data.map((request) => {
        // Pojazdy
        const userVehicles = vehiclesMap.get(request.userId) || [];
        const foundVehicle = userVehicles.find((v) => v.id === request.vehicleId);

        let carInfo = 'Nie znaleziono pojazdu';
        if (foundVehicle) {
          carInfo = `${foundVehicle.brand} ${foundVehicle.model}`;
        }

        // Użytkownik (email)
        const foundUser = usersMap.get(request.userId);
        const userEmail = foundUser ? foundUser.email : 'brak e-maila';

        return {
          ...request,
          car: carInfo,
          userEmail: userEmail,
        };
      });

      // -- 5. Zapisujemy w stanie
      setRequests(requestsWithCarAndEmail);
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

      // Po udanej zmianie statusu pobieramy na nowo listę zleceń
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
                      {request.userEmail}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{request.car}</td>
                  <td className="px-4 py-2 border">{request.description}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleAccept(request.id)}
                      >
                        Akceptuj
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Odrzuć
                      </button>
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
