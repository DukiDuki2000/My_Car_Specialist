'use client'; // Layout jako komponent kliencki

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Hooki do nawigacji Next.js
import './globals.css';
import Link from 'next/link'; // Import komponentu Link

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    // Stan przechowujący informacje o zalogowanym użytkowniku
    const [user, setUser] = useState<{
        username: string | null;
        role: string | null;
        token: string | null;
    }>({
        username: null,
        role: null,
        token: null,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true); // Stan do kontroli załadowania danych

    // Hook useEffect, aby pobrać dane z localStorage po stronie klienta
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        setUser({ username, role, token });
        setIsLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        router.push('/'); 
    };

    const handleNavigation = () => {
        if (user.role === 'ROLE_ADMIN') {
            router.push(`/pages/${user.username}/admin-dashboard`);
        } else if (user.role === 'ROLE_MODERATOR') {
            router.push(`/pages/${user.username}/moderator-dashboard`);
        } else if (user.role === 'ROLE_GARAGE') {
            router.push(`/pages/${user.username}/garage-dashboard`);
        } else if (user.role === 'ROLE_CLIENT') {
            router.push(`/pages/${user.username}/client-dashboard`);
        } else {
            router.push('/'); // Jeśli brak roli, przekieruj do logowania
        }
    };

    // Zmienna kontrolująca treść w headerze
    let headerContent;
    if (pathname.startsWith('/pages/auth/login')) {
        headerContent = (
            <Link href="/" className="text-2xl font-bold text-gray-700 hover:text-blue-500">
                MyCarSpecialist
            </Link>
        );
    } else if (pathname.startsWith('/pages/auth/register')) {
        headerContent = (
            <div className="w-full bg-transparent flex items-center">
                <Link href="/" className="text-2xl font-bold text-gray-700 hover:text-blue-500">
                    MyCarSpecialist
                </Link>
                <Link
                    href="/pages/auth/login"
                    className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Log In
                </Link>
            </div>
        );
    } else {
        headerContent = (
            <div className="w-full bg-transparent flex items-center">
                <a
                    onClick={handleNavigation}
                    className="text-2xl font-bold text-gray-800 hover:text-blue-500 cursor-pointer"
                >
                    MyCarSpecialist
                </a>
                {!isLoading && user.token && user.token !== 'null' && user.token !== '' && (
                    <div className="ml-auto flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Wyloguj się
                        </button>
                        <span className="text-sm text-gray-800 font-semibold">
                            {user.username || 'Nieznany Użytkownik'}
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
