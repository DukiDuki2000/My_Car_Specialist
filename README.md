# My_Car_Specialist

### Projekt: System dla warsztatów samochodowych

## Opis projektu

System będzie miał za zadanie umożliwić komunikację między klientem, a warsztatem samochodowym w zakresie obsługi i napraw pojazdów. Za jego pomocą klient będzie mógł sprawdzić historię napraw swojego auta wraz z poniesionymi z ich tytułu kosztami. Oprogramowanie będzie również oferowało funkcjonalność pozwalającą na sprawdzenie informacji o pojezdzie po jego numerze VIN. Dodatkowo zostanie zaimplementowana możliwość komunikacji mailowej z klientem w celu przypomnienia o nadchodzącym terminie wizyty oraz o zakończeniu serwisu.

System umożliwi pracownikom warsztatu rejestrację wykonanych prac serwisowych. Każda czynność wykonana przy pojeździe będzie posiadać opis przyjętego pojazdu (nr VIN, przebieg, zauważone uszkodzenia), wykorzystane części, kosztorys i dodatkowy opis, w którym w zależności od potrzeb, zostaną zawarte wszystkie informacje kluczowe w dalszej poprawnej eksploatacji pojazdu, lub przyszłych napraw.

### Funkcje systemu dostępne dla klienta:
-   System logowania i rejestracji użytkownika,
-   Przypisanie pojazdu do swojego konta (podanie poprawnej kombinacji numeru rejestracyjnego i numeru VIN),
-   Sprawdzenie pojazdu po numerze VIN
-   Przeglądanie historii serwisowej,
-   Tworzenie zgłoszenia serwisowego,
-   Kontakt mailowy z warsztatem,
-   Generowanie raportów PDF z napraw.

### Funkcje systemu dostępne dla pracowników warsztatu:
-   Panel administracyjny,
-   Tworzenie historii serwisowej,
-   Kontakt z klientem (wiadomości E-mail),
-   Zmiana statusu naprawy,
-   Generowanie zgłoszenia serwisowego dla serwisanta na podstawie odebranego zgłoszenia online, lub wypełnionego ręcznie (do wydruku),
-   Generowanie raportów PDF z napraw,
-   Automatyczna archiwizacja napraw.

### Przewidywana struktura aplikacji będzie się składać z: 
-   Frontend SPA (Single-Page-Application) z systemem autoryzacji użytkownika, gdzie w zależności od uprawnień będzie miał dostęp do odpowiednich funkcjonalności. 
-   Backend zarządzający logiką operacji wewnątrz aplikacji. 
-   Baza danych klientów, pojazdów, czynności serwisowych ze szczegółami i kosztorysami, faktur.


