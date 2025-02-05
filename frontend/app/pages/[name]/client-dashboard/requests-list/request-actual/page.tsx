'use client';
import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

// Define service type
type Service = {
  id: number;
  vehicleId: number;
  description: string;
  cost: number;
  garage: { companyName: string };
  createdAt: string;
  phone?: string;
  email?: string;
  status?: string; // Status added here
  pdfLink?: string;
};

export default function ServiceHistory() {
  const router = useRouter();
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [cars, setCars] = useState<{ id: number; registrationNumber: string }[]>([]);
  const [currentServices, setCurrentServices] = useState<Service[]>([]);
  const [currentSortConfig, setCurrentSortConfig] = useState<{ key: keyof Service; direction: "ascending" | "descending" } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      router.push("/");
      return;
    }
  
    const fetchUserCars = async () => {
      try {
        const response = await fetch("/api/vehicle/search", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data: {
          id: number;
          vin: string;
          registrationNumber: string;
          brand: string;
          model: string;
          modelYear: number;
        }[] = await response.json();
    
        const carList = data.map((car) => ({
          id: car.id,
          registrationNumber: `${car.registrationNumber} - ${car.brand} ${car.model} `,
        }));
    
        setCars(carList);
    
        if (carList.length > 0 && !selectedCar) {
          setSelectedCar(carList[0].registrationNumber);
        }
      } catch (error) {
        console.error("Error fetching user cars:", error);
        router.push("/");
      }
    };

    fetchUserCars();
  }, [router]);

  useEffect(() => {
    if (!selectedCar) return;

    const fetchServicesForCar = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const responseNew = await fetch(`/api/client/report/all/new`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseInProgress = await fetch(`/api/client/report/all/inprogress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!responseNew.ok || !responseInProgress.ok) {
          throw new Error(`HTTP error! Status: ${responseNew.status} or ${responseInProgress.status}`);
        }

        const dataNew = await responseNew.json();
        const dataInProgress = await responseInProgress.json();

        const selectedCarObj = cars.find(
          (car) => `${car.registrationNumber}` === selectedCar
        );

        if (selectedCarObj) {
          const filteredServices = [
            ...dataNew.filter((service: Service) => service.vehicleId === selectedCarObj.id),
            ...dataInProgress.filter((service: Service) => service.vehicleId === selectedCarObj.id)
          ];
          setCurrentServices(filteredServices);
        }
      } catch (error) {
        console.error("Error fetching services for car:", error);
      }
    };

    fetchServicesForCar();
  }, [selectedCar, cars]);

  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const car = e.target.value;
    setSelectedCar(car);
    setCurrentSortConfig(null);
  };

  const sortServices = (services: Service[], key: keyof Service) => {
    let direction: "ascending" | "descending" = "ascending";
    if (currentSortConfig?.key === key && currentSortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedServices = [...services].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "ascending" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setCurrentServices(sortedServices);
    setCurrentSortConfig({ key, direction });
  };

  const renderSortArrows = (key: keyof Service) => {
    if (currentSortConfig?.key === key) {
      return currentSortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "↕";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', ''); // Usuwamy przecinek, który jest domyślnie dodawany
  };

  // Function to translate status
  const translateStatus = (status: string | undefined) => {
    switch (status) {
      case "NEW":
        return "Nowe";
      case "IN_PROGRESS":
        return "W realizacji";
      default:
        return status || "Brak statusu";
    }
  };

  const renderTable = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Aktualne zgłoszenia serwisowe</h2>
      <table className="min-w-full border border-blue-400">
        <thead>
          <tr className="bg-blue-100">
            <th
              className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
              onClick={() => sortServices(currentServices, "description")}
            >
              Rodzaj usługi {renderSortArrows("description")}
            </th>
            <th
              className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
              onClick={() => sortServices(currentServices, "garage")}
            >
              Warsztat {renderSortArrows("garage")}
            </th>
            <th
              className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
              onClick={() => sortServices(currentServices, "createdAt")}
            >
              Data zgłoszenia {renderSortArrows("createdAt")}
            </th>
            <th className="px-4 py-2 border border-blue-400 text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {currentServices.map((service) => (
            <tr key={service.id} className="hover:bg-blue-100 transition-colors">
              <td className="px-4 py-2 border border-blue-400">{service.description}</td>
              <td className="px-4 py-2 border border-blue-400">{service.garage.companyName}</td>
              <td className="px-4 py-2 border border-blue-400">{formatDate(service.createdAt)}</td>
              <td className="px-4 py-2 border border-blue-400">{translateStatus(service.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lista Zgłoszeń</h1>

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
          {cars.map((car) => (
            <option key={car.id} value={car.registrationNumber}>
              {car.registrationNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Current Services Table */}
      {renderTable()}
    </div>
  );
}
