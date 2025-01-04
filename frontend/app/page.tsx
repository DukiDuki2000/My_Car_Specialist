'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Sprawdzanie, czy użytkownik jest zalogowany
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (token && username && role) {
            // Przekierowanie na podstawie roli użytkownika
            if (role === 'ROLE_ADMIN') {
                router.push(`/pages/${username}/admin-dashboard`); // Dashboard administratora
            } else if (role === 'ROLE_MODERATOR') {
                router.push(`/pages/${username}/moderator-dashboard`); // Dashboard moderatora
            } else if (role === 'ROLE_GARAGE') {
                router.push(`/pages/${username}/garage-dashboard`); // Dashboard garażu
            } else if (role === 'ROLE_CLIENT') {
                router.push(`/pages/${username}/client-dashboard`); // Dashboard klienta
            }
        }
    }, [router]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white-900">
            {/* Animowane tło */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-repeat-x bg-[length:200%_100%] animate-road bg-road"></div>
            </div>

            {/* Treść strony */}
            <div className="relative max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-2xl">
                <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
                    Witamy w MyCarSpecialist
                </h1>

                <p className="text-gray-600 text-lg mb-8 text-center leading-relaxed">
                    Uzyskaj łatwy dostęp do historii serwisowej swojego samochodu. Przechowuj całą dokumentację serwisową w jednym miejscu i otrzymuj niezawodną obsługę.
                </p>

                <div className="flex justify-center space-x-6">
                    <a
                        href="/pages/auth/login"
                        className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-2xl hover:bg-blue-700 transition-transform transform hover:-translate-y-1 duration-300"
                    >
                        Zaloguj się
                    </a>
                    <a
                        href="/pages/auth/register"
                        className="bg-gray-100 text-gray-800 px-8 py-3 rounded-full shadow-lg hover:shadow-2xl hover:bg-gray-200 transition-transform transform hover:-translate-y-1 duration-300"
                    >
                        Rejestracja
                    </a>
                </div>
            </div>
        </div>
    );
}
