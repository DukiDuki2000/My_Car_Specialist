'use client'; // Layout jako komponent kliencki

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation'; // Hook do pobierania ścieżki
import './globals.css';

import { useRouter } from 'next/navigation';

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // Czyszczenie danych użytkownika z localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        
        // Przekierowanie do strony logowania
        router.push('/pages/auth/login'); // Ustaw odpowiednią ścieżkę, np. "/login"
    };

    const handleNavigation = () => {
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');

        if (role === 'ROLE_ADMIN') {
            router.push(`/pages/${username}/admin-dashboard`); // Dashboard administratora
        } else if (role === 'ROLE_MODERATOR') {
            router.push(`/pages/${username}/moderator-dashboard`); // Dashboard moderatora
        } else if (role === 'ROLE_GARAGE') {
            router.push(`/pages/${username}/garage-dashboard`); // Dashboard garażu
        } else if (role === 'ROLE_CLIENT') {
            router.push(`/pages/${username}/client-dashboard`); // Dashboard klienta
        } else {
            router.push('/'); // Jeśli brak roli, przejdź do logowania
        }
    };

    // Sprawdzenie, czy użytkownik jest zalogowany
    const isLoggedIn = Boolean(localStorage.getItem('token'));

    // Zmienna kontrolująca treść w headerze
    let headerContent;
    if (pathname.startsWith('/pages/auth/login')) {
        headerContent = (
            <a href="/" className="text-2xl font-bold text-gray-700 hover:text-blue-500">
                MyCarSpecialist
            </a>
        );
    } else if (pathname.startsWith('/pages/auth/register')) {
        headerContent = (
            <div className="w-full bg-transparent flex items-center">
                <a href="/" className="text-2xl font-bold text-gray-700 hover:text-blue-500">
                    MyCarSpecialist
                </a>
                <a
                    href="/pages/auth/login"
                    className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Log In
                </a>
            </div>
        );
    } else {
        headerContent = (
            <div className="w-full bg-transparent flex items-center">
                <a
                    onClick={handleNavigation} // Przekierowanie w zależności od roli
                    className="text-2xl font-bold text-gray-800 hover:text-blue-500 cursor-pointer"
                >
                    MyCarSpecialist
                </a>
                {isLoggedIn && (
                    <div className="ml-auto flex items-center space-x-4">
                        <button
                            onClick={handleLogout} // Funkcja obsługująca wylogowanie
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Wyloguj się
                        </button>
                        <span className="text-sm text-gray-800 font-semibold">
                            {localStorage.getItem('username') || 'Nieznany Użytkownik'}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <html lang="en">
            <head>
                {/* Link do Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-poppins bg-gray-50 min-h-screen">
                {/* Renderuj nagłówek, a treść zależy od strony */}
                <header className="bg-gray-100 p-4 shadow-md">
                    <nav className="container mx-auto flex items-center justify-between">
                        {headerContent}
                    </nav>
                </header>
                <main className="p-4">{children}</main>
            </body>
        </html>
    );
}
