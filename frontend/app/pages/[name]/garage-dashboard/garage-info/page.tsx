'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  username: string;
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
      // Jeśli brakuje tokena, username lub roli, przekierowanie na stronę logowania
      router.push('/');
      return;
    }

    if (role !== 'ROLE_GARAGE') {
      // Przekierowanie, jeśli użytkownik nie jest klientem
      router.push('/');
      return;
    }
  }, [router]);

  // ------------------------------------------------------
  // 2. Stan aplikacji (dane użytkownika, błąd, czy się ładuje)
  // ------------------------------------------------------
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  // 4. Renderowanie zawartości
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
    return null; // lub można wyświetlić jakiś komunikat, że nie znaleziono użytkownika
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8">Dane użytkownika</h1>

      {/* Karta z danymi użytkownika */}
      <div className="bg-white rounded shadow-md p-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">ID</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2"
            readOnly
            value={user.id}
          />
        </div>
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
    </div>
  );
}
