'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importowanie useRouter

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
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const router = useRouter(); // Inicjalizacja routera

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
      setError('Brak zgłoszeń o rejestrację. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createWorkshop = async (request: GarageRequest) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Nie znaleziono tokenu uwierzytelniającego.');
      return;
    }

    const payload = {
      ...formData,
      ...request,
    };

    try {
      const response = await fetch('/api/mod/garage-add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      alert(`Warsztat dla NIP: ${request.nip} został utworzony.`);
      setExpandedId(null);
      setFormData({ username: '', email: '', password: '' });

      // Przekierowanie do poprzedniej strony
      router.back();
    } catch (error) {
      console.error('Błąd podczas tworzenia warsztatu:', error);
      setError('Nie udało się utworzyć warsztatu. Spróbuj ponownie później.');
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
                <b>NIP:</b> {request.nip}
              </p>
              <p className="text-gray-600">
                <b>REGON:</b> {request.regon}
              </p>
              <p className="text-gray-600">
                <b>Adres:</b> {request.address}
              </p>
              <p className="text-gray-600">
                <b>Numer telefonu:</b> {request.phoneNumber}
              </p>
              <p className="text-gray-600">
                <b>Opis:</b> {request.description}
              </p>

              {expandedId === request.id ? (
              <div className="mt-4">
                <div className="space-y-4">
                  <input
                    type="text"
                    name="username"
                    placeholder="Nazwa użytkownika"
                    value={formData.username}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        createWorkshop(request);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Utwórz warsztat
                    </button>
                    <button
                      onClick={() => setExpandedId(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Zwiń
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setExpandedId(request.id)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Rozwiń
              </button>
            )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
