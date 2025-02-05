'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            const username = localStorage.getItem('username');
            const role = localStorage.getItem('role');

            if (token && username && role) {
                if (role === 'ROLE_ADMIN') {
                    router.push(`/pages/${username}/admin-dashboard`);
                } else if (role === 'ROLE_MODERATOR') {
                    router.push(`/pages/${username}/moderator-dashboard`);
                } else if (role === 'ROLE_GARAGE') {
                    router.push(`/pages/${username}/garage-dashboard`);
                } else if (role === 'ROLE_CLIENT') {
                    router.push(`/pages/${username}/client-dashboard`);
                }
            }
        }
    }, [router]);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white-900">
            {/* Animowane tło */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-repeat-x bg-[length:200%_100%] animate-road bg-road"></div>
            </div>

            {/* Główna sekcja */}
            <div className="relative max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-2xl text-center">
                <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
                    Witamy w MyCarSpecialist
                </h1>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Uzyskaj łatwy dostęp do historii serwisowej swojego samochodu. Przechowuj całą dokumentację serwisową w jednym miejscu i otrzymuj niezawodną obsługę.
                </p>

                {/* Przyciski */}
                <div className="flex justify-center space-x-6">
                    <Link
                        href="/pages/auth/login"
                        className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-2xl hover:bg-blue-700 transition-transform transform hover:-translate-y-1 duration-300"
                    >
                        Zaloguj się
                    </Link>
                    <Link
                        href="/pages/auth/register"
                        className="bg-gray-100 text-gray-800 px-8 py-3 rounded-full shadow-lg hover:shadow-2xl hover:bg-gray-200 transition-transform transform hover:-translate-y-1 duration-300"
                    >
                        Rejestracja
                    </Link>
                    <Link
                        href="/pages/form"
                        className="bg-green-100 text-gray-800 px-8 py-3 rounded-full shadow-lg hover:shadow-2xl hover:bg-green-200 transition-transform transform hover:-translate-y-1 duration-300"
                    >
                        Dołącz do zaufanych warsztatów!
                    </Link>
                </div>
            </div>

            {/* Przyciski na dole strony */}
            <div className="relative mt-12">
                <Link
                    href="/pages/about"
                    className="bg-purple-600 text-white px-12 py-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-purple-700 transition-transform transform hover:-translate-y-1 duration-300 text-lg font-semibold"
                >
                    O projekcie My Car Specialist
                </Link>
            </div>
        </div>
    );
}
