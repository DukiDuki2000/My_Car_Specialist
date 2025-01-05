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
        <h2 className="text-4xl font-bold text-gray-800 mb-12">Lista Zgłoszeń</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">
          {/* Nowe zgłoszenie */}
          <div
            onClick={() => handleNavigate(`/pages/${localStorage.getItem('username')}/client-dashboard/request-actual`)}  // Przekierowanie na stronę "Nowe zgłoszenie"
            className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-16 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
          >
            <img
              src="/note.svg"
              alt="Nowe zgłoszenie"
              className="h-40 w-40 mb-8"
            />
            <p className="text-gray-800 font-semibold text-2xl">Aktualne zgłoszenia</p>
          </div>

          {/* Lista zgłoszeń */}
          <div
             onClick={() => handleNavigate(`/pages/${localStorage.getItem('username')}/client-dashboard/request-history`)} // Przekierowanie na stronę "historie zgloszen"
            className="flex flex-col items-center justify-center border-4 border-blue-400 rounded-lg p-16 shadow-md hover:shadow-lg hover:border-blue-600 transition transform hover:scale-110 cursor-pointer"
          >
            <img
              src="/history.svg"
              alt="Lista zgłoszeń"
              className="h-40 w-40 mb-8"
            />
            <p className="text-gray-800 font-semibold text-2xl">Historia zgłoszeń</p>
          </div>
        </div>
      </main>
    </div>
  );
}
