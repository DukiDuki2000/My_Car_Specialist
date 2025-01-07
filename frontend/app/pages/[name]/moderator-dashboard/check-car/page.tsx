'use client';

import React, { useState } from 'react';

interface Vehicle {
  id: number;
  vin: string;
  registrationNumber: string;
  brand: string;
  model: string;
  modelYear: string;
  productionYear: string;
  generation: string;
  engineCapacity: string;
  enginePower: string;
  fuelType: string;
  engineCode: string;
  driveType: string;
  userId: string;
  userName: string;
}

const VehicleSearchPage: React.FC = () => {
  const [searchType, setSearchType] = useState<'vin' | 'reg'>('vin');
  const [searchValue, setSearchValue] = useState('');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setVehicle(null);
  
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Brak tokena autoryzacyjnego.');
      setLoading(false);
      return;
    }
  
    try {
      // Konwersja na wielkie litery
      const normalizedValue = searchValue.toUpperCase();
  
      const endpoint =
        searchType === 'vin'
          ? `/api/vehicle/searchByVin/${normalizedValue}`
          : `/api/vehicle/searchByReg/${normalizedValue}`;
          
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Błąd podczas wyszukiwania: ${response.statusText}`);
      }
  
      const data: Vehicle = await response.json();
      setVehicle(data);
    } catch (err: any) {
      setError(err.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container">
      <div className="search-panel">
        <h2>Wyszukiwanie pojazdu</h2>
        <div className="search-options">
          <label>
            <input
              type="radio"
              name="searchType"
              value="vin"
              checked={searchType === 'vin'}
              onChange={() => setSearchType('vin')}
            />
            Wyszukaj po VIN
          </label>
          <label>
            <input
              type="radio"
              name="searchType"
              value="reg"
              checked={searchType === 'reg'}
              onChange={() => setSearchType('reg')}
            />
            Wyszukaj po tablicy rejestracyjnej
          </label>
        </div>
        <input
          type="text"
          placeholder={searchType === 'vin' ? 'Wprowadź VIN' : 'Wprowadź tablicę rejestracyjną'}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} disabled={loading || !searchValue.trim()}>
          Wyszukaj
        </button>
        {loading && <p>Trwa wyszukiwanie...</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="result-panel">
        <h2>Dane pojazdu</h2>
        {vehicle ? (
          <table className="vehicle-table">
            <tbody>
              <tr>
                <th>VIN</th>
                <td>{vehicle.vin}</td>
              </tr>
              <tr>
                <th>Rejestracja</th>
                <td>{vehicle.registrationNumber}</td>
              </tr>
              <tr>
                <th>Marka</th>
                <td>{vehicle.brand}</td>
              </tr>
              <tr>
                <th>Model</th>
                <td>{vehicle.model}</td>
              </tr>
              <tr>
                <th>Rok modelowy</th>
                <td>{vehicle.modelYear}</td>
              </tr>
              <tr>
                <th>Rok produkcji</th>
                <td>{vehicle.productionYear}</td>
              </tr>
              <tr>
                <th>Generacja</th>
                <td>{vehicle.generation}</td>
              </tr>
              <tr>
                <th>Pojemność</th>
                <td>{vehicle.engineCapacity} cm³</td>
              </tr>
              <tr>
                <th>Moc</th>
                <td>{vehicle.enginePower} KM</td>
              </tr>
              <tr>
                <th>Typ paliwa</th>
                <td>{vehicle.fuelType}</td>
              </tr>
              <tr>
                <th>Kod silnika</th>
                <td>{vehicle.engineCode}</td>
              </tr>
              <tr>
                <th>Napęd</th>
                <td>{vehicle.driveType}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>{loading ? '' : 'Brak wyników wyszukiwania.'}</p>
        )}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          gap: 20px;
          padding: 20px;
          font-family: 'Arial', sans-serif;
          max-width: 1200px;
          margin: 20px auto;
        }
        .search-panel {
          flex: 1;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .search-panel h2 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .search-options {
          margin-bottom: 20px;
        }
        .search-options label {
          display: block;
          margin-bottom: 10px;
        }
        .search-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #ced4da;
          border-radius: 5px;
          font-size: 16px;
        }
        .result-panel {
          flex: 2;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .result-panel h2 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .vehicle-table {
          width: 100%;
          border-collapse: collapse;
        }
        .vehicle-table th,
        .vehicle-table td {
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .vehicle-table th {
          width: 40%;
          font-weight: bold;
        }
        .error {
          color: #dc3545;
          font-weight: bold;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default VehicleSearchPage;
