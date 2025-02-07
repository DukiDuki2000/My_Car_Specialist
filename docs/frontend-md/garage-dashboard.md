Garage Dashboard to panel dla warsztatów, umożliwiający zarządzanie zgłoszeniami i informacjami o firmie.

## Główne funkcjonalności

Główne funkcjonalności `garage dashboard` to:

- zarządzanie informacjami o warsztacie,

- przeglądanie i akceptowanie zgłoszeń,

- podział zgłoszeń na aktualne i archiwalne,

- możliwość generowania raportów PDF dla zakończonych zgłoszeń,

- zarządzanie statusem zgłoszeń (np. "W trakcie", "Zakończone").


## Struktura katalogów

```bash

[name]
├── garage-dashboard
│   ├── actual
│   │   ├── [id]
│   │   │   └── page.tsx  # Szczegóły konkretnego zgłoszenia
│   │   └── page.tsx  # Lista aktualnych zgłoszeń
│   ├── garage-info
│   │   └── page.tsx  # Informacje o warsztacie
│   ├── history
│   │   └── page.tsx  # Historia zgłoszeń
│   ├── page.tsx  # Strona główna dashboardu warsztatu
│   └── pending-ticket-list
│       └── page.tsx  # Lista oczekujących zgłoszeń

```

## Opis kluczowych plików i funkcji

### 1. Strona główna panelu warsztatu (`garage-dashboard/page.tsx`)

Po zalogowaniu użytkownik z rolą warsztatu widzi ekran główny panelu, który zawiera trzy główne kafelki:

- Nowe zgłoszenia – lista zgłoszeń oczekujących na akceptację.

- Aktualne zgłoszenia – naprawy, które są w trakcie realizacji.

- Historia zgłoszeń – lista ukończonych usług.

```jsx title=""
const handleNavigate = (path: string) => { 
  router.push(path); // Przekierowanie do wybranego widoku
};
```

### 2. 2. Panel nowych zgłoszeń (`pending-ticket-list/page.tsx`)

Tabela z listą wszystkich zgłoszeń oczekujących na akceptację. Każde zgłoszenie zawiera dane klienta,
opis problemu oraz informacje o pojeździe. Warsztat może zaakceptować zgłoszenie lub je odrzucić.

```jsx title=""
const handleAccept = (id: number) => {
  changeReportStatus(id, 'IN_PROGRESS');
};
```

### 3. Panel aktualnych zgłoszeń (`actual/page.tsx`)

Widok zgłoszeń, które zostały zaakceptowane i są w trakcie realizacji. Warsztat ma możliwość przejścia
do szczegółowego widoku edycji zgłoszenia.

### 4. Panel edycji zgłoszenia (`actual/[id]/page.tsx`)

Warsztat może dodać kolejne wykonane operacje, np. „Wymiana oleju – 200 zł”, oraz oznaczyć zgłoszenie jako zakończone.

```jsx title=""
const handleCompleteRequest = async () => {
    const res = await fetch(`/api/garage/report/status/${reportId}?newStatus=COMPLETED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
    });
};
```
### 5. Panel historii zgłoszeń (`history/page.tsx`)

Warsztat może przeglądać listę zakończonych zgłoszeń. Możliwość generowania raportu PDF dla zakończonych usług.

```jsx title=""
const handlePdfReport = (requestId: number) => {
    console.log('Generowanie PDF dla zlecenia o ID:', requestId);
};
```

### 6. Zarządzanie informacjami o warsztacie (garage-info/page.tsx)

Panel pozwala na edycję i aktualizowanie informacji o warsztacie, takich jak dane kontaktowe,
godziny otwarcia, oraz inne szczegóły dotyczące działalności warsztatu.


