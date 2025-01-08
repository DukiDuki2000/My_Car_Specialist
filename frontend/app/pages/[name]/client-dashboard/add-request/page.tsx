'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Car {
  id: number;
  brand: string;
  model: string;
  regNumber: string;
}

interface Workshop {
  name: string;
  address: string;
  cost: string;
  city: string;
}

export default function WorkshopSearch() {
  const router = useRouter();

  // ------------------------------------------------------
  // 1. Sprawdzenie autoryzacji (rola, token) w localStorage
  // ------------------------------------------------------
  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token || role !== 'ROLE_CLIENT') {
      router.push('/');
    }
  }, [router]);

  // ------------------------------------------------------
  // 2. Stan aplikacji
  // ------------------------------------------------------
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>('');
  const [service, setService] = useState('');
  const [city, setCity] = useState('');
  const [opis, setOpis] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);

  // ------------------------------------------------------
  // 3. Pobieranie samochodów użytkownika z API
  // ------------------------------------------------------
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/vehicle/search', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Nie udało się pobrać samochodów.');
        }
        const data: Car[] = await response.json();
        setUserCars(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCars();
  }, []);

  // ------------------------------------------------------
  // 4. Warsztaty (przykładowe dane)
  // ------------------------------------------------------
  const workshops: Workshop[] = [
    {
      name: 'U Pana Rysia Zawsze Śmiga',
      address: 'Warszawa, ul. Mechaników 12',
      cost: '150 PLN',
      city: 'Warszawa',
    },
    {
      name: 'Auto Naprawa Max',
      address: 'Warszawa, ul. Długa 8',
      cost: '200 PLN',
      city: 'Warszawa',
    },
    {
      name: 'Warsztat ABC',
      address: 'Kraków, ul. Krótka 3',
      cost: '100 PLN',
      city: 'Kraków',
    },
  ];

  useEffect(() => {
    const filtered = workshops.filter((workshop) => workshop.city === city);
    setFilteredWorkshops(filtered);
  }, [city]);

  // ------------------------------------------------------
  // 5. Event handlery
  // ------------------------------------------------------
  const handleSelectedCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCar(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
  };

  const handleOpisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOpis(e.target.value);
  };

  const handleRowClick = (workshopName: string) => {
    setSelectedWorkshop(workshopName);
  };

  const isFormComplete =
    selectedCar && city && opis && selectedWorkshop;

  // ------------------------------------------------------
  // 6. Render komponentu
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8">Znajdź warsztat samochodowy</h1>

      <div className="flex space-x-8">
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              Wybierz jeden ze swoich samochodów
            </label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={selectedCar}
              onChange={handleSelectedCarChange}
            >
              <option value="">Wybierz</option>
              {userCars.map((car) => (
                <option key={car.id} value={car.id.toString()}>
                  {car.brand} {car.model} – {car.regNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Miejscowość</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={city}
              onChange={handleCityChange}
            >
              <option value="">Wybierz</option>
              <option value="Warszawa">Warszawa</option>
              <option value="Kraków">Kraków</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Opis usługi</label>
            <textarea
              className="w-full border border-gray-300 rounded px-4 py-2"
              rows={4}
              value={opis}
              onChange={handleOpisChange}
              placeholder="Opisz problem lub usługę..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Wybrany warsztat</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={selectedWorkshop}
              readOnly
            />
          </div>
        </div>

        <div className="w-1/2 bg-white p-4 rounded shadow-md">
          <table className="w-full border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Nazwa</th>
                <th className="px-4 py-2">Adres</th>
                <th className="px-4 py-2">Koszt</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkshops.map((workshop) => (
                <tr
                  key={workshop.name}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(workshop.name)}
                >
                  <td className="px-4 py-2">{workshop.name}</td>
                  <td className="px-4 py-2">{workshop.address}</td>
                  <td className="px-4 py-2">{workshop.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
