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

        if (role !== 'ROLE_GARAGE') {
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
            <main className="flex items-center justify-center flex-col -mt-16 px-4 h-[calc(80vh-80px)]">
                <h2 className="text-4xl font-bold text-gray-800 mb-14">Panel Warsztatu</h2>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">

                    {/* Sprawdzenie zgłoszeń od klientów */}
                    <div
                        onClick={() => handleNavigate(`/pages/${localStorage.getItem('username')}/garage-dashboard/request-history`)}
                        className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-16 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
                    >
                        <img
                            src="/note.svg"
                            alt="Lista zgłoszeń"
                            className="h-40 w-40 mb-8"
                        />
                        <p className="text-gray-800 font-semibold text-2xl">Sprawdzenie zgłoszeń</p>
                    </div>

                    {/* Nowe zgłoszenie */}
                    <div
                        onClick={() => handleNavigate(`/pages/${localStorage.getItem('username')}/garage-dashboard/add-request`)}
                        className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-16 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
                    >
                        <img
                            src="/pencil.svg"
                            alt="Nowe zgłoszenie"
                            className="h-40 w-40 mb-8"
                        />
                        <p className="text-gray-800 font-semibold text-2xl">Nowe zlecenie</p>
                    </div>

                    {/* Aktualne zgłoszenia */}
                    <div
                        onClick={() => handleNavigate(`/pages/${localStorage.getItem('username')}/garage-dashboard/request-history`)}
                        className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-16 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
                    >
                        <img
                            src="/listaZgloszen.svg"
                            alt="Lista zgłoszeń"
                            className="h-40 w-40 mb-8"
                        />
                        <p className="text-gray-800 font-semibold text-2xl">Aktualne zlecenia</p>
                    </div>

                    {/* Historia zgłoszeń */}
                    <div
                        onClick={() => handleNavigate(`/pages/${localStorage.getItem('username')}/garage-dashboard/history`)}
                        className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-16 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
                    >
                        <img
                            src="/history.svg"
                            alt="Lista zgłoszeń"
                            className="h-40 w-40 mb-8"
                        />
                        <p className="text-gray-800 font-semibold text-2xl">Historia zleceń</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
