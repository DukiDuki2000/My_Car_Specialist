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
  car?: string;        // nazwa/krótki opis pojazdu
  userEmail?: string;  // email użytkownika
}

// Przykładowy typ pojazdu
interface Vehicle {
  id: number;
  brand: string;
  model: string;
}

// Przykładowy typ informacji o użytkowniku
interface UserInfo {
  id: number;
  email: string;
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
   */
  const fetchServiceRequests = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      // Główne pobranie zleceń
      const response = await fetch('/api/report/garage/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Błąd pobierania zleceń. Status: ${response.status}`);
      }

      const data: ServiceRequest[] = await response.json();

      // Wyciągamy unikalne userId
      const uniqueUserIds = [...new Set(data.map((req) => req.userId))];

      // -- MAPA pojazdów (userId -> Vehicle[])
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

      // -- MAPA użytkowników (userId -> UserInfo)
      const usersMap = new Map<number, UserInfo>();
      const fetchUserInfoPromises = uniqueUserIds.map(async (userId) => {
        const res = await fetch(`/api/client/user/info/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.warn(`Błąd pobierania info o userId = ${userId}`);
          usersMap.set(userId, { id: userId, email: 'brak danych' });
          return;
        }
        const userInfo: UserInfo = await res.json();
        usersMap.set(userId, userInfo);
      });

      // Uruchamiamy wszystkie obietnice
      await Promise.all([...fetchVehiclesPromises, ...fetchUserInfoPromises]);

      // Składamy dane w jedną całość
      const requestsWithCarAndEmail = data.map((request) => {
        // Pojazd
        const userVehicles = vehiclesMap.get(request.userId) || [];
        const foundVehicle = userVehicles.find((v) => v.id === request.vehicleId);
        let carInfo = 'Nie znaleziono pojazdu';
        if (foundVehicle) {
          carInfo = `${foundVehicle.brand} ${foundVehicle.model}`;
        }

        // Użytkownik
        const foundUser = usersMap.get(request.userId);
        const userEmail = foundUser ? foundUser.email : 'brak e-maila';

        return {
          ...request,
          car: carInfo,
          userEmail: userEmail,
        };
      });

      setRequests(requestsWithCarAndEmail);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd podczas pobierania zleceń.');
    } finally {
      setLoading(false);
    }
  };

  // Nowa opcja: kliknięcie w "Edytuj" przenosi do innej ścieżki
  const handleEdit = (requestId: number) => {
    if (!username) return;  // Na wszelki wypadek
    router.push(`/pages/${username}/garage-dashboard/actual/${requestId}`);
  };

  if (!isClient) {
    return null; 
  }

  // Filtrujemy tylko te zgłoszenia, które mają status NEW (jeśli tak ma być)
  const newRequests = requests.filter((req) => req.status === 'IN_PROGRESS');

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
