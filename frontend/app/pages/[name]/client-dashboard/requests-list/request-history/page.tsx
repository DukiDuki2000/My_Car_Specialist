'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Definicja statusu
export type StatusType = 'NEW' | 'IN_PROGRESS' | 'COMPLETED';

// Definicja warsztatu (warsztat = "garage")
export interface Garage {
  id: number;
  nip: string;
  regon: string;
  companyName: string;
  // Adres może być prostym stringiem albo obiektem:
  address: string | { street?: string; city?: string; postalCode?: string };
  phoneNumber: string;
  ibans: string[];
  userId: number;
  userName: string;
}

// Definicja pojedynczego zgłoszenia serwisowego
export interface Service {
  id: number;
  dateHistory: string[];     // historia dat (np. data przyjęcia, zakończenia itp.)
  garage: Garage;            // informacje o warsztacie
  status: StatusType;        
  operations: any[];         // tablica stringów lub obiektów (np. opis działań)
  amounts: number[];         // ceny netto dla operacji
  operationDates: string[];  
  vehicleId: number;
  userId: number;
  userName: string;          // nazwa/użytkownik
  description: string;       // krótki opis
  car?: string;              // nazwa/krótki opis pojazdu
  userEmail?: string;        // email użytkownika
}

// Funkcja pomocnicza – usuwa polskie znaki (opcjonalne)
function replacePolishCharacters(text: string): string {
  const map: { [key: string]: string } = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
  };
  return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, char => map[char] || char);
}

// Formatowanie daty do dd.mm.yyyy (lub innego układu) w języku polskim
function formatDatePl(date: Date) {
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Generuje PDF w układzie podobnym do Twojego zrzutu ekranu:
 * - Raport z usług
 * - Informacje o warsztacie (wykonawcy)
 * - Informacje o kliencie
 * - Tabela z usługami i cenami (netto, VAT, brutto)
 * - Podsumowanie kwot
 */
function generateServicePdf(service: Service) {
  const doc = new jsPDF();

  // Numer zgłoszenia i data wystawienia
  const reportNumber = service.id;
  const issueDate = new Date();

  // Dane warsztatu
  const workshopName = replacePolishCharacters(service.garage.companyName);
  let workshopAddress = '';
  if (typeof service.garage.address === 'object') {
    const { street, city, postalCode } = service.garage.address;
    workshopAddress = replacePolishCharacters(
      `${street || ''} ${city || ''} ${postalCode || ''}`
    );
  } else {
    workshopAddress = replacePolishCharacters(service.garage.address);
  }
  const workshopPhone = service.garage.phoneNumber;
  const workshopNip = service.garage.nip;

  // Dane klienta
  const clientName = replacePolishCharacters(service.userName || 'brak danych');
  const clientEmail = replacePolishCharacters(service.userEmail || 'brak danych');

  // Przygotowujemy wiersze do tabeli
  const vatRate = 0.23;  // 23% VAT
  let totalNet = 0;
  let totalVAT = 0;
  let totalGross = 0;

  const tableBody: Array<Array<string>> = [];

  if (service.operations && service.operations.length > 0) {
    service.operations.forEach((op, i) => {
      // Jeśli 'op' jest obiektem i posiada nazwę, używamy jej; jeśli to string, bierzemy wartość
      const opName =
        typeof op === 'object' && op.name
          ? replacePolishCharacters(op.name)
          : replacePolishCharacters(String(op));

      const net = service.amounts[i] || 0;  // kwota netto
      const vat = net * vatRate;
      const gross = net + vat;
      totalNet += net;
      totalVAT += vat;
      totalGross += gross;

      tableBody.push([
        opName,
        net.toFixed(2),
        '23%',
        vat.toFixed(2),
        gross.toFixed(2)
      ]);
    });
  } else {
    // Jeżeli nie ma operacji, wrzucamy chociaż jedną linię z opisem
    tableBody.push([
      replacePolishCharacters(service.description),
      '0.00',
      '23%',
      '0.00',
      '0.00'
    ]);
  }

  // Nagłówek
  let yPos = 20;
  doc.setFont('Times', 'normal');
  doc.setFontSize(18);
  doc.text(replacePolishCharacters('Raport z uslug'), 14, yPos);
  yPos += 10;

  // Numer raportu i data wystawienia
  doc.setFontSize(12);
  doc.text(`Raport nr: ${reportNumber}`, 14, yPos);
  doc.text(`Data wystawienia: ${formatDatePl(issueDate)}`, 130, yPos);
  yPos += 10;

  // Wykonawca (warsztat)
  doc.text('Wykonawca:', 14, yPos);
  yPos += 6;
  doc.text(workshopName, 14, yPos);
  yPos += 6;
  doc.text(workshopAddress, 14, yPos);
  yPos += 6;
  doc.text(`Telefon: ${workshopPhone}`, 14, yPos);
  yPos += 6;
  doc.text(`NIP: ${workshopNip}`, 14, yPos);
  yPos += 10;

  // Klient
  doc.text('Klient:', 14, yPos);
  yPos += 6;
  doc.text(clientName, 14, yPos);
  yPos += 6;
  doc.text(clientEmail, 14, yPos);
  yPos += 10;

  // Tabela z usługami
  autoTable(doc, {
    startY: yPos,
    head: [['Usluga', 'Kwota netto', 'VAT', 'Kwota VAT', 'Kwota brutto']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [220, 220, 220], // jasnoszare tło w nagłówku
      textColor: [0, 0, 0],
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    bodyStyles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    styles: {
      cellPadding: 3,
      fontSize: 11,
      overflow: 'linebreak',
      valign: 'middle',
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Podsumowanie
  doc.text('Razem:', 14, finalY);
  doc.text(`Kwota netto: ${totalNet.toFixed(2)} PLN`, 14, finalY + 6);
  doc.text(`Kwota VAT: ${totalVAT.toFixed(2)} PLN`, 14, finalY + 12);
  doc.text(`Kwota brutto: ${totalGross.toFixed(2)} PLN`, 14, finalY + 18);

  // Zapis do pliku PDF
  doc.save(`Raport_${reportNumber}.pdf`);
}

export default function ServiceHistory() {
  const router = useRouter();

  // Wybrany samochód (np. "ABC123 - Audi A4")
  const [selectedCar, setSelectedCar] = useState<string>('');
  // Lista pojazdów zalogowanego użytkownika
  const [cars, setCars] = useState<{ id: number; registrationNumber: string }[]>([]);
  // Lista zgłoszeń serwisowych
  const [currentServices, setCurrentServices] = useState<Service[]>([]);
  // Konfiguracja sortowania
  const [currentSortConfig, setCurrentSortConfig] = useState<{
    key: keyof Service;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Pobieramy listę samochodów (pierwszy useEffect)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchUserCars = async () => {
      try {
        const response = await fetch('/api/vehicle/search', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: {
          id: number;
          vin: string;
          registrationNumber: string;
          brand: string;
          model: string;
          modelYear: number;
        }[] = await response.json();

        // Mapujemy do formatu { id, registrationNumber: "XYZ - Marka Model" }
        const carList = data.map((car) => ({
          id: car.id,
          registrationNumber: `${car.registrationNumber} - ${car.brand} ${car.model}`,
        }));
        setCars(carList);

        // Ustawiamy domyślnie pierwszy samochód, jeśli istnieje
        if (carList.length > 0 && !selectedCar) {
          setSelectedCar(carList[0].registrationNumber);
        }
      } catch (error) {
        console.error('Error fetching user cars:', error);
        router.push('/');
      }
    };

    fetchUserCars();
  }, [router]);

  // Pobieramy zakończone zgłoszenia serwisowe (drugi useEffect)
  // i filtrujemy je wg. wybranego pojazdu
  useEffect(() => {
    if (!selectedCar) return;

    const fetchServicesForCar = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch('/api/client/report/all/completed', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const dataNew: Service[] = await response.json();
        const selectedCarObj = cars.find(
          (car) => car.registrationNumber === selectedCar
        );

        if (selectedCarObj) {
          const filteredServices = dataNew.filter(
            (service) => service.vehicleId === selectedCarObj.id
          );
          setCurrentServices(filteredServices);
        }
      } catch (error) {
        console.error('Error fetching services for car:', error);
      }
    };

    fetchServicesForCar();
  }, [selectedCar, cars]);

  // Zmiana wybranego pojazdu w <select>
  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCar(e.target.value);
    setCurrentSortConfig(null);
  };

  // Sortowanie wg. wybranej kolumny
  const sortServices = (services: Service[], key: keyof Service) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      currentSortConfig?.key === key &&
      currentSortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }

    const sortedServices = [...services].sort((a, b) => {
      // Jeśli sortujemy po polu "garage", to bierzemy "garage.companyName"
      if (key === 'garage') {
        const nameA = a.garage.companyName.toLowerCase();
        const nameB = b.garage.companyName.toLowerCase();
        if (nameA < nameB) return direction === 'ascending' ? -1 : 1;
        if (nameA > nameB) return direction === 'ascending' ? 1 : -1;
        return 0;
      }

      // W innych przypadkach sortujemy na podstawie a[key], b[key]
      if (a[key]! < b[key]!) return direction === 'ascending' ? -1 : 1;
      if (a[key]! > b[key]!) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setCurrentServices(sortedServices);
    setCurrentSortConfig({ key, direction });
  };

  // Render strzałek sortujących w nagłówku tabeli
  const renderSortArrows = (key: keyof Service) => {
    if (currentSortConfig?.key === key) {
      return currentSortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '↕';
  };

  // Formatowanie daty (na potrzeby wyświetlenia w tabeli)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', '');
  };

  // Tłumaczenie statusu na j. polski
  const translateStatus = (status: StatusType) => {
    switch (status) {
      case 'COMPLETED':
        return 'Ukończone';
      case 'IN_PROGRESS':
        return 'W trakcie';
      case 'NEW':
        return 'Nowe';
      default:
        return status;
    }
  };

  // Render tabeli
  const renderTable = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Zgłoszenia serwisowe (ukończone)</h2>
      <table className="min-w-full border border-blue-400">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2 border border-blue-400 text-left">ID</th>
            <th
              className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
              onClick={() => sortServices(currentServices, 'description')}
            >
              Rodzaj usługi {renderSortArrows('description')}
            </th>
            <th
              className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
              onClick={() => sortServices(currentServices, 'garage')}
            >
              Warsztat {renderSortArrows('garage')}
            </th>
            <th
              className="px-4 py-2 border border-blue-400 text-left cursor-pointer"
              onClick={() => sortServices(currentServices, 'dateHistory')}
            >
              Data zgłoszenia {renderSortArrows('dateHistory')}
            </th>
            <th className="px-4 py-2 border border-blue-400 text-left">Status</th>
            <th className="px-4 py-2 border border-blue-400 text-center">PDF</th>
          </tr>
        </thead>
        <tbody>
          {currentServices.map((service) => (
            <tr key={service.id} className="hover:bg-blue-100 transition-colors">
              <td className="px-4 py-2 border border-blue-400">{service.id}</td>
              <td className="px-4 py-2 border border-blue-400">{service.description}</td>
              <td className="px-4 py-2 border border-blue-400">
                {service.garage.companyName}
              </td>
              {/* Zakładam, że dateHistory[0] to data rozpoczęcia/zgłoszenia */}
              <td className="px-4 py-2 border border-blue-400">
                {service.dateHistory.length > 0
                  ? formatDate(service.dateHistory[0])
                  : '–'}
              </td>
              <td className="px-4 py-2 border border-blue-400">
                {translateStatus(service.status)}
              </td>
              <td className="px-4 py-2 border border-blue-400 text-center">
                {/* Kliknięcie w ikonę PDF generuje nowy raport */}
                <Image
                  src="/PDF.png"
                  alt="Generuj PDF"
                  width={24}
                  height={24}
                  className="inline-block cursor-pointer"
                  onClick={() => generateServicePdf(service)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lista Zgłoszeń</h1>

      {/* Wybór samochodu */}
      <div className="mb-8">
        <label
          htmlFor="carSelect"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Wybór samochodu
        </label>
        <select
          id="carSelect"
          value={selectedCar}
          onChange={handleCarChange}
          className="w-full max-w-lg px-4 py-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {cars.map((car) => (
            <option key={car.id} value={car.registrationNumber}>
              {car.registrationNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela zgłoszeń */}
      {renderTable()}
    </div>
  );
}
