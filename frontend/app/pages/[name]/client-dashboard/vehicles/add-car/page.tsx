'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCarForm() {
  const router = useRouter();

  // Stan formularza
  const [formData, setFormData] = useState({
    vin: '',
    plateNumber: '',
    make: '',
    model: '',
    modelYear: '',
    series: '',
    engineDisplacement: '',
    enginePower: '',
    fuelType: '',
    engineCode: '',
    driveType: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken'); // Pobierz token z localStorage
    if (!token) {
      alert('Brak tokena autoryzacji!');
      return;
    }

    // Przygotowanie danych w odpowiednim formacie
    const data = {
      vin: formData.vin,
      registrationNumber: formData.plateNumber,
      brand: formData.make,
      model: formData.model,
      modelYear: formData.modelYear,
      productionYear: formData.modelYear, // Jeśli productionYear jest równy modelYear
      generation: formData.series,
      engineCapacity: formData.engineDisplacement,
      enginePower: formData.enginePower,
      fuelType: formData.fuelType,
      engineCode: formData.engineCode,
      driveType: formData.driveType,
    };

    try {
      const response = await fetch('/api/vehicle/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Dodanie tokena Bearer
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Samochód został dodany!');
        router.back(); // Opcjonalnie przekierowanie
      } else {
        throw new Error('Błąd podczas dodawania samochodu');
      }
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Wystąpił błąd przy dodawaniu samochodu');
    }
  };

  // Funkcja do wypełniania formularza na podstawie odpowiedzi z API
  const handleDecodeVin = async () => {
    const vin = formData.vin; // Pobranie numeru VIN z formularza
    const token = localStorage.getItem('accessToken'); // Załóżmy, że token jest w localStorage
    if (vin) {
      try {
        const response = await fetch(`/api/vehicle/decode-info/${vin}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Dodanie tokena Bearer
          },
        });
        if (!response.ok) {
          throw new Error('Błąd podczas dekodowania VIN');
        }
        const data = await response.json();

        // Mapowanie odpowiedzi z API na dane formularza
        const decodedData = data.decode.reduce((acc: any, item: any) => {
          switch (item.label) {
            case 'Make':
              acc.make = item.value;
              break;
            case 'Model':
              acc.model = item.value;
              break;
            case 'Model Year':
              acc.modelYear = item.value;
              break;
            case 'Series':
              acc.series = item.value;
              break;
            case 'Engine Displacement (ccm)':
              acc.engineDisplacement = item.value;
              break;
            case 'Engine Power (HP)':
              acc.enginePower = item.value;
              break;
            case 'Fuel Type - Primary':
              acc.fuelType = item.value;
              break;
            case 'Engine Code':
              acc.engineCode = item.value;
              break;
            case 'Drive':
              acc.driveType = item.value;
              break;
            default:
              break;
          }
          return acc;
        }, {});

        // Aktualizacja stanu formularza
        setFormData((prevState) => ({
          ...prevState,
          ...decodedData,
        }));
      } catch (error) {
        console.error('Error decoding VIN:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-lg shadow-xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dodaj Samochód
        </h2>

        {/* Numer VIN */}
        <div className="mb-6">
          <label
            htmlFor="vin"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Numer VIN
          </label>
          <input
            type="text"
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
            required
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz numer VIN"
          />
        </div>

        {/* Przycisk Dekodowania VIN */}
        <button
          type="button"
          onClick={handleDecodeVin}
          className="w-full bg-green-500 text-white py-3 text-lg rounded hover:bg-green-600 transition mb-6"
        >
          Dekoduj VIN
        </button>

        {/* Numer tablicy rejestracyjnej */}
        <div className="mb-6">
          <label
            htmlFor="plateNumber"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Numer tablicy rejestracyjnej
          </label>
          <input
            type="text"
            id="plateNumber"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
            required
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz numer tablicy rejestracyjnej"
          />
        </div>

        {/* Marka */}
        <div className="mb-6">
          <label
            htmlFor="make"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Marka
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz markę"
          />
        </div>

        {/* Model */}
        <div className="mb-6">
          <label
            htmlFor="model"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz model"
          />
        </div>

        {/* Rok modelowy */}
        <div className="mb-6">
          <label
            htmlFor="modelYear"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Rok modelowy
          </label>
          <input
            type="text"
            id="modelYear"
            name="modelYear"
            value={formData.modelYear}
            onChange={(e) => setFormData({ ...formData, modelYear: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz rok modelowy"
          />
        </div>

        {/* Generacja */}
        <div className="mb-6">
          <label
            htmlFor="series"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Generacja (Series)
          </label>
          <input
            type="text"
            id="series"
            name="series"
            value={formData.series}
            onChange={(e) => setFormData({ ...formData, series: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz generację"
          />
        </div>

        {/* Pojemność silnika */}
        <div className="mb-6">
          <label
            htmlFor="engineDisplacement"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Pojemność silnika (ccm)
          </label>
          <input
            type="text"
            id="engineDisplacement"
            name="engineDisplacement"
            value={formData.engineDisplacement}
            onChange={(e) => setFormData({ ...formData, engineDisplacement: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz pojemność silnika"
          />
        </div>

        {/* Moc silnika w KM */}
        <div className="mb-6">
          <label
            htmlFor="enginePower"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Moc silnika (KM)
          </label>
          <input
            type="text"
            id="enginePower"
            name="enginePower"
            value={formData.enginePower}
            onChange={(e) => setFormData({ ...formData, enginePower: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz moc silnika"
          />
        </div>

        {/* Typ paliwa */}
        <div className="mb-6">
          <label
            htmlFor="fuelType"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Typ paliwa
          </label>
          <input
            type="text"
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz typ paliwa"
          />
        </div>

        {/* Kod silnika */}
        <div className="mb-6">
          <label
            htmlFor="engineCode"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Kod silnika
          </label>
          <input
            type="text"
            id="engineCode"
            name="engineCode"
            value={formData.engineCode}
            onChange={(e) => setFormData({ ...formData, engineCode: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz kod silnika"
          />
        </div>

        {/* Rodzaj napędu */}
        <div className="mb-6">
          <label
            htmlFor="driveType"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Rodzaj napędu
          </label>
          <input
            type="text"
            id="driveType"
            name="driveType"
            value={formData.driveType}
            onChange={(e) => setFormData({ ...formData, driveType: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz rodzaj napędu"
          />
        </div>

        {/* Przycisk dodawania samochodu */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 text-lg rounded hover:bg-blue-600 transition mt-4"
        >
          Dodaj samochód
        </button>
      </form>
    </div>
  );
}
