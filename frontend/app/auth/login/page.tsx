'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Hook do przekierowań w Next.js
import Link from 'next/link';

export default function Login() {
    const [isClient, setIsClient] = useState(true); // Przełącznik między klientem a pracownikiem
    const router = useRouter(); // Hook do nawigacji

    const handleToggle = (type: 'client' | 'employee') => {
        setIsClient(type === 'client');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Logika walidacji logowania (tu tylko symulacja)
        if (isClient) {
            console.log('Client login successful');
            router.push('/dashboards/client-dashboard'); // Przekierowanie dla klienta
        } else {
            console.log('Employee login successful');
            router.push('/dashboards/employee-dashboard'); // Przekierowanie dla pracownika
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">My Car Specialist</h1>

                {/* Przełącznik Klient/Pracownik */}
                <div className="flex justify-between items-center mb-4 border-b border-gray-300">
                    <button
                        className={`flex-1 text-center py-2 ${isClient ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                        onClick={() => handleToggle('client')}
                    >
                        Klient
                    </button>
                    <button
                        className={`flex-1 text-center py-2 ${!isClient ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                        onClick={() => handleToggle('employee')}
                    >
                        Pracownik
                    </button>
                </div>

                {/* Formularz logowania */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {isClient ? 'Email lub nazwa użytkownika:' : 'Numer pracownika:'}
                        </label>
                        <input
                            className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type={isClient ? 'text' : 'number'}
                            placeholder={isClient ? 'Wpisz email lub nazwę użytkownika' : 'Wpisz numer pracownika'}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hasło:</label>
                        <input
                            className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="password"
                            placeholder="Wpisz hasło"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md font-medium transition duration-300 transform hover:scale-105"
                    >
                        Zaloguj
                    </button>
                </form>

                {/* Link do rejestracji (ukryty/nieaktywny dla pracownika) */}
                {isClient ? (
                    <div className="mt-4 text-center">
                        <Link
                            href="/auth/register"
                            className="text-blue-500 hover:underline font-medium"
                        >
                            Utwórz konto
                        </Link>
                    </div>
                ) : (
                    <div className="mt-4 text-center">
                        <span className="text-gray-400 font-medium cursor-not-allowed">
                            Opcja niedostępna dla pracownika
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}