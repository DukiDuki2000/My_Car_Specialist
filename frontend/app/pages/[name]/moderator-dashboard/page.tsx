'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GarageDashboard() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false); // Stan do sprawdzenia, czy działamy po stronie klienta

    useEffect(() => {
        // Ustalamy, czy działamy po stronie klienta
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return; // Zatrzymaj, jeśli nie jesteśmy po stronie klienta

        // Sprawdzanie, czy użytkownik jest zalogowany
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (!token || !username || !role) {
            // Jeśli brakuje tokena, username lub roli, przekierowanie na stronę logowania
            router.push('/pages/auth/login');
            return;
        }

        if (role !== 'ROLE_MODERATOR') {
            // Przekierowanie, jeśli użytkownik nie jest garażem
            router.push('/pages/auth/login');
            return;
        }
    }, [router, isClient]);

    const handleNavigate = (path: string) => {
        router.push(path); // Przekierowanie na podaną ścieżkę
    };

    if (!isClient) {
        return null; // Zwróć null, jeśli nie jesteśmy po stronie klienta
    }

    return (
        <div className="absolute bottom-0 h-100 w-full">
            {/* Treść */}
            <main className="flex items-center justify-center flex-col -mt-16 px-4 h-[calc(100vh-80px)]">
                <h2 className="text-4xl font-bold text-gray-800 mb-12">Panel Moderatora</h2>

            </main>
        </div>
    );
}
