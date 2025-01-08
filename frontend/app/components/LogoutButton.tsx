'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Usunięcie danych użytkownika z localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');

        // Przekierowanie na stronę logowania
        router.push('/pages/auth/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-300 transform hover:scale-105"
        >
            Wyloguj się
        </button>
    );
}
