"use client";

import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path); // Przekierowanie na podaną ścieżkę
  };

  return (
    <div className="absolute bottom-0 h-100 w-full">
      {/* Treść */}
      <main className="flex items-center justify-center flex-col -mt-16 px-4 h-[calc(100vh-80px)]">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">Panel Klienta</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-20">
          {/* Dodaj samochód */}
          <div
            onClick={() => handleNavigate("/client-services/add-car")} // Przekierowanie na stronę "Dodaj samochód"
            className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-20 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
          >
            <img
              src="/car.svg"
              alt="Dodaj samochód"
              className="h-40 w-40 mb-8"
            />
            <p className="text-gray-800 font-semibold text-2xl">Dodaj samochód</p>
          </div>

          {/* Nowe zgłoszenie */}
          <div
            onClick={() => handleNavigate("/client-services/add-request")} // Przekierowanie na stronę "Nowe zgłoszenie"
            className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-16 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
          >
            <img
              src="/pencil.svg"
              alt="Nowe zgłoszenie"
              className="h-40 w-40 mb-8"
            />
            <p className="text-gray-800 font-semibold text-2xl">Nowe zgłoszenie</p>
          </div>

          {/* Lista zgłoszeń */}
          <div
            onClick={() => handleNavigate("/client-services/request-history")} // Przekierowanie na stronę "Lista zgłoszeń"
            className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-16 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
          >
            <img
              src="/listaZgloszen.svg"
              alt="Lista zgłoszeń"
              className="h-40 w-40 mb-8"
            />
            <p className="text-gray-800 font-semibold text-2xl">Lista zgłoszeń</p>
          </div>
        </div>
      </main>
    </div>
  );
}
