'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// -- INTERFEJSY (tylko te najważniejsze) --
type StatusType = 'NEW' | 'IN_PROGRESS' | 'COMPLETED';

interface Address {
  street: string;
  city: string;
  postalCode: string;
}

interface Garage {
  id: number;
  nip: string;
  regon: string;
  companyName: string;
  address: Address | string; 
  phoneNumber: string;
  ibans: string[];
  userId: number;
  userName: string;
}

interface ServiceRequest {
  id: number;
  dateHistory: string[];
  garage: Garage;
  status: StatusType;
  operations: any[];   
  amounts: number[];   
  operationDates: string[];
  vehicleId: number;
  userId: number;
  userName: string;
  description: string;
  car?: string;
  /** Dodajemy to pole, żeby móc zapisać email z nowego API: */
  userEmail?: string;
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
}

/** Minimalna reprezentacja odpowiedzi z nowego API (SingleReportResponse) */
interface SingleReportResponse {
  report: any; // Możesz doprecyzować, jeśli chcesz
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// -- Pomocnicza funkcja do usuwania polskich znaków (używasz jej w PDF) --
function replacePolishCharacters(text: string): string {
  const map: { [key: string]: string } = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
  };
  return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (char) => map[char] || char);
}

export default function GarageDashboardEdit() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1) Sprawdzamy, czy to przeglądarka
  useEffect(() => {
    setIsClient(true);
    setUsername(localStorage.getItem('username'));
  }, []);

  // 2) Autoryzacja i pobranie danych
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

    // Główna funkcja ładująca
    fetchServiceRequests(token);
  }, [router, isClient, username]);

  /**
   * Pobieramy listę wszystkich zleceń (z `/api/report/garage/reports`),
   * a następnie dla każdego zlecenia odpytujemy nowe API
   * `GET /api/report/reports/:reportId`, żeby dostać `user.email`.
   *
   * Dodatkowo - jak dotychczas - pobieramy pojazdy (by zbudować "car").
   */
  const fetchServiceRequests = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      // -- 1. Pobierz listę wszystkich zleceń przypisanych do warsztatu
      const response = await fetch('/api/report/garage/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Błąd pobierania zleceń. Status: ${response.status}`);
      }

      const data: ServiceRequest[] = await response.json();

      // -- 2. Dla każdego zlecenia pobierz e-mail z nowego API
      //    (czyli GET /api/report/reports/:reportId -> { user: { email } })
      const requestsWithEmail = await Promise.all(
        data.map(async (req) => {
          try {
            const singleResp = await fetch(`/api/report/reports/${req.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (singleResp.ok) {
              const singleData: SingleReportResponse = await singleResp.json();
              // Z nowego API bierzemy user.email:
              req.userEmail = singleData.user.email;
            } else {
              console.warn(`Brak emaila z nowego API dla reportId=${req.id}.`);
            }
          } catch (err) {
            console.warn('Błąd pobierania emaila z nowego API:', err);
          }
          // zwracamy obiekt (req) – już z uzupełnionym userEmail
          return req;
        })
      );

      // -- 3. Dla każdego unikalnego userId pobierz pojazdy (aby ustawić "car")
      const uniqueUserIds = [...new Set(requestsWithEmail.map((r) => r.userId))];
      const vehiclesMap = new Map<number, Vehicle[]>();

      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const vRes = await fetch(`/api/client/vehicle/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!vRes.ok) {
              console.warn(`Błąd pobierania pojazdów userId=${userId}`);
              vehiclesMap.set(userId, []);
              return;
            }
            const userVehicles: Vehicle[] = await vRes.json();
            vehiclesMap.set(userId, userVehicles);
          } catch (vehErr) {
            console.warn('Błąd w fetchu pojazdów:', vehErr);
            vehiclesMap.set(userId, []);
          }
        })
      );

      // -- 4. Ustawiamy 'car' (brand + model) w zleceniach
      const finalRequests = requestsWithEmail.map((req) => {
        const userVehicles = vehiclesMap.get(req.userId) || [];
        const foundVehicle = userVehicles.find((v) => v.id === req.vehicleId);
        if (foundVehicle) {
          req.car = `${foundVehicle.brand} ${foundVehicle.model}`;
        } else {
          req.car = 'Nie znaleziono pojazdu';
        }
        return req;
      });

      setRequests(finalRequests);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd podczas pobierania zleceń.');
    } finally {
      setLoading(false);
    }
  };

  // -- Generowanie PDF -- (bez zmian w logice)
  const handlePdfReport = (requestId: number) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    const reportNumber = `${request.id}`;
    // Dane warsztatu (sprzedawcy):
    const sellerName = replacePolishCharacters(String(request.garage.companyName));
    let sellerAddress = '';
    if (typeof request.garage.address === 'object' && request.garage.address !== null) {
      const addr = request.garage.address;
      sellerAddress = replacePolishCharacters(
        `${addr.street || ''}, ${addr.city || ''} ${addr.postalCode || ''}`
      );
    } else {
      sellerAddress = replacePolishCharacters(String(request.garage.address));
    }
    const sellerPhone = replacePolishCharacters(String(request.garage.phoneNumber));
    const sellerNip = replacePolishCharacters(String(request.garage.nip));

    // Dane klienta (nabywcy)
    const clientName = replacePolishCharacters(String(request.userName));
    const clientEmail = replacePolishCharacters(String(request.userEmail || 'brak danych'));

    // Jeśli mamy ceny netto (request.amounts) i operacje (request.operations),
    // łączymy je w wiersze do PDF:
    const vatRate = 0.23;
    const serviceRows: Array<Array<string>> = [];
    let totalNet = 0, totalVAT = 0, totalGross = 0;

    if (request.operations?.length && request.amounts?.length) {
      request.operations.forEach((op, idx) => {
        let opText = typeof op === 'string' ? op : JSON.stringify(op);
        opText = replacePolishCharacters(opText);
        const netPrice = request.amounts[idx] ?? 0;
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
      // Jeśli brak amounts, wrzucamy 0
      const netPrice = 0;
      const vatAmount = netPrice * vatRate;
      const grossPrice = netPrice + vatAmount;
      totalNet = netPrice;
      totalVAT = vatAmount;
      totalGross = grossPrice;

      serviceRows.push([
        replacePolishCharacters(request.description),
        netPrice.toFixed(2),
        '23%',
        vatAmount.toFixed(2),
        grossPrice.toFixed(2),
      ]);
    }

    const doc = new jsPDF();
    let y = 20;

    doc.setFont('Times', 'normal');
    doc.setFontSize(18);
    doc.text(replacePolishCharacters('Raport z usług'), 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(replacePolishCharacters(`Raport nr: ${reportNumber}`), 14, y);
    doc.text(
      replacePolishCharacters(`Data wystawienia: ${new Date().toLocaleDateString('pl-PL')}`),
      130,
      y
    );
    y += 10;

    // Dane sprzedawcy
    doc.setFontSize(11);
    doc.text(replacePolishCharacters('Wykonawca:'), 14, y);
    y += 6;
    doc.text(sellerName, 14, y);
    y += 6;
    doc.text(sellerAddress, 14, y);
    y += 6;
    doc.text(`Telefon: ${sellerPhone}`, 14, y);
    y += 6;
    doc.text(`NIP: ${sellerNip}`, 14, y);
    y += 10;

    // Dane nabywcy
    doc.text(replacePolishCharacters('Nabywca:'), 14, y);
    y += 6;
    doc.text(clientName, 14, y);
    y += 6;
    doc.text(clientEmail, 14, y);
    y += 10;

    // Tabelka
    autoTable(doc, {
      startY: y,
      head: [['Usluga', 'Kwota netto', 'VAT', 'Kwota VAT', 'Kwota brutto']],
      body: serviceRows,
      theme: 'grid',
      headStyles: { fillColor: [220, 220, 220] },
      styles: {
        cellPadding: 2,
        cellWidth: 'auto',
        overflow: 'visible',
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || y;
    doc.text(replacePolishCharacters('Razem:'), 14, finalY + 10);
    doc.text(
      replacePolishCharacters(`Kwota netto: ${totalNet.toFixed(2)} PLN`),
      14,
      finalY + 16
    );
    doc.text(
      replacePolishCharacters(`Kwota VAT: ${totalVAT.toFixed(2)} PLN`),
      14,
      finalY + 22
    );
    doc.text(
      replacePolishCharacters(`Kwota brutto: ${totalGross.toFixed(2)} PLN`),
      14,
      finalY + 28
    );

    doc.save(`Raport_${reportNumber}.pdf`);
  };

  // -- Funkcje pomocnicze do dat --
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

  // -- Render
  if (!isClient) {
    return null;
  }

  // Filtrujemy, by wyświetlać tylko zakończone:
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
                    <td className="px-4 py-2 border">
                      {replacePolishCharacters(request.userName)}
                    </td>
                    <td className="px-4 py-2 border">
                      {replacePolishCharacters(request.userEmail || '')}
                    </td>
                    <td className="px-4 py-2 border">
                      {replacePolishCharacters(request.car || '')}
                    </td>
                    <td className="px-4 py-2 border">
                      {replacePolishCharacters(request.description)}
                    </td>
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
