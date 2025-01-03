'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

const UserDashboard = ({ params }: { params: { name: string } }) => { 

    const router = useRouter();
    const { name } = params; 

    useEffect(() => {
        if (!name) return;

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/pages/auth/login');  
            return;
        }

        try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const userType = tokenPayload.role;

            // Redirect based on user role
            if (userType === 'ROLE_CLIENT') {
                router.push(`/pages/${name}/client-dashboard`); 
            } else if (userType === 'ROLE_GARAGE') {
                router.push(`/pages/${name}/garage-dashboard`);  
            } else {
                router.push('/pages/auth/login');  
            }
        } catch (error) {
            router.push('/pages/auth/login');  
        }
    }, [name, router]);

    return null;  
};

export default UserDashboard;
