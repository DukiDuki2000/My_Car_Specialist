## Frontend


### 1. Testy automatyczne

#### 1.1. Testowanie formularza logowania

- Sprawdzenie poprawności działania formularza logowania.

- Dla poprawnych danych użytkownik zostaje przekierowany na panel użytkownika.

- Dla niepoprawnych danych system wyświetla komunikat o błędzie.

#### 1.2. Test przycisku wylogowania

- Sprawdzenie, czy kliknięcie przycisku usuwa dane użytkownika z `localStorage`, powodując wylogowanie.


### 2. Testy manualne (scenariusze)

#### 2.1. Test użytkownika - klienta

2.1.1. Sprawdzenie funkcjonowania formularza rejestracji

**Poprawne dane:**

- Wprowadzenie poprawnych danych i potwierdzenie rejestracji powoduje utworzenie konta.

**Niepoprawne dane:**

- Dla błędnie skonstruowanego e-maila system wyświetla komunikat o błędzie.

2.1.2. Sprawdzenie funkcjonowania logowania

**Poprawne dane:**

- Dla poprawnych danych logowania użytkownik zostaje przekierowany na panel klienta.

**Niepoprawne dane:**

- Dla niepoprawnych danych system wyświetla komunikat o błędzie.

2.1.3. Sprawdzenie poprawności działania przycisków panelu

- **Pojazdy**

    - Przycisk przekierowuje na panel do zarządzania pojazdami.

    - **Dodaj pojazd** – przenosi do formularza dodawania pojazdu.

    - **Twoje pojazdy** – przenosi do listy przypisanych pojazdów.

- **Nowe zlecenie**

    - Przycisk przekierowuje do formularza dodawania nowego zgłoszenia.

- **Lista zleceń**

    - Przycisk przekierowuje do wyboru aktualnych i archiwalnych zleceń.

    - **Aktualne zlecenia** – wyświetla stronę z otwartymi zleceniami.

    - **Historia zleceń** – pokazuje zamknięte zgłoszenia.

2.1.4. Sprawdzenie dodawania auta do użytkownika

A. Przejście z głównego menu klienta do strony **Pojazdy**.

B. Przejście do formularza **Dodaj pojazd**.

C. Wypełnienie formularza:

   **Case 1:**

    - Wprowadzenie poprawnego numeru VIN.

    - Sprawdzenie działania dekodowania VIN.

    - Dodanie pojazdu.

   **Case 2:**

    - Wprowadzenie niepoprawnego numeru VIN.

    - Sprawdzenie, czy system zgłasza błąd.

2.1.5. Sprawdzenie, czy auto zostało przypisane do użytkownika

1. Przejście do strony **Pojazdy**.

2. Sprawdzenie, czy pojazd pojawił się w bazie danych i jest przypisany do użytkownika.

2.1.6. Sprawdzenie funkcjonowania dodawania nowego zgłoszenia serwisowego

   **Case 1:**
    
    - Wybranie pojazdu i miasta.
    
    - Sprawdzenie, czy wyświetlany jest odpowiedni warsztat.
    
    - Uzupełnienie pola "Opis usługi".
    
    - Wysłanie zgłoszenia.
    
   **Case 2:**
    
    - Wybranie pojazdu i uzupełnienie opisu bez wyboru warsztatu.
    
    - Sprawdzenie, czy przycisk "Wyślij" jest zablokowany.
    
   **Case 3:**
    
    - Wybranie warsztatu i uzupełnienie opisu bez wyboru pojazdu.
    
    - Sprawdzenie, czy przycisk "Wyślij" jest zablokowany.


### 3. Test użytkownika - warsztatu

#### 3.1. Sprawdzenie formularza rejestracji warsztatu

   **Case 1:**

    - Wprowadzenie poprawnego NIP-u.

    - Sprawdzenie automatycznego uzupełniania danych.

    - Wysłanie zgłoszenia.

   **Case 2:**

    - Wprowadzenie niepoprawnego NIP-u.
    
    - Sprawdzenie, czy pola nie zostały uzupełnione.

#### 3.2. Sprawdzenie funkcjonowania logowania

- **Poprawne dane** – przekierowanie do panelu warsztatu.

- **Niepoprawne dane** – komunikat o błędzie.

#### 3.3. Sprawdzenie poprawności działania przycisków panelu

- **Sprawdzanie zgłoszeń** – przekierowanie do listy nowych zgłoszeń.

- **Aktualne zlecenia** – lista aktywnych zgłoszeń.

- **Historia zleceń** – przegląd zamkniętych zgłoszeń.

#### 3.4. Sprawdzenie panelu "Sprawdzanie zgłoszeń"

- Sprawdzenie, czy istnieje zgłoszenie od klienta.

- Kliknięcie **"Akceptuj"** przenosi zgłoszenie do aktualnych zleceń.

#### 3.5. Sprawdzenie funkcjonalności panelu "Aktualne zlecenia"

- Sprawdzenie danych klienta i pojazdu.

- Dodanie działań do zgłoszenia.

- Kliknięcie **"Zakończ zgłoszenie"** przenosi je do historii.

#### 3.6. Sprawdzenie panelu "Historia zleceń"

- Ukończone zgłoszenie jest widoczne z poprawnymi danymi.

- Kliknięcie **"PDF"** pobiera raport zgłoszenia.


### 4. Test użytkownika - moderatora

#### 4.1. Sprawdzenie funkcjonalności rejestracji warsztatu

- Wprowadzenie NIP-u i automatyczne uzupełnienie danych.

- Sprawdzenie poprawności danych.

#### 4.2. Sprawdzenie funkcjonowania logowania

- **Poprawne dane** – przekierowanie do panelu moderatora.

- **Niepoprawne dane** – komunikat o błędzie.

#### 4.3. Sprawdzenie poprawności działania przycisków panelu

- **Dane pojazdów** – wyszukiwanie pojazdów po VIN/tablicy.

- **Sprawdź prośby** – przegląd zgłoszeń warsztatów.

#### 4.4. Sprawdzenie panelu wyszukiwania pojazdu

- **Poprawny VIN/tablica** – wyświetlenie danych pojazdu.

- **Niepoprawny VIN/tablica** – komunikat "Nie znaleziono".

#### 4.5. Sprawdzenie panelu "Sprawdź prośby"

- Rozwijanie/zamykanie zgłoszeń warsztatów.

- Uzupełnianie danych i akceptacja zgłoszenia.

#### 4.6. Sprawdzenie poprawności rejestracji warsztatu

- Wylogowanie się.

- Próba logowania nowego warsztatu.

- Przekierowanie do panelu warsztatu.


## Backend

Wykonano skrypt w języku Python z wykorzystaniem modułów takich, jak `pytest`, `requests`,
`json`. Jako, że mikroserwisy są od siebie zależne, test zakłada, że w pierwszej kolejności
cała aplikacja została uruchomiona. Na test w ramach backendu składa się kilkanaście
zapytań odnośnie najważniejszych funkcjonalności aplikacji, takich jak:

- żywotność modułów,

- logowanie użytkownika,

- autoryzacja,

- dodawanie, usuwanie, wyszukiwanie garaży, pojazdów i zapytań.

### Przykładowy test

```python title="Przykładowy test"

dummy_data = {
  "nip": "1234567890",
  "regon": "361723374",
  "companyName": "CARPOLEX",
  "address": "Ryzowa, Warszawa",
  "phoneNumber": "09876543210",
  "description": "qwerty"
}

response = requests.post("http://localhost:8088/garage/openApi/add_request", json=dummy_data)
response_content = json.loads(response.text)
assert response.status_code == 201 and response_content["companyName"] == "CARPOLEX"

response = requests.get("http://localhost:8088/garage/request/all", headers={"x-roles": "ROLE_MODERATOR"})
response_content = json.loads(response.text)
exists = any(item.get("nip") == dummy_data["nip"] for item in response_content)
assert response.status_code == 200 and exists

response = requests.delete("http://localhost:8088/garage/request/" + dummy_data["nip"], headers={"x-roles": "ROLE_MODERATOR"})
assert response.status_code == 200

response = requests.get("http://localhost:8088/garage/request/all", headers={"x-roles": "ROLE_MODERATOR"})
response_content = json.loads(response.text)
exists = any(item.get("nip") == dummy_data["nip"] for item in response_content)
assert response.status_code == 200 and not exists
```

### Wyniki 

```markdown
(venv) C:\Users\Desktop\apsi\v2\tests>pytest -v -s --html=report.html
=================================================================== test session starts ===================================================================
platform win32 -- Python 3.10.0, pytest-8.3.4, pluggy-1.5.0 -- C:\Users\Desktop\apsi\v2\tests\venv\Scripts\python.exe
cachedir: .pytest_cache
metadata: {'Python': '3.10.0', 'Platform': 'Windows-10-10.0.22631-SP0', 'Packages': {'pytest': '8.3.4', 'pluggy': '1.5.0'}, 'Plugins': {'html': '4.1.1', 'metadata': '3.1.1'}}
rootdir: C:\Users\Wojtas\Desktop\apsi\v2\tests
plugins: html-4.1.1, metadata-3.1.1
collected 14 items

test_apsi.py::test_health Check services status:

Moduł: vehicle-service, Status: UP
Moduł: garage-service, Status: UP
Moduł: api-gateway, Status: UP
Moduł: user-service, Status: UP
Moduł: notification-service, Status: UP
Moduł: recommendation-service, Status: UP


PASSED
test_apsi.py::test_signin_success Testing signin in:

PASSED
test_apsi.py::test_signup_failure Testing signin up:

PASSED
test_apsi.py::test_authorization_old_token Testing autorization (old token):

PASSED
test_apsi.py::test_authorization_bad_token Testing autorization (bad token):

PASSED
test_apsi.py::test_authorization_success Testing autorization (good token):

PASSED
test_apsi.py::test_garage_request Testing requests:

PASSED
test_apsi.py::test_get_garege_all Testing garage searching:

PASSED
test_apsi.py::test_get_garage_city Testing garage filtering:

PASSED
test_apsi.py::test_company_by_nip Testing company searching:

PASSED
test_apsi.py::test_vehicle_hello_success Testing garage module communication:

PASSED
test_apsi.py::test_vehicle_hello_bad_token Testing vehicle module communication:

PASSED
test_apsi.py::test_search_vehicle Testing searching vehicle searching:

PASSED
test_apsi.py::test_search_vehicle_vin Testing searching vehicle filtering:

PASSED

------------------------------------ Generated html report: file:///C:/Users/Desktop/apsi/v2/tests/report.html -------------------------------------
=================================================================== 14 passed in 4.35s ====================================================================
```