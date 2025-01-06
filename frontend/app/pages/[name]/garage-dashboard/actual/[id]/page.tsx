'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed'; // Dodany status 'Completed'
  createdAt: string;
}

interface ActionHistory {
  id: number;
  zgloszenie_id: number;
  typUslugi: string;      // Nowe pole
  obiektUslugi: string;   // Nowe pole
  cenaUslugi: number;     // Nowe pole
  data: string;
}

export default function ServiceRequestDetail() {
  const router = useRouter();
  const params = useParams();
  const name = params.name as string;
  const requestId = Number(params.id);

  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [history, setHistory] = useState<ActionHistory[]>([]);
  const [typUslugi, setTypUslugi] = useState<string>('');        // Nowe pole
  const [obiektUslugi, setObiektUslugi] = useState<string>('');  // Nowe pole
  const [cenaUslugi, setCenaUslugi] = useState<number>(0);       // Nowe pole
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Opcje dla rozwijanych list
  const typUslugiOptions = ['Wymiana', 'Naprawa', 'Diagnostyka', 'Kontrola', 'Inspekcja'];
  const obiektUslugiOptions = ['Silnik', 'Hamulce', 'Opony', 'Elektronika', 'Skrzynia biegów', 'Układ wydechowy'];

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
        typUslugi: 'Wymiana',
        obiektUslugi: 'Silnik',
        cenaUslugi: 500,
        data: '2025-01-02',
      },
      {
        id: 2,
        zgloszenie_id: requestId,
        typUslugi: 'Naprawa',
        obiektUslugi: 'Hamulce',
        cenaUslugi: 300,
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

    if (!typUslugi || !obiektUslugi || cenaUslugi <= 0) {
      setError('Proszę wypełnić wszystkie pola poprawnie.');
      return;
    }

    // Automatyczna data - bieżąca data
    const currentDate = new Date().toISOString().split('T')[0];

    // Dodawanie nowej akcji do historii (bez API)
    const newAction: ActionHistory = {
      id: history.length + 1, // Prosty sposób na generowanie ID
      zgloszenie_id: requestId,
      typUslugi,
      obiektUslugi,
      cenaUslugi,
      data: currentDate,
    };

    setHistory(prev => [newAction, ...prev]);
    setTypUslugi('');
    setObiektUslugi('');
    setCenaUslugi(0);
    setSuccess('Nowa akcja została dodana pomyślnie.');
    setError('');
  };

  // Obsługa zakończenia zgłoszenia
  const handleCompleteRequest = () => {
    // Potwierdzenie działania przez użytkownika
    if (!confirm('Czy na pewno chcesz zakończyć to zgłoszenie?')) {
      return;
    }

    // Aktualizacja statusu zgłoszenia
    setRequest(prev => prev ? { ...prev, status: 'Completed' } : prev);
    setSuccess('Zgłoszenie zostało zakończone.');
    setError('');
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
          <p><strong>Status:</strong> {request.status === 'Pending' ? 'Oczekuje' : request.status === 'Accepted' ? 'Przyjęte' : request.status === 'Rejected' ? 'Odrzucone' : 'Zakończone'}</p>
          <p><strong>Data Zgłoszenia:</strong> {new Date(request.createdAt).toLocaleString()}</p>
        </div>
      )}

      {/* Przycisk do zakończenia zgłoszenia */}
      {request && request.status !== 'Completed' && (
        <div className="mb-6">
          <button
            onClick={handleCompleteRequest}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Zakończ Zgłoszenie
          </button>
        </div>
      )}

      {/* Formularz dodawania nowej akcji */}
      {request && request.status !== 'Completed' && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Dodaj Nową Akcję</h2>
          <form onSubmit={handleAddAction}>
            {/* Typ usługi */}
            <div className="mb-4">
              <label htmlFor="typUslugi" className="block text-gray-700">Typ Usługi:</label>
              <select
                id="typUslugi"
                value={typUslugi}
                onChange={(e) => setTypUslugi(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">-- Wybierz Typ Usługi --</option>
                {typUslugiOptions.map((typ) => (
                  <option key={typ} value={typ}>{typ}</option>
                ))}
              </select>
            </div>

            {/* Obiekt usługi */}
            <div className="mb-4">
              <label htmlFor="obiektUslugi" className="block text-gray-700">Obiekt Usługi:</label>
              <select
                id="obiektUslugi"
                value={obiektUslugi}
                onChange={(e) => setObiektUslugi(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">-- Wybierz Obiekt Usługi --</option>
                {obiektUslugiOptions.map((obiekt) => (
                  <option key={obiekt} value={obiekt}>{obiekt}</option>
                ))}
              </select>
            </div>

            {/* Cena usługi */}
            <div className="mb-4">
              <label htmlFor="cenaUslugi" className="block text-gray-700">Cena Usługi (PLN):</label>
              <input
                type="number"
                id="cenaUslugi"
                value={cenaUslugi}
                onChange={(e) => setCenaUslugi(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Data - automatyczna */}
            <div className="mb-4 hidden"> {/* Ukrycie pola daty */}
              <label htmlFor="data" className="block text-gray-700">Data:</label>
              <input
                type="date"
                id="data"
                value={new Date().toISOString().split('T')[0]}
                readOnly
                className="w-full border rounded px-3 py-2"
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
      )}

      {/* Historia działań */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Historia Działań</h2>
        {history.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded mb-4 table-fixed">
            <thead>
              <tr>
                <th className="px-4 py-2 border w-24">Data</th>
                <th className="px-4 py-2 border w-32">Typ Usługi</th>
                <th className="px-4 py-2 border w-32">Obiekt Usługi</th>
                <th className="px-4 py-2 border w-24">Cena (PLN)</th>
              </tr>
            </thead>
            <tbody>
              {history.map(action => (
                <tr key={action.id} className="text-center">
                  <td className="px-4 py-2 border">{new Date(action.data).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{action.typUslugi}</td>
                  <td className="px-4 py-2 border">{action.obiektUslugi}</td>
                  <td className="px-4 py-2 border">{action.cenaUslugi.toFixed(2)}</td>
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
