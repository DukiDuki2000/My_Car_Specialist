'use client'; // Layout jako komponent kliencki

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation'; // Hook do pobierania ścieżki
import './globals.css';

import { useRouter } from "next/navigation";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();

    const router = useRouter();

    const handleLogout = () => {
        // Przekierowanie do strony logowania lub innej strony
        router.push("/auth/login"); // Ustaw odpowiednią ścieżkę, np. "/login"
      };

    // Zmienna kontrolująca treść w headerze
    let headerContent;
    if (pathname.startsWith('/auth/login')) {
        headerContent = (
            <a href="/" className="text-2xl font-bold text-gray-700 hover:text-blue-500">
                MyCarSpecialist
            </a>
        );
    } else if (pathname.startsWith('/auth/register')) {
        headerContent = (
            <div className="w-full bg-transparent flex items-centerr">
                <a href="/" className="text-2xl font-bold text-gray-700 hover:text-blue-500">
                    MyCarSpecialist
                </a>
                <a
                    href="/auth/login"
                    className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Log In
                </a>
            </div>
        );
    } else if (pathname.startsWith('/dashboards/client-dashboard')) {
        headerContent = (
            <div className="w-full bg-transparent flex items-center">
                <a href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-500">
                    MyCarSpecialist
                </a>
                <div className="ml-auto flex items-center space-x-4">
                    <button
                        onClick={handleLogout} // Funkcja obsługująca wylogowanie
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Wyloguj się
                    </button>
                    <span className="text-sm text-gray-800 font-semibold">Janusz Kowalski</span>
                </div>
            </div>
        );
    }else if (pathname.startsWith('/client-services')) {
        headerContent = (
            <div className="w-full bg-transparent flex items-center">
                <a href="/dashboards/client-dashboard" className="text-2xl font-bold text-gray-800 hover:text-blue-500">
                    Powrót do panelu klienta
                </a>
                <div className="ml-auto flex items-center space-x-4">
                    <button
                        onClick={handleLogout} // Funkcja obsługująca wylogowanie
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Wyloguj się
                    </button>
                    <span className="text-sm text-gray-800 font-semibold">Janusz Kowalski</span>
                </div>
            </div>
        );
    } else {
        headerContent = (
            <a href="/" className="text-2xl font-bold text-gray-700 hover:text-blue-500">
                MyCarSpecialist
            </a>
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
