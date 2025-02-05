'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Funkcja zamieniająca polskie znaki na odpowiedniki bez diakrytyków
function replacePolishCharacters(text: string): string {
  const map: { [key: string]: string } = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
  };
  return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, char => map[char] || char);
}

type StatusType = 'NEW' | 'IN_PROGRESS' | 'COMPLETED';

interface Garage {
  id: number;
  nip: string;
  regon: string;
  companyName: string;
  address: any; // Może być string lub obiekt (np. { street, city, postalCode })
  phoneNumber: string;
  ibans: string[];
  userId: number;
  userName: string;
}

// Dodajemy nowe pole "amounts" (ceny netto) do interfejsu ServiceRequest
interface ServiceRequest {
  id: number;
  dateHistory: string[];
  garage: Garage;
  status: StatusType;
  operations: any[]; // Tablica stringów lub obiektów
  amounts: number[];   // Nowe pole: ceny netto dla operacji
  operationDates: string[];
  vehicleId: number;
  userId: number;
  userName: string;
  description: string;
  car?: string;        // nazwa/krótki opis pojazdu
  userEmail?: string;  // email użytkownika
  
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
}

interface UserInfo {
  id: number;
  email: string;
  phoneNumber?: string;
}

export default function GarageDashboardEdit() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Upewniamy się, że jesteśmy po stronie klienta
  useEffect(() => {
    setIsClient(true);
    setUsername(localStorage.getItem('username'));
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!token || !username || !role) {
      router.push('/pages/auth/login');
      return;
    }
    if (role !== 'ROLE_GARAGE') {
      router.push('/pages/auth/login');
      return;
    }

    fetchServiceRequests(token);
  }, [router, isClient, username]);

  /**
   * Pobiera wszystkie zgłoszenia (raporty) oraz do każdego dociąga:
   * 1) informacje o pojeździe (car)
   * 2) informacje o użytkowniku (email)
   */
  const fetchServiceRequests = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      // Pobieramy zgłoszenia
      const response = await fetch('/api/report/garage/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Błąd pobierania zleceń. Status: ${response.status}`);
      }

      const data: ServiceRequest[] = await response.json();
      const uniqueUserIds = [...new Set(data.map((req) => req.userId))];

      // -- MAPA pojazdów (userId -> Vehicle[])
      const vehiclesMap = new Map<number, Vehicle[]>();
      const fetchVehiclesPromises = uniqueUserIds.map(async (userId) => {
        const res = await fetch(`/api/client/vehicle/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.warn(`Błąd pobierania pojazdów dla userId = ${userId}`);
          vehiclesMap.set(userId, []);
          return;
        }
        const userVehicles: Vehicle[] = await res.json();
        vehiclesMap.set(userId, userVehicles);
      });

      // -- MAPA użytkowników (userId -> UserInfo)
      const usersMap = new Map<number, UserInfo>();
      const fetchUserInfoPromises = uniqueUserIds.map(async (userId) => {
        const res = await fetch(`/api/client/user/info/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.warn(`Błąd pobierania info o userId = ${userId}`);
          usersMap.set(userId, { id: userId, email: 'brak danych', phoneNumber: 'brak danych' });
          return;
        }
        const userInfo: UserInfo = await res.json();
        usersMap.set(userId, userInfo);
      });

      await Promise.all([...fetchVehiclesPromises, ...fetchUserInfoPromises]);

      const requestsWithCarAndEmail = data.map((request) => {
        // Pojazd
        const userVehicles = vehiclesMap.get(request.userId) || [];
        const foundVehicle = userVehicles.find((v) => v.id === request.vehicleId);
        let carInfo = 'Nie znaleziono pojazdu';
        if (foundVehicle) {
          carInfo = `${foundVehicle.brand} ${foundVehicle.model}`;
        }

        // Użytkownik
        const foundUser = usersMap.get(request.userId);
        const userEmail = foundUser ? foundUser.email : 'brak e-maila';

        return {
          ...request,
          car: carInfo,
          userEmail: userEmail,
        };
      });

      setRequests(requestsWithCarAndEmail);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd podczas pobierania zleceń.');
    } finally {
      setLoading(false);
    }
  };

  // Funkcja generująca PDF z raportem dla danego zgłoszenia
  const handlePdfReport = (requestId: number) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    const reportNumber = `${request.id}`;

    // Dane sprzedawcy (warsztatu) – zamieniamy polskie znaki
    const sellerName = replacePolishCharacters(String(request.garage.companyName));
    let sellerAddress: string;
    if (typeof request.garage.address === 'object' && request.garage.address !== null) {
      const addr = request.garage.address;
      sellerAddress = replacePolishCharacters(`${addr.street || ''}, ${addr.city || ''} ${addr.postalCode || ''}`);
    } else {
      sellerAddress = replacePolishCharacters(String(request.garage.address));
    }
    const sellerPhone = replacePolishCharacters(String(request.garage.phoneNumber));
    const sellerNip = replacePolishCharacters(String(request.garage.nip));

    // Dane nabywcy (klienta)
    const clientName = replacePolishCharacters(String(request.userName));
    const clientEmail = replacePolishCharacters(String(request.userEmail || 'brak danych'));

    // Jeśli mamy ceny netto w request.amounts, to dla każdej operacji pobieramy odpowiednią wartość.
    // Zakładamy, że request.operations i request.amounts mają tę samą długość.
    const vatRate = 0.23;

    const serviceRows: Array<Array<string>> = [];
    let totalNet = 0, totalVAT = 0, totalGross = 0;

    if (request.operations && request.operations.length > 0 && request.amounts && request.amounts.length > 0) {
      request.operations.forEach((op, index) => {
        let opText =
          typeof op === 'object'
            ? (op.name ? String(op.name) : JSON.stringify(op))
            : String(op);
        opText = replacePolishCharacters(opText);

        // Pobieramy cenę netto dla tej operacji; jeśli nie ma, domyślnie 100
        const netPrice = request.amounts[index] !== undefined ? request.amounts[index] : 0;
        const vatAmount = netPrice * vatRate;
        const grossPrice = netPrice + vatAmount;
        totalNet += netPrice;
        totalVAT += vatAmount;
        totalGross += grossPrice;

        serviceRows.push([
          opText,
          netPrice.toFixed(2),
          '23%',
          vatAmount.toFixed(2),
          grossPrice.toFixed(2),
        ]);
      });
    } else {
      // Jeśli nie ma operacji lub amounts, używamy domyślnej wartości 0
      const netPrice = 0;
      const vatAmount = netPrice * vatRate;
      const grossPrice = netPrice + vatAmount;
      totalNet = netPrice;
      totalVAT = vatAmount;
      totalGross = grossPrice;
      serviceRows.push([
        replacePolishCharacters(String(request.description)),
        netPrice.toFixed(2),
        '23%',
        vatAmount.toFixed(2),
        grossPrice.toFixed(2),
      ]);
    }

    const doc = new jsPDF();
    let y = 20;
    doc.setFont("Times", "normal");

    doc.setFontSize(18);
    doc.text(replacePolishCharacters('Raport z usług'), 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(replacePolishCharacters(`Raport nr: ${reportNumber}`), 14, y);
    doc.text(replacePolishCharacters(`Data wystawienia: ${new Date().toLocaleDateString('pl-PL')}`), 130, y);
    y += 10;

    // Dane sprzedawcy
    doc.setFontSize(11);
    doc.text(replacePolishCharacters('Wykonawca:'), 14, y);
    y += 6;
    doc.text(sellerName, 14, y);
    y += 6;
    doc.text(sellerAddress, 14, y);
    y += 6;
    doc.text(replacePolishCharacters(`Telefon: ${sellerPhone}`), 14, y);
    y += 6;
    doc.text(replacePolishCharacters(`NIP: ${sellerNip}`), 14, y);
    y += 10;

    // Dane nabywcy
    doc.text(replacePolishCharacters('Nabywca:'), 14, y);
    y += 6;
    doc.text(clientName, 14, y);
    y += 6;
    doc.text(clientEmail, 14, y);
    y += 10;

    // Tabelka z pozycjami raportu – szerokość komórek automatyczna, tekst nie jest zawijany
    autoTable(doc, {
      startY: y,
      head: [['Usluga', 'Kwota netto', 'VAT', 'Kwota VAT', 'Kwota brutto']],
      body: serviceRows,
      theme: 'grid',
      headStyles: { fillColor: [220, 220, 220] },
      styles: {
        cellPadding: 2,
        cellWidth: 'auto',
        overflow: 'visible'
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || y;
    doc.text(replacePolishCharacters('Razem:'), 14, finalY + 10);
    doc.text(replacePolishCharacters(`Kwota netto: ${totalNet.toFixed(2)} PLN`), 14, finalY + 16);
    doc.text(replacePolishCharacters(`Kwota VAT: ${totalVAT.toFixed(2)} PLN`), 14, finalY + 22);
    doc.text(replacePolishCharacters(`Kwota brutto: ${totalGross.toFixed(2)} PLN`), 14, finalY + 28);

    doc.save(`Raport_${reportNumber}.pdf`);
  };

  const getEarliestDate = (dates: string[]): string => {
    if (!dates || dates.length === 0) return '';
    const sorted = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return new Date(sorted[0]).toLocaleString('pl-PL'); 
  };

  const getLatestDate = (dates: string[]): string => {
    if (!dates || dates.length === 0) return '';
    const sorted = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return new Date(sorted[sorted.length - 1]).toLocaleString('pl-PL');
  };

  if (!isClient) {
    return null;
  }

  const completedRequests = requests.filter((req) => req.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Zakończone zlecenia</h1>
      {loading && <p className="text-blue-500">Ładowanie zgłoszeń...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded mb-4 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Klient</th>
              <th className="px-4 py-2 border">E-mail klienta</th>
              <th className="px-4 py-2 border">Samochód</th>
              <th className="px-4 py-2 border">Zgłoszona usługa</th>
              <th className="px-4 py-2 border">Data rozpoczęcia</th>
              <th className="px-4 py-2 border">Data zakończenia</th>
              <th className="px-4 py-2 border">Raport PDF</th>
            </tr>
          </thead>
          <tbody>
            {completedRequests.length > 0 ? (
              completedRequests.map((request) => {
                const earliestDate = getEarliestDate(request.dateHistory);
                const latestDate = getLatestDate(request.dateHistory);

                return (
                  <tr key={request.id} className="text-center">
                    <td className="px-4 py-2 border">{request.id}</td>
                    <td className="px-4 py-2 border">{replacePolishCharacters(request.userName)}</td>
                    <td className="px-4 py-2 border">{replacePolishCharacters(request.userEmail || '')}</td>
                    <td className="px-4 py-2 border">{replacePolishCharacters(request.car || '')}</td>
                    <td className="px-4 py-2 border">{replacePolishCharacters(request.description)}</td>
                    <td className="px-4 py-2 border">{earliestDate}</td>
                    <td className="px-4 py-2 border">{latestDate}</td>
                    <td className="px-4 py-2 border">
                      <img
                        src="/PDF.png"
                        alt="PDF icon"
                        className="w-6 h-6 inline-block cursor-pointer"
                        onClick={() => handlePdfReport(request.id)}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-2 border text-center text-sm text-gray-500">
                  Brak zakończonych zgłoszeń do wyświetlenia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
