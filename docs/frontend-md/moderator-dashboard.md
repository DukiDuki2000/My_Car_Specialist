Moderator Dashboard to panel dla moderatorów, którzy nadzorują procesy w systemie,
weryfikują zgłoszenia i pojazdy.

## Główne funkcjonalności

Główne funkcjonalności `moderator dashboard` to:

- weryfikacja zgłoszeń użytkowników,

- sprawdzanie i zatwierdzanie nowych pojazdów,

- kontrola nad danymi w systemie.


## Struktura katalogów

```bash

[name]
├── moderator-dashboard
│   ├── check-car
│   │   └── page.tsx  # Sprawdzanie pojazdu
│   ├── check-requests
│   │   └── page.tsx  # Weryfikacja zgłoszeń
│   └── page.tsx  # Strona główna panelu moderatora

```

## Opis kluczowych plików i funkcji

### 1. Strona główna panelu moderatora (`moderator-dashboard/page.tsx`)

Po zalogowaniu moderator widzi dwie główne opcje:

- Sprawdzenie danych pojazdu – wyszukiwanie pojazdu po numerze VIN lub tablicy rejestracyjnej.

- Sprawdzenie próśb o rejestrację warsztatu – lista warsztatów oczekujących na weryfikację.

```jsx title=""
const handleNavigate = (path: string) => {
    router.push(path); // Przekierowanie do wybranego widoku
};
```
### 2. Wyszukiwanie pojazdów (`check-car/page.tsx`)

Moderator może wyszukiwać pojazdy po numerze VIN lub tablicy rejestracyjnej. Jeśli pojazd istnieje
w systemie, wyświetlane są jego dane techniczne.

```jsx title=""
const fetchVehicleInfo = async (query: string) => {
    const response = await fetch(`/api/vehicle/search/${query}`);
    const data = await response.json();
    setVehicleData(data);
};
```

### 3.Panel przeglądania próśb o rejestrację warsztatu (check-requests/page.tsx)
Moderator widzi listę warsztatów oczekujących na zatwierdzenie. Może sprawdzić dane oraz zatwierdzić rejestrację warsztatu. 

```jsx title=""
const approveWorkshop = async (workshopId: number) => {
    await fetch(`/api/moderator/workshop/approve/${workshopId}`, { method: 'POST' });
};

```