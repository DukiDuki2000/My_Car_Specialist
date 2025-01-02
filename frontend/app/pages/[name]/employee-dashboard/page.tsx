'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
    const router = useRouter();

    // useEffect(() => {
    //     // Pobieramy token JWT z localStorage
    //     const token = localStorage.getItem('token');
        
    //     // Jeśli token nie istnieje, przekierowujemy na stronę logowania
    //     if (!token) {
    //         router.push('/pages/auth/login');
    //         return;
    //     }

    //     try {
    //         // Dekodowanie tokenu JWT, aby sprawdzić rolę użytkownika
    //         const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    //         const userType = tokenPayload.role;

    //         // Jeśli użytkownik nie jest pracownikiem, przekierowujemy go na stronę logowania
    //         if (userType !== 'employee') {
    //             router.push('/pages/auth/login');
    //         }
    //     } catch (error) {
    //         // W przypadku błędu zdekodowania tokenu (np. token jest niepoprawny),
    //         // przekierowujemy na stronę logowania
    //         router.push('/pages/auth/login');
    //     }
    // }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold text-gray-800">Witaj na panelu pracownika!</h1>
        </div>
    );
}
