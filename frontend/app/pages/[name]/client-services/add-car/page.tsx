'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCarForm() {
  const router = useRouter();

  useEffect(() => {
    // Sprawdzanie, czy użytkownik jest zalogowany (czy istnieje token)
    const token = localStorage.getItem('token');
    if (!token) {
      // Jeśli brak tokenu, przekierowanie na stronę logowania
      router.push('/pages/auth/login');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Samochód został dodany!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-lg shadow-xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dodaj Samochód
        </h2>

        {/* Numer VIN */}
        <div className="mb-6">
          <label
            htmlFor="vin"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Numer VIN
          </label>
          <input
            type="text"
            id="vin"
            name="vin"
            required
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz numer VIN"
          />
        </div>

        {/* Numer tablicy rejestracyjnej */}
        <div className="mb-6">
          <label
            htmlFor="plateNumber"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Numer tablicy rejestracyjnej
          </label>
          <input
            type="text"
            id="plateNumber"
            name="plateNumber"
            required
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz numer tablicy rejestracyjnej"
          />
        </div>

        {/* Nazwa/Nick */}
        <div className="mb-8">
          <label
            htmlFor="nick"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Nazwa/Nick (opcjonalne)
          </label>
          <input
            type="text"
            id="nick"
            name="nick"
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz nazwę lub nick (opcjonalne)"
          />
        </div>

        {/* Przycisk */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 text-lg rounded hover:bg-blue-600 transition"
        >
          Dodaj samochód
        </button>
      </form>
    </div>
  );
}
