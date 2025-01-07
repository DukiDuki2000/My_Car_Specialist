'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

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
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [cars, setCars] = useState<string[]>([]);
  const [currentServices, setCurrentServices] = useState<Service[]>([]);
  const [currentSortConfig, setCurrentSortConfig] = useState<{ key: keyof Service; direction: "ascending" | "descending" } | null>(null);

  useEffect(() => {
    // Sprawdzanie, czy użytkownik jest zalogowany
    const token = localStorage.getItem("token");
  
    if (!token) {
      router.push("/");
      return;
    }
  
    // Pobieranie listy pojazdów przypisanych do użytkownika
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
          }[] = await response.json(); // Dostosowanie do struktury obiektu
      
          // Przetwarzanie danych: tworzysz tablicę stringów do wyświetlenia w liście
          const carList = data.map(
            (car) =>
              `${car.registrationNumber} - ${car.brand} ${car.model} `
          );
      
          setCars(carList);
      
          // Ustaw pierwszy samochód jako domyślnie wybrany, jeśli jeszcze nie ustawiono
          if (carList.length > 0 && !selectedCar) {
            setSelectedCar(carList[0]);
          }
        } catch (error) {
          console.error("Error fetching user cars:", error);
          router.push("/");
        }
      };
      
  
    fetchUserCars();
  }, [router, selectedCar]);
  

  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const car = e.target.value;
    setSelectedCar(car);
    // fetchServicesForCar(car);
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

  const renderTable = () => (
    <table className="min-w-full border border-blue-400">
      <thead>
        <tr className="bg-blue-100">
          <th
            className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
            onClick={() => sortServices(currentServices, "type")}
          >
            Rodzaj usługi {renderSortArrows("type")}
          </th>
          <th
            className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
            onClick={() => sortServices(currentServices, "cost")}
          >
            Koszt {renderSortArrows("cost")}
          </th>
          <th
            className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
            onClick={() => sortServices(currentServices, "workshop")}
          >
            Warsztat {renderSortArrows("workshop")}
          </th>
          <th
            className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
            onClick={() => sortServices(currentServices, "dateReported")}
          >
            Data zgłoszenia {renderSortArrows("dateReported")}
          </th>
        </tr>
      </thead>
      <tbody>
        {currentServices.map((service) => (
          <tr key={service.id} className="hover:bg-blue-100 transition-colors">
            <td className="px-4 py-2 border border-blue-400">{service.type}</td>
            <td className="px-4 py-2 border border-blue-400">{service.cost} zł</td>
            <td className="px-4 py-2 border border-blue-400">{service.workshop}</td>
            <td className="px-4 py-2 border border-blue-400">{service.dateReported}</td>
          </tr>
        ))}
      </tbody>
    </table>
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
            <option key={car} value={car}>
              {car}
            </option>
          ))}
        </select>
      </div>

      {/* Current Services Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Aktualne zgłoszenia serwisowe</h2>
        {renderTable()}
      </div>
    </div>
  );
}
