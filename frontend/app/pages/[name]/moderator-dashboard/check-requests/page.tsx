'use client';

import { useEffect, useState } from 'react';

interface GarageRequest {
  nip: string;
  regon: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  description: string;
  id: number;
}

export default function GarageRequests() {
  const [requests, setRequests] = useState<GarageRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Nie znaleziono tokenu uwierzytelniającego.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/mod/garage/requests', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const data: GarageRequest[] = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
      setError('Nie udało się pobrać danych. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (nip: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Nie znaleziono tokenu uwierzytelniającego.');
      return;
    }

    try {
      const response = await fetch(`/api/mod/garage/request/${nip}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      // Aktualizacja stanu po usunięciu
      setRequests((prev) => prev.filter((request) => request.nip !== nip));
    } catch (error) {
      console.error('Błąd podczas usuwania żądania:', error);
      setError('Nie udało się usunąć żądania. Spróbuj ponownie później.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Ładowanie danych...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Żądania o zarejestrowanie warsztatów
      </h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">Brak żądań do wyświetlenia.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800">
                {request.companyName}
              </h2>
              <p className="text-gray-600">
                <strong>NIP:</strong> {request.nip}
              </p>
              <p className="text-gray-600">
                <strong>REGON:</strong> {request.regon}
              </p>
              <p className="text-gray-600">
                <strong>Adres:</strong> {request.address}
              </p>
              <p className="text-gray-600">
                <strong>Numer telefonu:</strong> {request.phoneNumber}
              </p>
              <p className="text-gray-600">
                <strong>Opis:</strong> {request.description}
              </p>
              <button
                onClick={() => deleteRequest(request.nip)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Usuń
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
