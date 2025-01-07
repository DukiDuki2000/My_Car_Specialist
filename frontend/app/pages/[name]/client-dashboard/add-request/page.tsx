'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Car {
  id: number;
  brand: string;
  model: string;
  registrationNumber: string;
}

interface Workshop {
  name: string;
  address: string;
}

export default function WorkshopSearch() {
  const router = useRouter();

  // ------------------------------------------------------
  // 1. Sprawdzenie autoryzacji (rola, token) w localStorage
  // ------------------------------------------------------
  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('accessToken');

    if (!token || role !== 'ROLE_CLIENT') {
      router.push('/');
    }
  }, [router]);

  // ------------------------------------------------------
  // 2. Stan aplikacji
  // ------------------------------------------------------
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>('');
  const [opis, setOpis] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  
  // ------------------------------------------------------
  // 3. Pobieranie samochodów użytkownika z API
  // ------------------------------------------------------
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem('accessToken');
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
    },
    {
      name: 'Auto Naprawa Max',
      address: 'Warszawa, ul. Długa 8',
    },
    {
      name: 'Warsztat ABC',
      address: 'Kraków, ul. Krótka 3',
    },
    // Dodaj więcej warsztatów tutaj, jeśli potrzebujesz
  ];

  // ------------------------------------------------------
  // 5. Event handlery
  // ------------------------------------------------------
  const handleSelectedCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCar(e.target.value);
  };

  const handleOpisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOpis(e.target.value);
  };

  const handleRowClick = (workshopName: string) => {
    setSelectedWorkshop(workshopName);
  };

  const isFormComplete =
    selectedCar && opis && selectedWorkshop;

  const handleSend = () => {
    // Implementuj logikę wysyłania formularza tutaj
    console.log('Formularz wysłany:', {
      selectedCar,
      opis,
      selectedWorkshop,
    });
    // Przykładowo, możesz przekierować użytkownika lub pokazać powiadomienie
  };

  // ------------------------------------------------------
  // 6. Render komponentu
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8">Znajdź warsztat samochodowy</h1>

      <div className="flex space-x-8 w-full max-w-4xl">
        <div className="flex flex-col space-y-4 w-1/2">
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
                  {car.registrationNumber} - {car.brand} {car.model} 
                </option>
              ))}
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
              </tr>
            </thead>
            <tbody>
              {workshops.map((workshop) => (
                <tr
                  key={workshop.name}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    selectedWorkshop === workshop.name ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => handleRowClick(workshop.name)}
                >
                  <td className="px-4 py-2">{workshop.name}</td>
                  <td className="px-4 py-2">{workshop.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Przycisk Wyślij */}
      <div className="mt-8">
        <button
          className={`px-6 py-2 rounded ${
            isFormComplete
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-700 cursor-not-allowed'
          }`}
          disabled={!isFormComplete}
          onClick={handleSend}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}
