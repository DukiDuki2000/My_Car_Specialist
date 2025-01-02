'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [isClient, setIsClient] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleToggle = (type: 'client') => {
        setIsClient(type === 'client');
        setFormData({ username: '', password: '' });
        setError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8081/user/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Nieprawidłowe dane logowania');
            }

            const data = await response.json();

            // Zakładając, że token JWT znajduje się w polu 'token'
            if (data.token) {
                // Zapisz token w localStorage
                localStorage.setItem('token', data.token);

                // Sprawdzamy typ użytkownika (np. na podstawie payload tokenu)
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
                const userType = tokenPayload.role; // Przykład: 'client' lub 'employee'

                // Przekierowanie na odpowiedni dashboard na podstawie roli użytkownika
                if (userType === 'client') {
                    router.push(`/${formData.username}/client-dashboard`);  // Strona pulpitu klienta
                } else if (userType === 'employee') {
                    router.push(`/${formData.username}/employee-dashboard`);  // Strona pulpitu pracownika
                } else {
                    throw new Error('Nieznana rola użytkownika');
                }
            } else {
                throw new Error('Brak tokena w odpowiedzi');
            }
        } catch (err: any) {
            setError(err.message || 'Wystąpił błąd podczas logowania');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">My Car Specialist</h1>

                <div className="flex justify-center mb-4 border-b border-gray-300">
                    <button
                        className={`flex-1 text-center py-2 ${isClient ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                        onClick={() => handleToggle('client')}
                    >
                        Klient
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email lub nazwa użytkownika:
                        </label>
                        <input
                            className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            name="username"
                            placeholder="Wpisz email lub nazwę użytkownika"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hasło:</label>
                        <input
                            className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="password"
                            name="password"
                            placeholder="Wpisz hasło"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md font-medium transition duration-300 transform hover:scale-105"
                    >
                        Zaloguj
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href="/pages/auth/register"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Utwórz konto
                    </Link>
                </div>
            </div>
        </div>
    );
}
