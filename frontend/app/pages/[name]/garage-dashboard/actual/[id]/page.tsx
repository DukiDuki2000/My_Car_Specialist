'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Typy
type StatusType = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

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
  userName: string; // Nazwa użytkownika/klienta
  description: string; // Opis zgłoszenia
  car?: string;        // Nazwa pojazdu (uzupełniane we frontendzie)
  userEmail?: string;  // Email klienta (uzupełniane we frontendzie)
}

// Pomocnicze typy
interface Vehicle {
  id: number;
  brand: string;
  model: string;
}

interface UserInfo {
  id: number;
  email: string;
}

/**  
 * Reprezentuje pojedynczy wpis w tabeli historii.  
 * W Twoim backendzie mamy pary: operations[i] oraz operationDates[i].  
 * My i tak łączymy typ + obiekt w jednego stringa w `handleAddAction`.  
 * Możemy zatem przechowywać to w polu `typUslugi`. 
 */
interface ActionHistory {
  id: number;
  typUslugi: string;  // Cały napis, np. "Wymiana Opon"
  data: string;       // Data z operationDates
}

export default function ServiceRequestDetail() {
  const router = useRouter();
  const params = useParams();

  // Parametry w URL: /pages/[name]/garage-dashboard/actual/[id]
  const name = params.name as string;
  const reportId = Number(params.id);

  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Aktualnie wybrane zlecenie
  const [request, setRequest] = useState<ServiceRequest | null>(null);

  // Zmapowana historia do tabeli
  const [history, setHistory] = useState<ActionHistory[]>([]);

  // Pola do formularza dodawania nowej operacji
  const [typUslugi, setTypUslugi] = useState('');
  const [obiektUslugi, setObiektUslugi] = useState('');

  // Stany do obsługi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selecty
  const typUslugiOptions = ['Wymiana', 'Naprawa', 'Diagnostyka', 'Kontrola', 'Inspekcja'];
  const obiektUslugiOptions = [
    'Silnika',
    'Hamulców',
    'Opon',
    'Elektroniki',
    'Skrzyni biegów',
    'Układu wydechowego',
  ];

  // 1. Sprawdzamy, czy jesteśmy w przeglądarce
  useEffect(() => {
    setIsClient(true);
    setUsername(localStorage.getItem('username'));
  }, []);

  // 2. Autoryzacja
  useEffect(() => {
    if (!isClient) return;

    const token = localStorage.getItem('accessToken');
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

  // 3. Pobieramy wszystkie zlecenia -> wyciągamy to o `id == reportId`
  useEffect(() => {
    if (!isClient) return;
    fetchAllServiceRequests();
  }, [isClient, reportId]);

  const fetchAllServiceRequests = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Brak tokena');

      const resp = await fetch('/api/report/garage/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        throw new Error(`Błąd pobierania zleceń. Status: ${resp.status}`);
      }

      const allData: ServiceRequest[] = await resp.json();

      // Zbieramy unikalne userId
      const uniqueUserIds = [...new Set(allData.map((r) => r.userId))];

      // Pobranie pojazdów
      const vehiclesMap = new Map<number, Vehicle[]>();
      const fetchVehiclesPromises = uniqueUserIds.map(async (userId) => {
        const vRes = await fetch(`/api/client/vehicle/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!vRes.ok) {
          console.warn(`Błąd pobierania pojazdów userId=${userId}`);
          vehiclesMap.set(userId, []);
          return;
        }
        const userVehicles: Vehicle[] = await vRes.json();
        vehiclesMap.set(userId, userVehicles);
      });

      // Pobranie e-maili
      const usersMap = new Map<number, UserInfo>();
      const fetchUserInfoPromises = uniqueUserIds.map(async (userId) => {
        const uRes = await fetch(`/api/client/user/info/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!uRes.ok) {
          console.warn(`Błąd pobierania userInfo userId=${userId}`);
          usersMap.set(userId, { id: userId, email: 'brak danych' });
          return;
        }
        const userInfo: UserInfo = await uRes.json();
        usersMap.set(userId, userInfo);
      });

      await Promise.all([...fetchVehiclesPromises, ...fetchUserInfoPromises]);

      // Łączenie
      const dataWithCarAndEmail = allData.map((req) => {
        const userVehicles = vehiclesMap.get(req.userId) || [];
        const foundVeh = userVehicles.find((v) => v.id === req.vehicleId);

        let carInfo = `vehicleId=${req.vehicleId}`;
        if (foundVeh) {
          carInfo = `${foundVeh.brand} ${foundVeh.model}`;
        }

        const userObj = usersMap.get(req.userId);
        const email = userObj ? userObj.email : 'brak e-maila';

        return {
          ...req,
          car: carInfo,
          userEmail: email,
        };
      });

      // Szukamy zlecenia
      const found = dataWithCarAndEmail.find((r) => r.id === reportId);
      if (!found) {
        throw new Error(`Nie znaleziono zlecenia o ID=${reportId}`);
      }

      setRequest(found);

      // Budujemy historię (jedna kolumna "typUslugi" + data)
      const newHistory: ActionHistory[] = found.operations.map((op, i) => ({
        id: i + 1,
        typUslugi: op, // Tutaj już jest cały string, np. "Wymiana Opon"
        data: found.operationDates[i]?.split('T')[0] || '',
      }));
      setHistory(newHistory);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd przy pobieraniu zleceń.');
    } finally {
      setLoading(false);
    }
  };

  /** Dodawanie nowej operacji w formie tablicy stringów. */
  const handleAddAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!typUslugi || !obiektUslugi) {
      setError('Wybierz typ i obiekt usługi!');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Brak tokena');
      return;
    }

    try {
      setLoading(true);

      // Łączymy np. "Wymiana Opon"
      const newOperation = `${typUslugi} ${obiektUslugi}`;
      const body = [newOperation]; // ["Wymiana Opon"]

      const res = await fetch(`/api/garage/report/operations/${reportId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`Błąd dodawania operacji. Status: ${res.status}`);
      }

      // Odśwież dane
      await fetchAllServiceRequests();

      // Reset pól
      setTypUslugi('');
      setObiektUslugi('');
      setSuccess('Operacja została dodana.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Błąd przy dodawaniu akcji.');
    } finally {
      setLoading(false);
    }
  };

  /** Zmiana statusu na COMPLETED */
  const handleCompleteRequest = async () => {
    if (!confirm('Czy na pewno chcesz zakończyć to zgłoszenie?')) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Brak tokena');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await fetch(`/api/garage/report/status/${reportId}?newStatus=COMPLETED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Błąd zmiany statusu. Status: ${res.status}`);
      }

      await fetchAllServiceRequests();
      setSuccess('Zgłoszenie zostało zakończone.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Błąd przy zakończaniu zgłoszenia.');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Powrót */}
      <Link href={`/pages/${name}/garage-dashboard/actual`} className="text-blue-500 hover:underline">
        &larr; Powrót
      </Link>
      <h1 className="text-3xl font-bold mb-6 mt-4">Szczegóły Zgłoszenia</h1>

      {/* Komunikaty */}
      {loading && <p>Ładowanie...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* Górny segment */}
      {request && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <p><strong>ID:</strong> {request.id}</p>
          <p><strong>Klient:</strong> {request.userName}</p>
          <p><strong>Email klienta:</strong> {request.userEmail}</p>
          <p><strong>Samochód:</strong> {request.car}</p>
          <p><strong>Opis zgłoszenia:</strong> {request.description}</p>

          {request.dateHistory[0] && (
            <p>
              <strong>Data zgłoszenia:</strong>{' '}
              {new Date(request.dateHistory[0]).toLocaleString()}
            </p>
          )}

          <p>
            <strong>Status:</strong>{' '}
            {request.status === 'NEW'
              ? 'Oczekuje'
              : request.status === 'IN_PROGRESS'
              ? 'W trakcie'
              : request.status === 'COMPLETED'
              ? 'Zakończone'
              : request.status}
          </p>
        </div>
      )}

      {/* Przycisk 'Zakończ' jeśli nie jest COMPLETED */}
      {request && request.status !== 'COMPLETED' && (
        <div className="mb-6">
          <button
            onClick={handleCompleteRequest}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Zakończ Zgłoszenie
          </button>
        </div>
      )}

      {/* Formularz nowej akcji, jeśli nie 'COMPLETED' */}
      {request && request.status !== 'COMPLETED' && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Dodaj Nową Akcję</h2>
          <form onSubmit={handleAddAction}>
            <div className="mb-4">
              <label className="block text-gray-700">Typ Usługi:</label>
              <select
                value={typUslugi}
                onChange={(e) => setTypUslugi(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">-- Wybierz Typ Usługi --</option>
                {typUslugiOptions.map((typ) => (
                  <option key={typ} value={typ}>
                    {typ}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Obiekt Usługi:</label>
              <select
                value={obiektUslugi}
                onChange={(e) => setObiektUslugi(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">-- Wybierz Obiekt Usługi --</option>
                {obiektUslugiOptions.map((obj) => (
                  <option key={obj} value={obj}>
                    {obj}
                  </option>
                ))}
              </select>
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

      {/* Tabela historii Działań (bez obiektu usługi) */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Historia Działań</h2>
        {history.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded mb-4 table-fixed">
            <thead>
              <tr>
                <th className="px-4 py-2 border w-24">Data</th>
                <th className="px-4 py-2 border w-64">Usługa</th>
              </tr>
            </thead>
            <tbody>
              {history.map((action) => (
                <tr key={action.id} className="text-center">
                  <td className="px-4 py-2 border">
                    {action.data ? new Date(action.data).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2 border">{action.typUslugi}</td>
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
