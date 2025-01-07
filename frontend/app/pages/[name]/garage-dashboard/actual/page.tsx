'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Definicje interfejsów
interface ServiceRequest {
  id: number;
  clientName: string;
  email: string; // Nowe pole
  phoneNumber: string; // Nowe pole
  car: string;
  serviceDescription: string;
  createdAt: string;
}

export default function GarageDashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // Stan do sprawdzenia, czy działamy po stronie klienta
  const [username, setUsername] = useState<string | null>(null); // Dodany stan dla [name]

  // Ustawienie stanu isClient po zamontowaniu komponentu
  useEffect(() => {
    setIsClient(true);
    
    // Pobieranie username z localStorage
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  // Logika autoryzacji
  useEffect(() => {
    if (!isClient) return; // Zatrzymaj, jeśli nie jesteśmy po stronie klienta

    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!token || !username || !role) {
      // Jeśli brakuje tokena, username lub roli, przekierowanie na stronę logowania
      router.push('/pages/auth/login');
      return;
    }

    if (role !== 'ROLE_GARAGE') {
      // Przekierowanie, jeśli użytkownik nie jest garażem
      router.push('/pages/auth/login');
      return;
    }
  }, [router, isClient, username]);

  // Inicjalizacja stanu z initialRequests
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 1,
      clientName: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      phoneNumber: '+48 123 456 789',
      car: 'BMW 3 Series ',
      serviceDescription: 'Wymiana oleju i filtrów',
      createdAt: '2025-01-01T10:00:00Z',
    },
    {
      id: 2,
      clientName: 'Anna Nowak',
      email: 'anna.nowak@example.com',
      phoneNumber: '+48 987 654 321',
      car: 'Audi A4 ',
      serviceDescription: 'Naprawa hamulców',
      createdAt: '2025-01-02T12:30:00Z',
    },
    {
      id: 3,
      clientName: 'Piotr Wiśniewski',
      email: 'piotr.wisniewski@example.com',
      phoneNumber: '+48 555 666 777',
      car: 'Toyota Corolla ',
      serviceDescription: 'Diagnostyka komputerowa',
      createdAt: '2025-01-03T09:15:00Z',
    },
    {
      id: 4,
      clientName: 'Maria Zielińska',
      email: 'maria.zielinska@example.com',
      phoneNumber: '+48 444 333 222',
      car: 'Honda Civic ',
      serviceDescription: 'Wymiana opon',
      createdAt: '2025-01-04T14:45:00Z',
    },
    // Dodaj więcej przykładowych zgłoszeń według potrzeb
  ]);

  // Jeśli nie jesteśmy po stronie klienta, zwróć null
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Aktualne zgłoszenia</h1>

      {/* Tabela zgłoszeń */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded mb-4 table-fixed">
          <thead>
            <tr>
              <th className="px-4 py-2 border w-12">ID</th>
              <th className="px-4 py-2 border w-32">Klient</th>
              <th className="px-4 py-2 border w-48">Email Klienta</th>
              <th className="px-4 py-2 border w-40">Numer Telefonu</th>
              <th className="px-4 py-2 border w-40">Samochód</th>
              <th className="px-4 py-2 border w-56">Zgłoszona usługa</th>
              <th className="px-4 py-2 border w-32">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map(request => (
                <tr key={request.id} className="text-center">
                  <td className="px-4 py-2 border">{request.id}</td>
                  <td className="px-4 py-2 border">{request.clientName}</td>
                  <td className="px-4 py-2 border">{request.email}</td>
                  <td className="px-4 py-2 border">{request.phoneNumber}</td>
                  <td className="px-4 py-2 border">{request.car}</td>
                  <td className="px-4 py-2 border">{request.serviceDescription}</td>
                  <td className="px-4 py-2 border w-32">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => router.push(`/pages/${username}/garage-dashboard/actual/${request.id}`)}
                    >
                      Modyfikuj
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7} // Zmniejszono colSpan, ponieważ mamy teraz 7 kolumn
                  className="px-4 py-2 border text-center text-sm text-gray-500"
                >
                  Brak zgłoszeń do wyświetlenia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
