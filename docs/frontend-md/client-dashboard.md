Client Dashboard to panel dla klientów, którzy mogą zarządzać swoimi pojazdami i składać
zapytania do warsztatów.

## Główne funkcjonalności

Główne funkcjonalności `client dashboard` to:

- składanie zapytań o naprawy/wizyty w warsztatach,

- podgląd statusu zgłoszeń,

- zarządzanie swoimi pojazdami (dodawanie, usuwanie, edycja),

- podgląd szczegółowych informacji o pojazdach,

- historia zapytań.

## Struktura katalogów

```bash

[name]
├── client-dashboard
│   ├── add-request
│   │   └── page.tsx   # Formularz składania nowego zapytania
│   ├── client-info
│   │   └── page.tsx   # Informacje o kliencie
│   ├── page.tsx       # Strona główna dashboardu klienta
│   ├── requests-list
│   │   ├── page.tsx   # Lista zapytań użytkownika
│   │   ├── request-actual
│   │   │   └── page.tsx  # Szczegóły aktualnego zapytania
│   │   └── request-history
│   │       └── page.tsx  # Historia zapytań
│   └── vehicles
│       ├── add-car
│       │   └── page.tsx  # Formularz dodawania pojazdu
│       ├── page.tsx      # Lista pojazdów
│       └── show-vehicles
│           └── page.tsx  # Szczegóły pojazdu

```

## Opis kluczowych plików i funkcji

### 1. Strona główna panelu klienta (`client-dashboard/page.tsx`)

Po zalogowaniu użytkownik z rolą klienta widzi ekran główny panelu klienta z trzema głównymi kafelkami:

- Pojazdy – zarządzanie dodanymi samochodami.

- Nowe zlecenie – zgłoszenie nowej naprawy.

- Lista zleceń – przeglądanie historii i bieżących zgłoszeń.

```jsx title="Kod odpowiedzialny za nawigację po dashboardzie"
const handleNavigate = (path: string) => { 
  router.push(path); // Przekierowanie do wybranego widoku
};
```

### 2. Formularz składania zapytania (`add-request/page.tsx`)

Formularz umożliwia zgłoszenie naprawy pojazdu.

- Wybór samochodu

- Opis problemu

- Wybór warsztatu

```jsx title="Kod obsługi wyboru warsztatu"
const handleWorkshopSelect = (workshopId: number) => {
  setSelectedWorkshop(workshopId);
};
```

### 3. Lista zapytań (`requests-list/page.tsx`)

Pokazuje historię oraz bieżące zgłoszenia użytkownika.

```jsx title="Kod wyświetlający listę zgłoszeń"
{requests.map((request) => (
  <tr key={request.id}>
    <td>{request.type}</td>
    <td>{request.status}</td>
    <td>{request.workshop}</td>
  </tr>
))}
```

### Szczegóły aktualnego zgłoszenia (`request-actual/page.tsx`)

Wyświetla status i szczegóły konkretnego zgłoszenia.

```jsx title="Kod wyświetlania szczegółów zgłoszenia"
const requestDetails = async () => {
  const response = await fetch(`/api/request/${requestId}`);
  const data = await response.json();
  setRequestDetails(data);
};
```

### 5. Historia zgłoszeń (`request-history/page.tsx`)

Przechowuje archiwalne zgłoszenia wraz z możliwością pobrania raportu PDF.

```jsx title="Kod generowania raportu"
<a href={service.pdfLink} target="_blank">
  *Pobierz raport*
</a>
```

### 6. Zarządzanie pojazdami (`vehicles/page.tsx`)

Lista wszystkich pojazdów przypisanych do użytkownika.

- Dodawanie pojazdu (`add-car/page.tsx`) – użytkownik może dodać nowy pojazd, wpisując jego dane lub dekodując numer VIN.

- Podgląd szczegółów pojazdu (`show-vehicles/page.tsx`) – użytkownik może zobaczyć pełne informacje techniczne dotyczące pojazdu.

```jsx title="Kod dekodowania VIN"
const handleDecodeVin = async () => {
const response = await fetch(`/api/vehicle/decode-info/${vin}`);
const data = await response.json();
setFormData({ ...formData, make: data.make, model: data.model });
};
```