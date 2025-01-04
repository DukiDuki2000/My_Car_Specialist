'use client'; // Layout jako komponent kliencki

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation'; // Hook do pobierania ścieżki
import './globals.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import komponentu Link
import Head from 'next/head'; // Import komponentu Head

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        router.push('/pages/auth/login');
    };

    const handleNavigation = () => {
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');

        if (role === 'ROLE_ADMIN') {
            router.push(`/pages/${username}/admin-dashboard`);
        } else if (role === 'ROLE_MODERATOR') {
            router.push(`/pages/${username}/moderator-dashboard`);
        } else if (role === 'ROLE_GARAGE') {
            router.push(`/pages/${username}/garage-dashboard`);
        } else if (role === 'ROLE_CLIENT') {
            router.push(`/pages/${username}/client-dashboard`);
        } else {
            router.push('/');
        }
    };

    const isLoggedIn = Boolean(localStorage.getItem('token'));

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
                {isLoggedIn && (
                    <div className="ml-auto flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
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
        <>
            <Head>
                {/* Link do Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <header className="bg-gray-100 p-4 shadow-md">
                <nav className="container mx-auto flex items-center justify-between">
                    {headerContent}
                </nav>
            </header>
            <main className="p-4">{children}</main>
        </>
    );
}
