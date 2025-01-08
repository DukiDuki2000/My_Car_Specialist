"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GarageData {
  companyName: string;
  nip: string;
  regon: string;
  address: string;
  phoneNumber: string;
  ibans: string[];
}

const GarageAddForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<GarageData>({
    companyName: '',
    nip: '',
    regon: '',
    address: '',
    phoneNumber: '',
    ibans: [''],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ustawia, że jesteśmy po stronie klienta
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Zatrzymaj, jeśli nie jesteśmy po stronie klienta

    // Sprawdzanie, czy użytkownik jest zalogowany
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (!token || !username || !role) {
      // Jeśli brakuje tokena, username lub roli, przekierowanie na stronę logowania
      router.push('/pages/auth/login');
      return;
    }

    if (role !== 'ROLE_MODERATOR') {
      // Przekierowanie, jeśli użytkownik nie jest moderatorem
      router.push('/pages/auth/login');
      return;
    }
  }, [router, isClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, index?: number) => {
    if (field === 'ibans' && index !== undefined) {
      const updatedIbans = [...formData.ibans];
      updatedIbans[index] = e.target.value;
      setFormData({ ...formData, ibans: updatedIbans });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleAddIban = () => {
    setFormData({ ...formData, ibans: [...formData.ibans, ''] });
  };

  const handleRemoveIban = (index: number) => {
    const updatedIbans = formData.ibans.filter((_, i) => i !== index);
    setFormData({ ...formData, ibans: updatedIbans });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Brak tokena autoryzacyjnego.');
      setLoading(false);
      return;
    }
  
    // Walidacja długości danych
    if (formData.companyName.length < 3 || formData.companyName.length > 100) {
      setError('Nazwa firmy musi mieć od 3 do 100 znaków.');
      setLoading(false);
      return;
    }
  
    if (formData.nip.length !== 10) {
      setError('NIP musi mieć dokładnie 10 znaków.');
      setLoading(false);
      return;
    }
  
    if (formData.regon.length !== 9) {
      setError('REGON musi mieć dokładnie 9 znaków.');
      setLoading(false);
      return;
    }
  
    if (formData.address.length < 10 || formData.address.length > 200) {
      setError('Adres musi mieć od 10 do 200 znaków.');
      setLoading(false);
      return;
    }
  
    if (formData.phoneNumber.length < 9 || formData.phoneNumber.length > 15) {
      setError('Numer telefonu musi mieć od 9 do 15 znaków.');
      setLoading(false);
      return;
    }
  
    if (formData.ibans.some(iban => iban.length < 15 || iban.length > 34)) {
      setError('Każdy numer IBAN musi mieć od 15 do 34 znaków.');
      setLoading(false);
      return;
    }
  
    // Wypisanie danych w konsoli przed wysłaniem
    console.log('Wysyłane dane:', JSON.stringify(formData));
  
    try {
      const response = await fetch('/api/mod/garage-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Błąd: ${response.statusText}, Szczegóły: ${JSON.stringify(errorData)}`);
      }
  
      setSuccess('Firma została pomyślnie dodana.');
      setFormData({
        companyName: '',
        nip: '',
        regon: '',
        address: '',
        phoneNumber: '',
        ibans: [''],
      });
    } catch (err: any) {
      setError(err.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Dodaj dane firmy</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <div className="mb-4">
          <label className="block font-medium mb-2">Nazwa firmy</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.companyName}
            onChange={(e) => handleInputChange(e, 'companyName')}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">NIP</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.nip}
            onChange={(e) => handleInputChange(e, 'nip')}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">REGON</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.regon}
            onChange={(e) => handleInputChange(e, 'regon')}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Adres</label>
          <textarea
            className="w-full p-2 border rounded"
            value={formData.address}
            onChange={(e) => handleInputChange(e, 'address')}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Numer telefonu</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange(e, 'phoneNumber')}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Numery IBAN</label>
          {formData.ibans.map((iban, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="w-full p-2 border rounded mr-2"
                value={iban}
                onChange={(e) => handleInputChange(e, 'ibans', index)}
              />
              {formData.ibans.length > 1 && (
                <button
                  type="button"
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => handleRemoveIban(index)}
                >
                  Usuń
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleAddIban}
          >
            Dodaj IBAN
          </button>
        </div>
        <button
          type="button"
          className="bg-green-500 text-white p-2 rounded w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Dodawanie...' : 'Dodaj firmę'}
        </button>
      </div>
    </div>
  );
};

export default GarageAddForm;
