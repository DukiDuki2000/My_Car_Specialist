"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Define service type
type Service = {
  id: number;
  type: string;
  cost: number;
  client: string; // Added client name
  phone: string; // Client phone number
  email: string; // Client email
  dateReported: string;
  dateCompleted?: string; // For history
  status?: string; // For current services
  pdfLink?: string; // For history
};

// Define services
const initialServices: Service[] = [
  { id: 1, type: "Wymiana hamulców", cost: 800, client: "Jan Kowalski", phone: "123-456-789", email: "JanKowalski@wp.com", dateReported: "2023-06-15", dateCompleted: "2023-06-16", pdfLink: "/report1.pdf" },
  { id: 2, type: "Diagnostyka silnika", cost: 300, client: "Anna Nowak", phone: "987-654-321", email: "Ania2010@onet.com", dateReported: "2023-06-20", dateCompleted: "2023-06-21", pdfLink: "/report2.pdf" },
  { id: 3, type: "Wymiana oleju", cost: 150, client: "Michał Nowak", phone: "456-789-123", email: "MichalNowak@gmail.com", dateReported: "2023-07-10", dateCompleted: "2023-07-11", pdfLink: "/report3.pdf" }
];

export default function ServiceDashboard() {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>(initialServices);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Service; direction: "ascending" | "descending" } | null>(null);

    useEffect(() => {
        // Sprawdzanie, czy użytkownik jest zalogowany
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (!token || !username || !role) {
            // Jeśli brakuje tokena, username lub roli, przekierowanie na stronę logowania
            router.push('/');
            return;
        }

        if (role !== 'ROLE_SERVICE') {
            // Przekierowanie, jeśli użytkownik nie jest serwisem
            router.push('/');
            return;
        }
    }, [router]);  

    const sortServices = (key: keyof Service) => {
        let direction: "ascending" | "descending" = "ascending";
        if (sortConfig?.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }

        const sortedServices = [...services].sort((a, b) => {
            if (a[key]! < b[key]!) return direction === "ascending" ? -1 : 1;
            if (a[key]! > b[key]!) return direction === "ascending" ? 1 : -1;
            return 0;
        });

        setServices(sortedServices);
        setSortConfig({ key, direction });
    };

    const renderSortArrows = (key: keyof Service) => {
        if (sortConfig?.key === key) {
            return sortConfig.direction === "ascending" ? "▲" : "▼";
        }
        return "↕";
    };

    const renderTable = () => (
        <table className="min-w-full border border-blue-400">
            <thead>
                <tr className="bg-blue-100">
                    <th
                        className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
                        onClick={() => sortServices("type")}
                    >
                        Rodzaj usługi {renderSortArrows("type")}
                    </th>
                    <th
                        className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
                        onClick={() => sortServices("cost")}
                    >
                        Koszt {renderSortArrows("cost")}
                    </th>
                    <th
                        className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
                        onClick={() => sortServices("client")}
                    >
                        Klient {renderSortArrows("client")}
                    </th>
                    <th
                        className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
                        onClick={() => sortServices("phone")}
                    >
                        Telefon {renderSortArrows("phone")}
                    </th>
                    <th
                        className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
                        onClick={() => sortServices("email")}
                    >
                        Email {renderSortArrows("email")}
                    </th>
                    <th
                        className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
                        onClick={() => sortServices("dateReported")}
                    >
                        Data zgłoszenia {renderSortArrows("dateReported")}
                    </th>
                    <th
                        className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
                        onClick={() => sortServices("dateCompleted")}
                    >
                        Data ukończenia {renderSortArrows("dateCompleted")}
                    </th>
                    <th className="px-4 py-2 border border-blue-400 text-center">Raport PDF</th>
                </tr>
            </thead>
            <tbody>
                {services.map((service) => (
                    <tr key={service.id} className="hover:bg-blue-100 transition-colors">
                        <td className="px-4 py-2 border border-blue-400">{service.type}</td>
                        <td className="px-4 py-2 border border-blue-400">{service.cost} zł</td>
                        <td className="px-4 py-2 border border-blue-400">{service.client}</td>
                        <td className="px-4 py-2 border border-blue-400">{service.phone}</td>
                        <td className="px-4 py-2 border border-blue-400">{service.email}</td>
                        <td className="px-4 py-2 border border-blue-400">{service.dateReported}</td>
                        <td className="px-4 py-2 border border-blue-400">{service.dateCompleted}</td>
                        <td className="px-4 py-2 border border-blue-400 text-center">
                            <a href={service.pdfLink} target="_blank" rel="noopener noreferrer">
                                <img src="/PDF.png" alt="PDF Ikona" className="w-6 h-6 mx-auto" />
                            </a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Historia zleceń serwisowych</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tabela historii zleceń</h2>
                {renderTable()}
            </div>
        </div>
    );
}
