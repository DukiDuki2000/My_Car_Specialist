'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
            const response = await fetch('/api/user/auth/signin', {
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

            // Sprawdzenie i zapisanie danych w localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.roles[0]); 

                // Przekierowanie na odpowiedni dashboard na podstawie roli
                if (data.roles.includes('ROLE_CLIENT')) {
                    router.push(`/pages/${data.username}/client-dashboard`);
                } else if (data.roles.includes('ROLE_GARAGE')) {
                    router.push(`/pages/${data.username}/garage-dashboard`);
                } else if (data.roles.includes('ROLE_MODERATOR')) {
                    router.push(`/pages/${data.username}/moderator-dashboard`);
                } else if (data.roles.includes('ROLE_ADMIN')) {
                    router.push(`/pages/${data.username}/admin-dashboard`);
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
