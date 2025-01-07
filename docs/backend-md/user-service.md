User Service jest jednym z mikroserwisów, który jest odpowiedzialny za zarządzanie użytkownikami i ich
autentykację w całym systemie. Używa Spring Boot, Spring Security, JWT, oraz JPA w celu implementacji 
funkcji rejestracji, logowania, oraz autoryzacji użytkowników. Został zaprojektowany, aby 
współpracować z innymi usługami w ramach systemu.

## Struktura User Service

### 1. Podstawowa konfiguracja i uruchamianie aplikacji
   
**`UserServiceApplication.java`**

Główna klasa aplikacji, uruchamiająca mikroserwis za pomocą Spring Boot. Aplikacja działa w ramach
większego systemu backendowego i jest zależna od konfiguracji oraz interakcji z innymi mikroserwisami,
jak np. API Gateway, który przekierowuje żądania do odpowiednich usług.

### 2. Autentykacja i autoryzacja

Spring Security w User Service implementuje mechanizmy zabezpieczeń, w tym logowanie oraz przypisanie ról użytkownikom:
- `JwtUtils` - generuje i weryfikuje tokeny JWT, które są wykorzystywane do autoryzacji użytkowników w systemie.
- `AuthController` - kontroler odpowiedzialny za logowanie (`/signin`) oraz rejestrację użytkowników (`/signup`). Obsługuje żądania przychodzące z innych mikroserwisów lub bezpośrednio od klienta.
- `Role` - usługa umożliwia zarządzanie rolami użytkowników, takimi jak `ROLE_ADMIN`, `R`OLE_MODERATOR`, `ROLE_CLIENT`, co pozwala na precyzyjną kontrolę dostępu w systemie.

### 3. Role użytkowników i mechanizmy kontroli dostępu
- `RoleRepository` oraz `UserRole` - zarządzają rolami użytkowników w bazie danych. Każdy użytkownik może posiadać jedną lub więcej ról, które determinują jego uprawnienia w systemie.
- `WebSecurityConf` - klasa konfiguracyjna dla Spring Security, która definiuje zasady autentykacji i autoryzacji. Na przykład, endpointy związane z autoryzacją (/user/auth/**) są dostępne publicznie, natomiast inne endpointy wymagają autentykacji (np. dostęp do danych użytkowników).

### 4. Repozytoria i dane
- `UserRepository` - odpowiada za operacje na bazie danych dotyczące użytkowników, takie jak wyszukiwanie użytkowników po nazwie czy e-mailu.
- `RoleRepository` - umożliwia dostęp do danych o rolach, które są przypisywane użytkownikom.

### 5. Interfejsy komunikacyjne
- `UserRestController` - zawiera endpointy, które mogą być wykorzystywane do zarządzania użytkownikami przez inne mikroserwisy w systemie. Przykładem jest endpoint `/openApi`, który jest dostępny tylko dla użytkowników posiadających rolę `ROLE_ADMIN`.
- `API Gateway` będzie odpowiedzialny za przekierowanie odpowiednich żądań do User Service, w zależności od ich charakteru (np. autentykacja, rejestracja, dostęp do danych użytkowników).

### 6. Integracja z innymi mikroserwisami
- `API Gateway` - służy jako punkt wejścia do całego systemu. Przekazuje żądania do odpowiednich mikroserwisów, w tym User Service, i zapewnia, że tylko użytkownicy z odpowiednimi rolami mają dostęp do określonych zasobów.
- `Garage Service` i inne mikroserwisy mogą wymagać dostępu do danych użytkowników przechowywanych w User Service (np. w celu przypisania użytkownika do konkretnego garażu czy rozliczeń).

### 7. Baza danych i skrypty inicjalizacyjne
- `data.sql` - skrypt inicjalizujący bazę danych z rolami, które są dostępne w systemie, takimi jak `ROLE_ADMIN`, `ROLE_MODERATOR`, `ROLE_GARAGE`, `ROLE_CLIENT`.
- `application.yml` - konfiguracja aplikacji, w tym dane dostępowe do bazy danych (PostgreSQL) oraz sekrety związane z JWT. Plik ten zapewnia również integrację z innymi mikroserwisami, jeśli takie są potrzebne.

### 8. Testy
- `UserServiceApplicationTests.java` - testy jednostkowe, które weryfikują poprawność działania aplikacji, takie jak ładowanie kontekstu aplikacji. Testy są istotne w środowisku mikroserwisów, ponieważ umożliwiają weryfikację działania mikroserwisu w izolacji przed jego integracją z resztą systemu.

## Podsumowanie

User Service jest kluczową częścią mikroserwisów backendowych, zarządzającą użytkownikami w systemie.
Działa w ramach większego ekosystemu, gdzie inne usługi, takie jak API Gateway oraz Garage Service,
współdziałają z nią, aby zapewnić pełną funkcjonalność systemu. User Service oferuje zarządzanie 
kontami użytkowników, autoryzację za pomocą JWT, kontrolę dostępu na podstawie ról oraz integrację
z innymi usługami poprzez standardowe interfejsy API.







