'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkshopSearch() {
  const [carBrand, setCarBrand] = useState('');
  const [service, setService] = useState('');
  const [city, setCity] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [isOrderEnabled, setIsOrderEnabled] = useState(false);
  const router = useRouter();

  const workshops = [
    { name: 'U Pana Rysia Zawsze Śmiga', address: 'Warszawa, ul. Mechaników 12', cost: '150 PLN', services: ['Wymiana opon', 'Przegląd'], brands: ['BMW'], city: 'Warszawa' },
    { name: 'Auto Naprawa Max', address: 'Warszawa, ul. Długa 8', cost: '200 PLN', services: ['Wymiana oleju', 'Konsultacja ogólna'], brands: ['BMW', 'Audi'], city: 'Warszawa' },
    { name: 'Warsztat ABC', address: 'Kraków, ul. Krótka 3', cost: '100 PLN', services: ['Wymiana opon', 'Przegląd'], brands: ['Toyota', 'BMW'], city: 'Kraków' },
  ];

  useEffect(() => {
    // Pobranie informacji o roli użytkownika z local storage
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token || role !== 'ROLE_CLIENT') {
      // Jeśli brak tokenu lub rola nie jest ROLE_CLIENT, przekierowanie na stronę logowania
      router.push('/');
    }
  }, [router]);

  const filteredWorkshops = React.useMemo(() => {
    return workshops.filter(
      (workshop) =>
        (!city || workshop.city === city) &&
        (!service || workshop.services.includes(service)) &&
        (!carBrand || workshop.brands.includes(carBrand))
    );
  }, [carBrand, service, city]);

  const handleRowClick = (workshopName: string) => {
    setSelectedWorkshop(workshopName);
    setIsOrderEnabled(true);
  };

  const resetSelectedWorkshop = () => {
    setSelectedWorkshop('');
    setIsOrderEnabled(false);
  };

  const handleCarBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCarBrand(e.target.value);
    resetSelectedWorkshop();
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setService(e.target.value);
    resetSelectedWorkshop();
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    resetSelectedWorkshop();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8">Znajdź warsztat samochodowy</h1>
      <div className="flex space-x-8">
        {/* Formularz */}
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Marka samochodu</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={carBrand}
              onChange={handleCarBrandChange}
            >
              <option value="">Wybierz</option>
              <option value="BMW">BMW</option>
              <option value="Toyota">Toyota</option>
              <option value="Audi">Audi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Usługa</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={service}
              onChange={handleServiceChange}
            >
              <option value="">Wybierz</option>
              <option value="Wymiana opon">Wymiana opon</option>
              <option value="Wymiana oleju">Wymiana oleju</option>
              <option value="Przegląd">Przegląd</option>
              <option value="Konsultacja ogólna">Konsultacja ogólna</option>
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
            <label className="block text-sm font-bold mb-2">Wybrany warsztat</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={selectedWorkshop}
              readOnly
            />
          </div>
        </div>

        {/* Tabela */}
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
                  Szacowany koszt
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

      {/* Przycisk Zamów */}
      <button
        className={`mt-8 px-8 py-2 text-white font-bold rounded ${isOrderEnabled ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
        disabled={!isOrderEnabled}
      >
        Zamów
      </button>
    </div>
  );
}
