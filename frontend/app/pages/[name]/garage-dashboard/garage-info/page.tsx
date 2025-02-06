'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  username: string;
}

// Dostosuj interfejs poniżej tak, aby odpowiadał zwrotce z /api/garage/info
interface GarageInfo {
  id: number;
  nip: string;
  regon: string;
  companyName: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  phoneNumber: string;
  ibans: string[];
  userId: number;
  userName: string;
}

export default function UserProfile() {
  const router = useRouter();

  // ------------------------------------------------------
  // 1. Sprawdzenie autoryzacji (rola, token) w localStorage
  // ------------------------------------------------------
  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');

    if (!token || !username || !role) {
      router.push('/');
      return;
    }

    if (role !== 'ROLE_GARAGE') {
      router.push('/');
      return;
    }
  }, [router]);

  // ------------------------------------------------------
  // 2. Stan aplikacji (dane użytkownika, dane garażu, błąd, ładowanie)
  // ------------------------------------------------------
  const [user, setUser] = useState<User | null>(null);
  const [garage, setGarage] = useState<GarageInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Stany do edycji numeru telefonu
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState<string>('');

  // ------------------------------------------------------
  // 3. Zapytanie do API o dane zalogowanego użytkownika
  // ------------------------------------------------------
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('Brak tokena w localStorage.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/client/user/account', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Błąd: ${response.status}`);
        }

        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError('Nie udało się pobrać danych użytkownika.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ------------------------------------------------------
  // 4. Zapytanie do API o dane warsztatu
  // ------------------------------------------------------
  useEffect(() => {
    const fetchGarageData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('Brak tokena w localStorage.');
          return;
        }

        const response = await fetch('/api/garage/info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Błąd: ${response.status}`);
        }

        const data: GarageInfo = await response.json();
        setGarage(data);
        setPhoneNumberInput(data.phoneNumber); // ustawienie aktualnego numeru w stanie
      } catch (err) {
        console.error(err);
        setError('Nie udało się pobrać danych garażu.');
      }
    };

    fetchGarageData();
  }, []);

  // ------------------------------------------------------
  // 5. Funkcja obsługująca zmianę numeru telefonu
  // ------------------------------------------------------
  const handlePhoneChange = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Brak tokena w localStorage.');
      return;
    }

    // Jeśli nie jesteśmy w trybie edycji, włącz go
    if (!isEditingPhone) {
      setIsEditingPhone(true);
      return;
    }

    // Jeśli jesteśmy w trybie edycji, sprawdź czy numer składa się z dokładnie 9 cyfr
    if (phoneNumberInput.length !== 9) {
      setError('Numer telefonu musi składać się z dokładnie 9 cyfr.');
      return;
    }

    // Jeśli zmiana się powiedzie, aktualizujemy stan garażu
    try {
      const response = await fetch(`/api/garage/change/${phoneNumberInput}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd: ${response.status}`);
      }

      if (garage) {
        setGarage({ ...garage, phoneNumber: phoneNumberInput });
      }
      setIsEditingPhone(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Nie udało się zmienić numeru telefonu.');
    }
  };

  // ------------------------------------------------------
  // 6. Renderowanie zawartości
  // ------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Ładowanie danych użytkownika...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8">Dane użytkownika</h1>

      {/* Karta z danymi użytkownika */}
      <div className="bg-white rounded shadow-md p-6 w-full max-w-md mb-8">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Email</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2"
            readOnly
            value={user.email}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Nazwa użytkownika</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2"
            readOnly
            value={user.username}
          />
        </div>
      </div>

      {/* Karta z danymi warsztatu */}
      {garage && (
        <div className="bg-white rounded shadow-md p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Dane warsztatu</h2>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">NIP</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              readOnly
              value={garage.nip}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Nazwa firmy</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              readOnly
              value={garage.companyName}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Adres</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              readOnly
              value={`${garage.address.street}, ${garage.address.postalCode} ${garage.address.city}`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Numer telefonu</label>
            <div className="flex flex-col">
              <div className="flex">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  readOnly={!isEditingPhone}
                  value={phoneNumberInput}
                  maxLength={9}
                  onChange={(e) => {
                    // Pozostawiamy tylko cyfry
                    const value = e.target.value.replace(/\D/g, '');
                    setPhoneNumberInput(value);
                  }}
                />
                <button
                  onClick={handlePhoneChange}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={isEditingPhone && phoneNumberInput.length !== 9}
                >
                  {isEditingPhone ? 'Zatwierdź' : 'Zmień'}
                </button>
              </div>
              {isEditingPhone && phoneNumberInput.length !== 9 && (
                <p className="text-red-500 text-sm mt-1">
                  Numer telefonu musi składać się z dokładnie 9 cyfr
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
