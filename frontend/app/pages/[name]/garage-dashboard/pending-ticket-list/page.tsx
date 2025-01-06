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
  city: string;
  status: 'Pending' | 'Accepted' | 'Rejected'; // Zachowany status dla logiki
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

    const token = localStorage.getItem('token');
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
      city: 'Warszawa',
      status: 'Pending',
      createdAt: '2025-01-01T10:00:00Z',
    },
    {
      id: 2,
      clientName: 'Anna Nowak',
      email: 'anna.nowak@example.com',
      phoneNumber: '+48 987 654 321',
      car: 'Audi A4 ',
      serviceDescription: 'Naprawa hamulców',
      city: 'Kraków',
      status: 'Pending',
      createdAt: '2025-01-02T12:30:00Z',
    },
    {
      id: 3,
      clientName: 'Piotr Wiśniewski',
      email: 'piotr.wisniewski@example.com',
      phoneNumber: '+48 555 666 777',
      car: 'Toyota Corolla ',
      serviceDescription: 'Diagnostyka komputerowa',
      city: 'Warszawa',
      status: 'Pending',
      createdAt: '2025-01-03T09:15:00Z',
    },
    {
      id: 4,
      clientName: 'Maria Zielińska',
      email: 'maria.zielinska@example.com',
      phoneNumber: '+48 444 333 222',
      car: 'Honda Civic ',
      serviceDescription: 'Wymiana opon',
      city: 'Gdańsk',
      status: 'Pending',
      createdAt: '2025-01-04T14:45:00Z',
    },
    // Dodaj więcej przykładowych zgłoszeń według potrzeb
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Obsługa akceptacji zgłoszenia
  const handleAccept = (id: number) => {
    if (!username) {
      setError('Błąd: Nazwa użytkownika nie jest dostępna.');
      return;
    }

    // Aktualizacja statusu zgłoszenia na 'Accepted'
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === id ? { ...req, status: 'Accepted' } : req
      )
    );

    // Tu możesz dodać logikę do backendu w przyszłości
  };

  // Obsługa odrzucenia zgłoszenia
  const handleReject = (id: number) => {
    // Usuń zgłoszenie o podanym ID z listy
    setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
  };

  // Jeśli nie jesteśmy po stronie klienta, zwróć null
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Zarządzanie Zgłoszeniami</h1>

      {/* Wyświetlanie stanu ładowania i błędów */}
      {loading && <p>Ładowanie zgłoszeń...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tabela zgłoszeń */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded mb-4 table-auto">
          <thead>
            <tr>
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
            {requests.length > 0 ? (
              requests.map(request => (
                <tr key={request.id} className="text-center">
                  <td className="px-4 py-2 border">{request.id}</td>
                  <td className="px-4 py-2 border">{request.clientName}</td>
                  <td className="px-4 py-2 border">
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                      {request.email}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{request.phoneNumber}</td>
                  <td className="px-4 py-2 border">
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                      {request.car}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <span className="whitespace-normal break-words">
                      {request.serviceDescription}
                    </span>
                  </td>
                  <td className="px-4 py-2 border w-32">
                    <div className="flex justify-center items-center h-full">
                      {request.status === 'Pending' ? (
                        <div className="flex space-x-2">
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
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7} // Zmniejszono colSpan do 7, ponieważ mamy teraz 7 kolumn
                  className="px-4 py-2 border text-center text-sm text-gray-500"
                >
                  Brak zgłoszeń do wyświetlenia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Usunięta paginacja */}
    </div>
  );
}
