'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// Definicje interfejsów
interface ServiceRequest {
  id: number;
  clientName: string;
  email: string;
  phoneNumber: string;
  car: string;
  serviceDescription: string;
  city: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

interface ActionHistory {
  id: number;
  zgloszenie_id: number;
  opis: string;
  data: string;
}

export default function ServiceRequestDetail() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Pobieranie dynamicznych parametrów z URL
  const pathSegments = pathname.split('/');
  const name = pathSegments[1];
  const requestId = Number(pathSegments[5]); // Zakładając, że [id] jest na pozycji 5

  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [history, setHistory] = useState<ActionHistory[]>([]);
  const [opis, setOpis] = useState<string>('');
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  // Autoryzacja
  useEffect(() => {
    if (!isClient) return;

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !username || !role) {
      router.push('/auth/login');
      return;
    }

    if (role !== 'ROLE_GARAGE') {
      router.push('/auth/login');
      return;
    }
  }, [router, isClient, username]);

  // Używanie danych przykładowych zamiast API
  useEffect(() => {
    if (!isClient) return;

    // Przykładowe dane zgłoszenia
    const sampleRequest: ServiceRequest = {
      id: requestId,
      clientName: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      phoneNumber: '+48 123 456 789',
      car: 'BMW 3 Series – XYZ 12345',
      serviceDescription: 'Wymiana oleju i filtrów',
      city: 'Warszawa',
      status: 'Pending',
      createdAt: '2025-01-01T10:00:00Z',
    };

    // Przykładowa historia działań
    const sampleHistory: ActionHistory[] = [
      {
        id: 1,
        zgloszenie_id: requestId,
        opis: 'Przeprowadzono wstępną diagnostykę.',
        data: '2025-01-02',
      },
      {
        id: 2,
        zgloszenie_id: requestId,
        opis: 'Wymieniono olej silnikowy.',
        data: '2025-01-03',
      },
    ];

    // Ustawienie stanu z przykładowymi danymi
    setRequest(sampleRequest);
    setHistory(sampleHistory);
  }, [isClient, requestId]);

  // Obsługa dodawania nowej akcji
  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();

    if (!opis || !data) {
      setError('Proszę wypełnić wszystkie pola.');
      return;
    }

    // Dodawanie nowej akcji do historii (bez API)
    const newAction: ActionHistory = {
      id: history.length + 1, // Prosty sposób na generowanie ID
      zgloszenie_id: requestId,
      opis,
      data,
    };

    setHistory(prev => [newAction, ...prev]);
    setOpis('');
    setData('');
    setSuccess('Nowa akcja została dodana pomyślnie.');
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Link href={`/${name}/garage-dashboard`} className="text-blue-500 hover:underline">
        &larr; Powrót do Dashboardu
      </Link>
      <h1 className="text-3xl font-bold mb-6 mt-4">Szczegóły Zgłoszenia</h1>

      {/* Wyświetlanie stanu ładowania i błędów */}
      {loading && <p>Ładowanie...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {request && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <p><strong>ID:</strong> {request.id}</p>
          <p><strong>Klient:</strong> {request.clientName}</p>
          <p><strong>Email:</strong> {request.email}</p>
          <p><strong>Numer Telefonu:</strong> {request.phoneNumber}</p>
          <p><strong>Samochód:</strong> {request.car}</p>
          <p><strong>Opis Usługi:</strong> {request.serviceDescription}</p>
          <p><strong>Miejscowość:</strong> {request.city}</p>
          <p><strong>Status:</strong> {request.status === 'Pending' ? 'Oczekuje' : request.status === 'Accepted' ? 'Przyjęte' : 'Odrzucone'}</p>
          <p><strong>Data Zgłoszenia:</strong> {new Date(request.createdAt).toLocaleString()}</p>
        </div>
      )}

      {/* Formularz dodawania nowej akcji */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Dodaj Nową Akcję</h2>
        <form onSubmit={handleAddAction}>
          <div className="mb-4">
            <label htmlFor="opis" className="block text-gray-700">Opis:</label>
            <textarea
              id="opis"
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="data" className="block text-gray-700">Data:</label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Dodaj
          </button>
        </form>
      </div>

      {/* Historia działań */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Historia Działań</h2>
        {history.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded mb-4 table-fixed">
            <thead>
              <tr>
                <th className="px-4 py-2 border w-32">Data</th>
                <th className="px-4 py-2 border">Opis</th>
              </tr>
            </thead>
            <tbody>
              {history.map(action => (
                <tr key={action.id} className="text-center">
                  <td className="px-4 py-2 border">{new Date(action.data).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{action.opis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Brak działań do wyświetlenia.</p>
        )}
      </div>
    </div>
  );
}
