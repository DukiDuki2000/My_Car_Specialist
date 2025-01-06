"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Define service type
type Service = {
  id: number;
  type: string;
  cost: number;
  workshop: string;
  dateReported: string;
  dateCompleted?: string; // For history
  phone?: string; // For current services
  email?: string; // For current services
  status?: string; // For current services
  pdfLink?: string; // For history
};

// Define services by car
type ServicesByCar = {
  [key: string]: {
    history: Service[];
    current: Service[];
  };
};

export default function ServiceHistory() {
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

        if (role !== 'ROLE_CLIENT') {
            // Przekierowanie, jeśli użytkownik nie jest klientem
            router.push('/');
            return;
        }
    }, [router]);  
    
  const initialServicesByCar: ServicesByCar = {
    "Auto Syna BMW E36": {
      current: [
        {
          id: 1,
          type: "Wymiana hamulców",
          cost: 800,
          workshop: "Serwis XYZ",
          dateReported: "2023-06-15",
          phone: "123-456-789",
          email: "contact@serwisxyz.com",
          status: "w trakcie",
        },
        {
          id: 2,
          type: "Diagnostyka silnika",
          cost: 300,
          workshop: "AutoMax",
          dateReported: "2023-06-15",
          phone: "987-654-321",
          email: "support@automax.com",
          status: "gotowe",
        },
      ],
      history: [
        { id: 1, type: "Wymiana silnika", cost: 5000, workshop: "AutoSerwis", dateReported: "2023-01-01", dateCompleted: "2023-02-01", pdfLink: "/report1.pdf" },
        { id: 2, type: "Wymiana opon", cost: 300, workshop: "OponMax", dateReported: "2023-03-15", dateCompleted: "2023-03-16", pdfLink: "/report2.pdf" },
        { id: 3, type: "Wymiana oleju", cost: 150, workshop: "Warsztat ABC", dateReported: "2023-04-10", dateCompleted: "2023-04-11", pdfLink: "/report3.pdf" },
        { id: 4, type: "Naprawa hamulców", cost: 800, workshop: "Serwis XYZ", dateReported: "2023-05-20", dateCompleted: "2023-05-22", pdfLink: "/report4.pdf" },
        { id: 5, type: "Diagnostyka komputerowa", cost: 200, workshop: "DiagnoTech", dateReported: "2023-06-01", dateCompleted: "2023-06-01", pdfLink: "/report5.pdf" },
      ],
    },
    "Ford Focus 2010": {
      current: [
        {
          id: 1,
          type: "Naprawa skrzyni biegów",
          cost: 1500,
          workshop: "Warsztat B",
          dateReported: "2023-07-01",
          phone: "112-233-445",
          email: "warsztatB@gmail.com",
          status: "w trakcie",
        },
      ],
      history: Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        type: `Usługa ${index + 1}`,
        cost: (index + 1) * 100,
        workshop: `Warsztat ${index % 3 === 0 ? "A" : "B"}`,
        dateReported: `2023-0${(index % 9) + 1}-01`,
        dateCompleted: `2023-0${(index % 9) + 1}-02`,
        pdfLink: `/reportFord${index + 1}.pdf`,
      })),
    },
    "Audi A6 2022": {
      current: [
        {
          id: 1,
          type: "Wymiana reflektorów",
          cost: 600,
          workshop: "Serwis Audi",
          dateReported: "2023-06-25",
          phone: "445-667-889",
          email: "audi.service@gmail.com",
          status: "gotowe",
        },
      ],
      history: Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        type: `Naprawa ${index + 1}`,
        cost: (index + 1) * 200,
        workshop: `Warsztat ${index % 4 === 0 ? "C" : "D"}`,
        dateReported: `2022-0${(index % 9) + 1}-10`,
        dateCompleted: `2022-0${(index % 9) + 1}-12`,
        pdfLink: `/reportAudi${index + 1}.pdf`,
      })),
    },
  };

  const [selectedCar, setSelectedCar] = useState<string>("Auto Syna BMW E36");
  const [historySortConfig, setHistorySortConfig] = useState<{ key: keyof Service; direction: "ascending" | "descending" } | null>(null);
  const [historyServices, setHistoryServices] = useState<Service[]>([...initialServicesByCar[selectedCar].history]);

  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const car = e.target.value;
    setSelectedCar(car);
    setHistoryServices([...initialServicesByCar[car].history]);
    setHistorySortConfig(null);
  };

  const sortServices = (services: Service[], key: keyof Service, setServices: (sorted: Service[]) => void, sortConfig: any, setSortConfig: any) => {
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

  const renderSortArrows = (key: keyof Service, sortConfig: any) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "↕";
  };

  const renderTable = (
    services: Service[],
    sortConfig: any,
    setSortConfig: any,
    setServices: (sorted: Service[]) => void
  ) => (
    <table className="min-w-full border border-blue-400">
      <thead>
        <tr className="bg-blue-100">
          <th
            className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
            onClick={() => sortServices(services, "type", setServices, sortConfig, setSortConfig)}
          >
            Rodzaj usługi {renderSortArrows("type", sortConfig)}
          </th>
          <th
            className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
            onClick={() => sortServices(services, "cost", setServices, sortConfig, setSortConfig)}
          >
            Koszt {renderSortArrows("cost", sortConfig)}
          </th>
          <th
            className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
            onClick={() => sortServices(services, "workshop", setServices, sortConfig, setSortConfig)}
          >
            Warsztat {renderSortArrows("workshop", sortConfig)}
          </th>
          <th
            className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
            onClick={() => sortServices(services, "dateReported", setServices, sortConfig, setSortConfig)}
          >
            Data zgłoszenia {renderSortArrows("dateReported", sortConfig)}
          </th>
          <th
            className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
            onClick={() => sortServices(services, "dateCompleted", setServices, sortConfig, setSortConfig)}
          >
            Data ukończenia {renderSortArrows("dateCompleted", sortConfig)}
          </th>
          <th className="px-4 py-2 border border-blue-400 text-center">Raport PDF</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.id} className="hover:bg-blue-100 transition-colors">
            <td className="px-4 py-2 border border-blue-400">{service.type}</td>
            <td className="px-4 py-2 border border-blue-400">{service.cost} zł</td>
            <td className="px-4 py-2 border border-blue-400">{service.workshop}</td>
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Historia zleceń</h1>

      {/* Car Selection */}
      <div className="mb-8">
        <label htmlFor="carSelect" className="block text-lg font-medium text-gray-700 mb-2">
          Wybór samochodu
        </label>
        <select
          id="carSelect"
          value={selectedCar}
          onChange={handleCarChange}
          className="w-full max-w-lg px-4 py-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {Object.keys(initialServicesByCar).map((car) => (
            <option key={car} value={car}>
              {car}
            </option>
          ))}
        </select>
      </div>

      {/* Service History Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Historia zgłoszeń serwisowych</h2>
        {renderTable(historyServices, historySortConfig, setHistorySortConfig, setHistoryServices)}
      </div>
    </div>
  );
}
