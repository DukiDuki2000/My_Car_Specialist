'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StatusType = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

interface ServiceRequest {
  id: number;
  clientName: string;
  email: string;
  phoneNumber: string;
  car: string;
  serviceDescription: string;
  status: StatusType;
  // Dodatkowe pola (jeśli istnieją w API)
  // city?: string;
  // createdAt?: string;
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

  // Sprawdzanie autoryzacji i pobranie danych
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

  // Funkcja do pobierania wszystkich zgłoszeń
  const fetchServiceRequests = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/report/garage/reports', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd pobierania zleceń. Status: ${response.status}`);
      }

      const data: ServiceRequest[] = await response.json();
      setRequests(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd podczas pobierania zleceń.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Zmiana statusu zlecenia (np. z NEW -> IN_PROGRESS lub NEW -> REJECTED).
   */
  const changeReportStatus = async (reportId: number, newStatus: StatusType) => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Brak tokena uwierzytelniającego.');
      }

      const response = await fetch(`/api/garage/report/status/${reportId}?newStatus=${newStatus}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  // Obsługa odrzucenia zlecenia (z NEW -> REJECTED)
  const handleReject = (id: number) => {
    changeReportStatus(id, 'REJECTED');
  };

  if (!isClient) {
    // Jeśli jeszcze nie jesteśmy po stronie klienta, nie renderujemy nic
    return null;
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
              <th className="px-4 py-2 border">Email Klienta</th>
              <th className="px-4 py-2 border">Numer Telefonu</th>
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
                  <td className="px-4 py-2 border">{request.clientName}</td>
                  <td className="px-4 py-2 border">
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                      {request.email}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{request.phoneNumber}</td>
                  <td className="px-4 py-2 border">{request.car}</td>
                  <td className="px-4 py-2 border">{request.serviceDescription}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleAccept(request.id)}
                      >
                        Akceptuj
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleReject(request.id)}
                      >
                        Odrzuć
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-2 border text-center text-sm text-gray-500">
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
