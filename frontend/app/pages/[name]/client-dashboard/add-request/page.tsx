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

  // Lista samochodów pobrana z API (tutaj przykładowo na sztywno)
  const [userCars, setUserCars] = useState<Car[]>([]);

  // Wybrany samochód (z listy userCars)
  const [selectedCar, setSelectedCar] = useState<string>('');

  // Usługa i miejscowość
  const [service, setService] = useState('');
  const [city, setCity] = useState('');

  // Opis usługi (textarea)
  const [opis, setOpis] = useState('');

  // Wybrany warsztat
  const [selectedWorkshop, setSelectedWorkshop] = useState('');

  // ------------------------------------------------------
  // 3. Pobieranie samochodów użytkownika z API (lub localStorage)
  // ------------------------------------------------------
  useEffect(() => {
    // Tu możesz zrobić np. fetch do /api/user-cars, a na razie wstawiamy przykładowe dane
    const exampleCars: Car[] = [
      { id: 1, brand: 'BMW', model: '3 Series', regNumber: 'XYZ 12345' },
      { id: 2, brand: 'Audi', model: 'A4', regNumber: 'ABC 67890' },
    ];
    setUserCars(exampleCars);
  }, []);

  // ------------------------------------------------------
  // 4. Lista warsztatów (przykładowe dane)
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

  // ------------------------------------------------------
  // 5. Filtrowanie warsztatów (po miejscowości)
  // ------------------------------------------------------
  const filteredWorkshops = workshops.filter((workshop) => workshop.city === city);

  // ------------------------------------------------------
  // 6. Event handlery
  // ------------------------------------------------------

  // Kliknięcie w wiersz warsztatu
  const handleRowClick = (workshopName: string) => {
    setSelectedWorkshop(workshopName);
  };

  // Reset wybranego warsztatu przy zmianie pól
  const resetSelectedWorkshop = () => {
    setSelectedWorkshop('');
  };

  // Wybrany samochód z listy
  const handleSelectedCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCar(e.target.value);
    resetSelectedWorkshop();
  };

  // Usługa
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setService(e.target.value);
    resetSelectedWorkshop();
  };

  // Miejscowość
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    resetSelectedWorkshop();
  };

  // Opis usługi
  const handleOpisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOpis(e.target.value);
  };

  // ------------------------------------------------------
  // 7. Walidacja kompletności formularza
  // ------------------------------------------------------
  const isFormComplete =
    selectedCar.trim() !== '' &&
    city.trim() !== '' &&
    opis.trim() !== '' &&
    selectedWorkshop.trim() !== '';

  // Klasy CSS do przycisku w zależności od walidacji
  const orderButtonClasses = isFormComplete
    ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
    : 'bg-gray-400 cursor-not-allowed';

  // ------------------------------------------------------
  // 8. Render komponentu
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8">Znajdź warsztat samochodowy</h1>

      <div className="flex space-x-8">
        {/* -------------------------------------------------- */}
        {/*                   LEWA KOLUMNA                     */}
        {/* -------------------------------------------------- */}
        <div className="flex flex-col space-y-4">
          {/* LISTA SAMOCHODÓW UŻYTKOWNIKA */}
          <div>
            <label className="block text-sm font-bold mb-2">Wybierz jeden ze swoich samochodów</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={selectedCar}
              onChange={handleSelectedCarChange}
            >
              <option value="">Wybierz</option>
              {userCars.map((car) => (
                <option key={car.id} value={String(car.id)}>
                  {car.brand} {car.model} – {car.regNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Miejscowość */}
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

          {/* Opis usługi (textarea) */}
          <div>
            <label className="block text-sm font-bold mb-2">Opis usługi</label>
            <textarea
              className="w-full border border-gray-300 rounded px-4 py-2"
              rows={4}
              value={opis}
              onChange={handleOpisChange}
              placeholder="Wpisz, czego oczekujesz od warsztatu..."
            />
          </div>

          {/* Wybrany warsztat (readonly) */}
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

        {/* -------------------------------------------------- */}
        {/*                  PRAWA KOLUMNA                     */}
        {/* -------------------------------------------------- */}
        <div className="w-1/2 bg-white p-4 rounded shadow-md">
          <table className="w-full border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-800">
                  Nazwa warsztatu
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-800">
                  Adres
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-800">
                  Koszt
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkshops.length > 0 ? (
                filteredWorkshops.map((workshop) => (
                  <tr
                    key={workshop.name}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(workshop.name)}
                  >
                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-800">
                      {workshop.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-800">
                      {workshop.address}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-800">
                      {workshop.cost}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-2 border border-gray-300 text-center text-sm text-gray-500"
                  >
                    Brak wyników
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* Przycisk "Zamów" - aktywny jeśli isFormComplete = true */}
      {/* -------------------------------------------------- */}
      <button
        className={`mt-8 px-8 py-2 text-white font-bold rounded ${orderButtonClasses}`}
        disabled={!isFormComplete}
        onClick={() => {
          // Tutaj możesz wykonać np. wywołanie fetch/axios
          // wysyłające dane do backendu.
          alert('Twoje zamówienie zostało złożone!');
        }}
      >
        Zamów
      </button>
    </div>
  );
}