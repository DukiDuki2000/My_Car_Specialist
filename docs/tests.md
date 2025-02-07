## Opis testów

Wykonano skrypt w języku Python z wykorzystaniem modułów takich, jak `pytest`, `requests`,
`json`. Jako, że mikroserwisy są od siebie zależne, test zakłada, że w pierwszej kolejności
cała aplikacja została uruchomiona. Na test w ramach backendu składa się kilkanaście
zapytań odnośnie najważniejszych funkcjonalności aplikacji, takich jak:

- żywotność modułów,

- logowanie użytkownika,

- autoryzacja,

- dodawanie, usuwanie, wyszukiwanie garaży, pojazdów i zapytań.

## Przykładowy test

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

## Wyniki 

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