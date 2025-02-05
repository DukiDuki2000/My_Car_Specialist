'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCarForm() {
  const router = useRouter();

  // Stan formularza
  const [formData, setFormData] = useState({
    nip: '',
    companyName: '',
    workingAddress: '',
    companyRegon: '',
    phoneNumber: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nip: formData.nip,
      regon: formData.companyRegon,
      companyName: formData.companyName,
      address: formData.workingAddress, // Używamy wartości workingAddress jako adresu
      phoneNumber: formData.phoneNumber,
      description: formData.description,
    };

    try {
      const response = await fetch('/api/garage-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('Zgłoszenie zostało pomyślnie wysłane!');
      router.push('/'); // Przekierowanie na stronę główną po udanym zgłoszeniu
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Wystąpił błąd podczas wysyłania zgłoszenia. Spróbuj ponownie później.');
    }
  };

  const handleDecodeNIP = async () => {
    const nip = formData.nip;
    if (nip) {
      try {
        const response = await fetch(`/api/nip-garage/${nip}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setFormData((prevState) => ({
          ...prevState,
          companyName: data.companyName || '',
          workingAddress: data.companyAddress || data.workingAddress || '',
          companyRegon: data.companyRegon || '',
        }));
      } catch (error) {
        console.error('Error decoding NIP:', error);
        alert('Wystąpił błąd podczas dekodowania NIP. Sprawdź poprawność danych.');
      }
    } else {
      alert('Proszę wprowadzić NIP.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-lg shadow-xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Wyślij prośbę o rejestrację
        </h2>

        {/* Numer NIP */}
        <div className="mb-6">
          <label
            htmlFor="nip"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Numer NIP
          </label>
          <input
            type="text"
            id="nip"
            name="nip"
            value={formData.nip}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
            required
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz numer NIP"
          />
        </div>

        {/* Przycisk Dekodowania NIP */}
        <button
          type="button"
          onClick={handleDecodeNIP}
          className="w-full bg-green-500 text-white py-3 text-lg rounded hover:bg-green-600 transition mb-6"
        >
          Uzupełnij dane z NIP
        </button>

        {/* Pozostałe pola formularza */}
        <div className="mb-6">
          <label
            htmlFor="companyName"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Nazwa firmy
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            required
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz nazwę firmy"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="workingAddress"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Adres firmy
          </label>
          <input
            type="text"
            id="workingAddress"
            name="workingAddress"
            value={formData.workingAddress}
            onChange={(e) =>
              setFormData({ ...formData, workingAddress: e.target.value })
            }
            required
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz adres firmy"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="companyRegon"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            REGON
          </label>
          <input
            type="text"
            id="companyRegon"
            name="companyRegon"
            value={formData.companyRegon}
            onChange={(e) =>
              setFormData({ ...formData, companyRegon: e.target.value })
            }
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz REGON"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="phoneNumber"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Numer telefonu
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz numer telefonu"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Opis
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 text-lg border border-blue-400 rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="Wpisz opis"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 text-lg rounded hover:bg-blue-600 transition mt-4"
        >
          Wyślij zgłoszenie
        </button>
      </form>
    </div>
  );
}
