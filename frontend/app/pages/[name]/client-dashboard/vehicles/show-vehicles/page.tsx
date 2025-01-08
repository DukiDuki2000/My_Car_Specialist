'use client';

import React, { useEffect, useState } from 'react';

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

const VehicleListPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Brak tokena autoryzacyjnego.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/vehicle/search', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Błąd podczas pobierania danych: ${response.statusText}`);
        }

        const data: Vehicle[] = await response.json();
        setVehicles(data);
      } catch (err: any) {
        setError(err.message || 'Wystąpił nieoczekiwany błąd.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="container">
      <div className="header-box">
        <h1 className="title">Twoje pojazdy</h1>
      </div>
      <div className="table-box">
        {loading && <p>Ładowanie danych...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && vehicles.length === 0 && <p>Brak danych pojazdów.</p>}
        {!loading && !error && vehicles.length > 0 && (
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>VIN</th>
                <th>Rejestracja</th>
                <th>Marka</th>
                <th>Model</th>
                <th>Rok produkcji</th>
                <th>Generacja</th>
                <th>Pojemność</th>
                <th>Moc</th>
                <th>Typ paliwa</th>
                <th>Napęd</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.vin}</td>
                  <td>{vehicle.registrationNumber}</td>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.productionYear}</td>
                  <td>{vehicle.generation}</td>
                  <td>{vehicle.engineCapacity} cm³</td>
                  <td>{vehicle.enginePower} KM</td>
                  <td>{vehicle.fuelType}</td>
                  <td>{vehicle.driveType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style jsx>{`
        .container {
          padding: 20px;
          font-family: 'Arial', sans-serif;
          background: #f8f9fa;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          max-width: 1200px;
          margin: 20px auto;
        }
        .header-box {
          background: #007bff;
          color: white;
          text-align: center;
          padding: 40px;
          margin-bottom: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .title {
          font-size: 32px;
          font-weight: bold;
          margin: 0;
        }
        .table-box {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .vehicles-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .vehicles-table th,
        .vehicles-table td {
          padding: 12px 15px;
          text-align: left;
          font-size: 14px;
        }
        .vehicles-table th {
          background-color: #007bff;
          color: white;
          text-transform: uppercase;
        }
        .vehicles-table tbody tr:nth-child(odd) {
          background-color: #f8f9fa;
        }
        .vehicles-table tbody tr:nth-child(even) {
          background-color: #ffffff;
        }
        .vehicles-table tbody tr:hover {
          background-color: #e9ecef;
          cursor: pointer;
        }
        .error {
          color: #dc3545;
          font-weight: bold;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default VehicleListPage;
