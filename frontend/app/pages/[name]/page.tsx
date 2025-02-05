'use client';
import React from 'react';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; 

const UserDashboard = () => { 
    const router = useRouter();
    const { name } = useParams(); // Get params from the hook

    useEffect(() => {
        if (!name) return;

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            router.push('/pages/auth/login');  
            return;
        }

        try {
            const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
            const userType = tokenPayload.role;

            // Redirect based on user role
            if (userType === 'ROLE_CLIENT') {
                router.push(`/pages/${name}/client-dashboard`); 
            } else if (userType === 'ROLE_GARAGE') {
                router.push(`/pages/${name}/garage-dashboard`);  
            } else if (userType === 'ROLE_ADMIN') {
                router.push(`/pages/${name}/admin-dashboard`); // Dashboard administratora
            } else if (userType === 'ROLE_MODERATOR') {
                router.push(`/pages/${name}/moderator-dashboard`); // Dashboard moderatora
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
