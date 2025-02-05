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
  id: number;
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
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null); 
  const [workshops, setWorkshops] = useState<Workshop[]>([]); 

  // Nowe stany dla wyszukiwania po mieście
  const [city, setCity] = useState('');           // miasto wpisane przez użytkownika
  const [hasSearched, setHasSearched] = useState(false); // flaga, czy dokonano wyszukiwania

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
  // 4. Wyszukiwanie warsztatów na podstawie miasta
  //    (zamiast pobierania wszystkich warsztatów)
  // ------------------------------------------------------
  const handleSearchWorkshops = async () => {
    // Ustawiamy flagę, że użytkownik spróbował wyszukać warsztaty
    setHasSearched(true);

    try {
      const token = localStorage.getItem('accessToken');
      // Konwertujemy miasto na wielkie litery zgodnie z wymaganiem
      const uppercaseCity = city.toUpperCase().trim();

      const response = await fetch(`/api/garage/all/byCity/${uppercaseCity}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać warsztatów dla miasta ' + uppercaseCity);
      }

      const data = await response.json();
      const formattedWorkshops: Workshop[] = data.map((workshop: any) => ({
        id: workshop.id,
        name: workshop.companyName,
        address: `${workshop.address.street}, ${workshop.address.city} ${workshop.address.postalCode}`,
      }));

      setWorkshops(formattedWorkshops);
    } catch (err) {
      console.error(err);
      // W przypadku błędu czyszczę listę warsztatów, aby w tabeli nic się nie pokazywało
      setWorkshops([]);
    }
  };

  // ------------------------------------------------------
  // 5. Event handlery
  // ------------------------------------------------------
  const handleSelectedCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCar(e.target.value);
  };

  const handleOpisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOpis(e.target.value);
  };

  const handleRowClick = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
  };

  const isFormComplete = selectedCar && opis && selectedWorkshop;

  const handleSend = async () => {
    const data = {
      garage: {
        id: selectedWorkshop?.id,
      },
      vehicleId: Number(selectedCar),
      description: opis,
    };

    console.group('Dane do wysłania');
    console.log(JSON.stringify(data, null, 2));
    console.groupEnd();

    // Logika wysyłania danych do API
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/client/create-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Dane zostały pomyślnie wysłane.');
        router.back(); 
      } else {
        console.error('Wystąpił błąd podczas wysyłania danych:', response.status);
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania danych:', error);
    }
  };

  // ------------------------------------------------------
  // 6. Render komponentu
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8">Znajdź warsztat samochodowy</h1>

      <div className="flex space-x-8 w-full max-w-4xl">
        <div className="flex flex-col space-y-4 w-1/2">
          {/* Wybór samochodu */}
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

          {/* Opis usługi */}
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

          {/* Pole z wybranym warsztatem */}
          <div>
            <label className="block text-sm font-bold mb-2">Wybrany warsztat</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={selectedWorkshop ? `${selectedWorkshop.name} (ID: ${selectedWorkshop.id})` : ''}
              readOnly
            />
          </div>
        </div>

        <div className="w-1/2 bg-white p-4 rounded shadow-md">
          {/* Pole tekstowe na miasto i przycisk szukaj */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Wpisz miasto..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 rounded w-48 px-4 py-2 mr-2 flex-1"
            />
            <button
              onClick={handleSearchWorkshops}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Szukaj
            </button>
          </div>

          {/* Tabela z warsztatami */}
          <table className="w-full border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Nazwa</th>
                <th className="px-4 py-2">Adres</th>
              </tr>
            </thead>
            <tbody>
              {/* Jeśli użytkownik kliknął „Szukaj” i nic nie przyszło z API, wyświetlamy komunikat */}
              {hasSearched && workshops.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-center">
                    Brak warsztatów dla podanego miasta
                  </td>
                </tr>
              ) : (
                workshops.map((workshop) => (
                  <tr
                    key={workshop.id}
                    className={`hover:bg-gray-100 cursor-pointer ${
                      selectedWorkshop?.id === workshop.id ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleRowClick(workshop)}
                  >
                    <td className="px-4 py-2">{workshop.name}</td>
                    <td className="px-4 py-2">{workshop.address}</td>
                  </tr>
                ))
              )}
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
