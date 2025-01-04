'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import './globals.css';

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [userData, setUserData] = useState({
        token: '',
        username: '',
        role: '',
    });

    useEffect(() => {
        setUserData({
            token: localStorage.getItem('token') || '',
            username: localStorage.getItem('username') || 'Guest',
            role: localStorage.getItem('role') || '',
        });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/auth/login');
    };

    const handleNavigation = () => {
        const { role, username } = userData;
        const dashboardRoutes: Record<string, string> = {
            ROLE_ADMIN: `/admin-dashboard`,
            ROLE_MODERATOR: `/moderator-dashboard`,
            ROLE_GARAGE: `/garage-dashboard`,
            ROLE_CLIENT: `/client-dashboard`,
        };
        const path = dashboardRoutes[role] ? `/pages/${username}${dashboardRoutes[role]}` : '/';
        router.push(path);
    };

    const headerContent = (() => {
        if (pathname.startsWith('/auth/login')) {
            return (
                <Link href="/" className="text-2xl font-bold text-gray-700 hover:text-blue-500">
                    MyCarSpecialist
                </Link>
            );
        }
        if (pathname.startsWith('/auth/register')) {
            return (
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold text-gray-700 hover:text-blue-500">
                        MyCarSpecialist
                    </Link>
                    <Link
                        href="/auth/login"
                        className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Log In
                    </Link>
                </div>
            );
        }
        return (
            <div className="flex items-center">
                <a
                    onClick={handleNavigation}
                    className="text-2xl font-bold text-gray-800 hover:text-blue-500 cursor-pointer"
                >
                    MyCarSpecialist
                </a>
                {userData.token && (
                    <div className="ml-auto flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Log Out
                        </button>
                        <span className="text-sm text-gray-800 font-semibold">{userData.username}</span>
                    </div>
                )}
            </div>
        );
    })();

    return (
        <div className="font-poppins bg-gray-50 min-h-screen">
            <header className="bg-gray-100 p-4 shadow-md">
                <nav className="container mx-auto">{headerContent}</nav>
            </header>
            <main className="p-4">{children}</main>
        </div>
    );
}
