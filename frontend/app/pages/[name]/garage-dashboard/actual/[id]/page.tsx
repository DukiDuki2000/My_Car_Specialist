'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// ***** NOWE INTERFEJSY ZGODNE Z STRUKTURĄ SingleReportResponse *****

/** Typ wyliczający możliwe statusy zgłoszenia */
export type StatusType = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/** Struktura adresu w obiekcie garage.address */
export interface Address {
  street: string;
  postalCode: string;
  city: string;
}

/** Struktura obiektu "garage" wewnątrz "report" */
export interface Garage {
  id: number;
  nip: string;
  regon: string;
  companyName: string;
  address: Address;
  phoneNumber: string;
  ibans: string[];
  userId: number;
  userName: string;
}

/** Struktura obiektu "report" */
export interface Report {
  id: number;
  dateHistory: string[];
  createdAt: string;
  garage: Garage;
  status: StatusType;
  operations: string[];
  operationDates: string[];
  vehicleId: number;
  userId: number;
  userName: string;
  description: string;
  amounts: number[];
}

/** Struktura obiektu "user" na głównym poziomie odpowiedzi */
export interface User {
  id: number;
  username: string;
  email: string;
}

/** Główny interfejs opisujący całą odpowiedź */
export interface SingleReportResponse {
  report: Report;
  user: User;
}

// ***** POZOSTAŁE INTERFEJSY / TYPY (np. do pojazdów, historii) *****

interface Vehicle {
  id: number;
  brand: string;
  model: string;
}

/** Rozszerzamy ActionHistory o pole amount, 
 * aby móc wyświetlić cenę operacji.
 */
interface ActionHistory {
  id: number;
  typUslugi: string;
  data: string;
  amount: number;
}

/** 
 * Dodatkowy interfejs, z którego korzystamy w `useState` (do wyświetlania).
 * Łączy dane z `report` oraz e‑mail klienta, + np. car do nazwy pojazdu.
 */
interface ServiceRequestDisplay {
  id: number;
  dateHistory: string[];
  status: StatusType;
  operations: string[];
  operationDates: string[];
  amounts: number[];
  userName: string;
  userEmail: string;
  description: string;
  car: string;
  // Możesz dodać inne pola, jeśli ich potrzebujesz
}

// ***** KOMPONENT *****
export default function ServiceRequestDetail() {
  const router = useRouter();
  const params = useParams();

  const name = params.name as string;
  const reportId = Number(params.id);

  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Obiekt z danymi do wyświetlania (zamiast starego "ServiceRequest")
  const [request, setRequest] = useState<ServiceRequestDisplay | null>(null);

  // Zmapowana historia do tabeli (operacje + daty + amounts)
  const [history, setHistory] = useState<ActionHistory[]>([]);

  // Pola do formularza dodawania nowej operacji
  const [typUslugi, setTypUslugi] = useState('');
  const [obiektUslugi, setObiektUslugi] = useState('');
  const [amount, setAmount] = useState('');

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

  // 3. Pobieramy dane zgłoszenia z nowego API
  useEffect(() => {
    if (!isClient) return;
    fetchSingleReport();
  }, [isClient, reportId]);

  const fetchSingleReport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Brak tokena');

      // Pobieramy pojedyncze zgłoszenie z nowego API
      const resp = await fetch(`/api/report/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        throw new Error(`Błąd pobierania zgłoszenia (ID=${reportId}). Status: ${resp.status}`);
      }

      // Otrzymujemy { report: Report, user: User }
      const singleData: SingleReportResponse = await resp.json();

      const { report, user } = singleData;

      // Pobieramy pojazdy tego userId, aby wyświetlić markę i model
      let carInfo = `vehicleId=${report.vehicleId}`;
      try {
        const vRes = await fetch(`/api/client/vehicle/user/${report.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (vRes.ok) {
          const vehicles: Vehicle[] = await vRes.json();
          const foundVeh = vehicles.find((v) => v.id === report.vehicleId);
          if (foundVeh) {
            carInfo = `${foundVeh.brand} ${foundVeh.model}`;
          }
        } else {
          console.warn(`Błąd pobierania pojazdów userId=${report.userId}`);
        }
      } catch (vehErr) {
        console.warn(vehErr);
      }

      // Tworzymy obiekt do wyświetlania na froncie
      const newRequest: ServiceRequestDisplay = {
        id: report.id,
        dateHistory: report.dateHistory,
        status: report.status,
        operations: report.operations,
        operationDates: report.operationDates,
        amounts: report.amounts,
        userName: report.userName,   // albo user.username - w Twoim API to samo
        userEmail: user.email,
        description: report.description,
        car: carInfo,
      };

      // Ustawiamy w stanie
      setRequest(newRequest);

      // Budujemy historię (operacje + amounts)
      const newHistory = report.operations.map((op, i) => ({
        id: i + 1,
        typUslugi: op,
        data: report.operationDates[i]?.split('T')[0] || '',
        amount: report.amounts[i] ?? 0,
      }));
      setHistory(newHistory);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd przy pobieraniu zgłoszenia.');
    } finally {
      setLoading(false);
    }
  };

  /** Dodawanie nowej operacji + (opcjonalnie) ceny. */
  const handleAddAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!typUslugi || !obiektUslugi) {
      setError('Wybierz typ i obiekt usługi!');
      return;
    }
    if (!amount) {
      setError('Podaj cenę usługi!');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Brak tokena');
      return;
    }

    try {
      setLoading(true);

      const newOperation = `${typUslugi} ${obiektUslugi}`;
      const body = {
        operations: [newOperation],
        amounts: [Number(amount)],
      };

      // Endpoint do dodawania operacji
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

      // Odświeżamy dane
      await fetchSingleReport();

      // Reset pól
      setTypUslugi('');
      setObiektUslugi('');
      setAmount('');
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

      await fetchSingleReport();
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

      {/* Formularz nowej akcji (dodawanie operacji) */}
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

            <div className="mb-4">
              <label className="block text-gray-700">Cena (zł):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
                step="0.01"
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

      {/* Tabela historii działań */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Historia Działań</h2>
        {history.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded mb-4 table-fixed">
            <thead>
              <tr>
                <th className="px-4 py-2 border w-24">Data</th>
                <th className="px-4 py-2 border w-64">Usługa</th>
                <th className="px-4 py-2 border w-24">Cena (zł)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((action) => (
                <tr key={action.id} className="text-center">
                  <td className="px-4 py-2 border">
                    {action.data ? new Date(action.data).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2 border">{action.typUslugi}</td>
                  <td className="px-4 py-2 border">{action.amount}</td>
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
