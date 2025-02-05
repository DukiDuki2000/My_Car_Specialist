'use client';
import React from 'react';
import Image from 'next/image';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          O nas
        </h1>

        <div className="text-lg text-gray-700 leading-relaxed">
          <p className="mb-4">
            Witamy w naszym projekcie elektronicznej książki serwisowej! Naszym
            celem jest rewolucja w sposobie zarządzania dokumentacją serwisową
            pojazdów zarówno przez właścicieli, jak i zaufane warsztaty.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-8 mb-4">
            Co oferujemy?
          </h2>
          <ul className="list-disc list-inside space-y-3">
            <li>
              <b>Łatwe przechowywanie dokumentacji:</b> Centralne, bezpieczne i
              łatwo dostępne miejsce do przechowywania wszystkich zapisów
              serwisowych Twojego pojazdu.
            </li>
            <li>
              <b>Zwiększenie wartości pojazdu:</b> Profesjonalna dokumentacja, która
              buduje zaufanie i zwiększa wartość pojazdu przy sprzedaży.
            </li>
            <li>
              <b>Zaufane warsztaty:</b> Połącz się z rzetelnymi serwisami i buduj
              relacje oparte na szczegółowych zapisach napraw.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-blue-500 mt-8 mb-4">
            Dlaczego my?
          </h2>
          <p className="mb-4">
            Nasza platforma łączy właścicieli pojazdów z zaufanymi warsztatami,
            zapewniając przejrzystość i dokładność. Dla właścicieli to wygodny
            sposób na śledzenie historii napraw. Dla warsztatów to szansa na
            pozyskanie nowych klientów i budowanie lojalności poprzez wysokiej
            jakości dokumentację serwisową.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-8 mb-4">
            Nasza wizja
          </h2>
          <p className="mb-4">
            Naszą wizją jest przyszłość, w której każdy pojazd posiada
            kompleksową i łatwą do przekazania historię serwisową. Naszą misją
            jest uproszczenie dokumentacji, budowanie zaufania między
            właścicielami a warsztatami, oraz wspieranie rozwoju branży
            motoryzacyjnej.
          </p>
        </div>

        <div className="mt-10 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Wspólnie budujmy przyszłość motoryzacji!
          </h3>
          <p className="text-gray-600">
            Dołącz do nas, aby tworzyć bardziej przejrzyste, wiarygodne i
            zorganizowane doświadczenie serwisowe.
          </p>
        </div>
      </div>
    </div>
  );
}
