"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Define service type
type Service = {
  id: number;
  type: string;
  cost: number;
  client: string; // Client name
  phone: string; // Client phone number
  email: string; // Client email
  dateReported: string;
  status: "w trakcie" | "gotowe"; // Service status
};

// Define initial services
const initialServices: Service[] = [
  { id: 1, type: "Wymiana hamulców", cost: 800, client: "Jan Kowalski", phone: "123-456-789", email: "JanKowalski@wp.com", dateReported: "2023-06-15", status: "w trakcie" },
  { id: 2, type: "Diagnostyka silnika", cost: 300, client: "Anna Nowak", phone: "987-654-321", email: "Ania2010@onet.com", dateReported: "2023-06-20", status: "gotowe" },
  { id: 3, type: "Wymiana oleju", cost: 150, client: "Michał Nowak", phone: "456-789-123", email: "MichalNowak@gmail.com", dateReported: "2023-07-10", status: "w trakcie" }
];

export default function CurrentRequests() {
    const router = useRouter();

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


    const [services, setServices] = useState<Service[]>(initialServices);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Service; direction: "ascending" | "descending" } | null>(null);

    const handleStatusChange = (id: number, newStatus: "w trakcie" | "gotowe") => {
        const updatedServices = services.map((service) =>
            service.id === id ? { ...service, status: newStatus } : service
        );
        setServices(updatedServices);
    };

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

    const generatePDF = (service: Service) => {
        // Placeholder for PDF generation logic
        alert(`Generowanie raportu PDF dla: ${service.type}, klient: ${service.client}`);
    };

    const renderTable = () => (
        <table className="min-w-full border border-blue-400">
            <thead>
                <tr className="bg-blue-100">
                    <th
                        className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
                        onClick={() => sortServices("type")}
                    >
                        Usługa {renderSortArrows("type")}
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
                        Numer telefonu {renderSortArrows("phone")}
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
                        onClick={() => sortServices("status")}
                    >
                        Status {renderSortArrows("status")}
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
                        <td className="px-4 py-2 border border-blue-400 text-center">
                            <select
                                value={service.status}
                                onChange={(e) => handleStatusChange(service.id, e.target.value as "w trakcie" | "gotowe")}
                                className={`px-2 py-1 rounded text-white font-bold ${
                                    service.status === "w trakcie" ? "bg-yellow-500" : "bg-green-500"
                                }`}
                            >
                                <option value="w trakcie">W trakcie</option>
                                <option value="gotowe">Gotowe</option>
                            </select>
                        </td>
                        <td className="px-4 py-2 border border-blue-400 text-center">
                            {service.status === "gotowe" ? (
                                <button
                                    onClick={() => generatePDF(service)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Generuj raport PDF
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="px-3 py-1 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
                                >
                                    Generuj raport PDF
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Aktualne zgłoszenia</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Lista zgłoszeń</h2>
                {renderTable()}
            </div>
        </div>
    );
}
