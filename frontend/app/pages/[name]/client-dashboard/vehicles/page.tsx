'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function VehiclesDashboard() {
    const router = useRouter();

    useEffect(() => {
        // Sprawdzanie, czy użytkownik jest zalogowany
        const token = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (!token || !username || !role) {
            // Jeśli brakuje tokena, username lub roli, przekierowanie na stronę logowania
            router.push('/');
            return;
        }

        if (role !== 'ROLE_CLIENT') {
            // Przekierowanie, jeśli użytkownik nie jest klientem
            router.push('/');
            return;
        }
    }, [router]);

    const handleNavigate = (path: string) => {
        router.push(path); // Przekierowanie na podaną ścieżkę
    };

    return (
        <div className="absolute bottom-0 h-100 w-full">
            {/* Treść */}
            <main className="flex items-center justify-center flex-col -mt-16 px-4 h-[calc(100vh-80px)]">
                <h2 className="text-4xl font-bold text-gray-800 mb-12">Pojazdy</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">

                    {/* Dodaj pojazd */}
                    <div
                        onClick={() => handleNavigate(`/pages/${localStorage.getItem('username')}/client-dashboard/vehicles/add-car`)}
                        className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-20 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
                    >
                        <img
                            src="/car.svg"
                            alt="Pojazdy"
                            className="h-40 w-40 mb-8"
                        />
                        <p className="text-gray-800 font-semibold text-2xl">Dodaj pojazd</p>
                    </div>

                    {/* Twoje pojazdy */}
                    <div
                        onClick={() => handleNavigate(`/pages/${localStorage.getItem('username')}/client-dashboard/vehicles/show-vehicles`)}
                        className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-16 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
                    >
                        <img
                            src="/car.svg"
                            alt="Twoje pojazdy"
                            className="h-40 w-40 mb-8"
                        />
                        <p className="text-gray-800 font-semibold text-2xl">Twoje pojazdy</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
