import pytest
import requests
import json
from collections import Counter


def test_health(login):
    print("Check services status:\n")
    response = requests.get("http://localhost:8080/health")
    services = json.loads(response.text)
    one_is_down = False
    for service_name, details in services.items():
        status = details.get("status", "UNKNOWN")
        if status != "UP": one_is_down = True
        print(f"Moduł: {service_name}, Status: {status}")
    print("\n")

    assert response.status_code == 200 and not one_is_down


def test_signin_success():
    print("Testing signin in: \n")
    dummy_data = {
        "username": "admin",
        "password": "Administrator123"
    }
    expected_roles = ["ROLE_ADMIN", "ROLE_MODERATOR"]
    response = requests.post("http://localhost:8080/user/auth/signin", json=dummy_data)
    response_content = json.loads(response.text)
    assert response.status_code == 200 and Counter(expected_roles) == Counter(response_content["roles"])


@pytest.fixture()
def login() -> str:
    dummy_data = {
        "username": "admin",
        "password": "Administrator123"
    }
    response = requests.post("http://localhost:8080/user/auth/signin", json=dummy_data)
    response_content = json.loads(response.text)
    return response_content["accessToken"]


def test_signup_failure():
    print("Testing signin up: \n")

    dummy_data = {
      "username": "",
      "email": "",
      "role": [],
      "password": ""
    }

    response = requests.post("http://localhost:8088/user/auth/signup", json=dummy_data)
    response_content = json.loads(response.text)
    assert response.status_code == 401 and response_content["error"] == "Unauthorized"


def test_authorization_old_token():
    print("Testing autorization (old token): \n")

    old_token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3Mzg4NjUwMDYsImV4cCI6MTczODg2NTMwNiwiUm9sZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifSx7ImF1dGhvcml0eSI6IlJPTEVfTU9ERVJBVE9SIn1dfQ.HCc9PM_OzPzhl8MGX_PDnHgH20whSxSt9JotfMjiyFU"
    auth_header = {"Authorization": "Bearer " + old_token}
    response = requests.get("http://localhost:8088/garage", headers=auth_header)
    response_content = json.loads(response.text)
    assert response.status_code == 401 and response_content["error"] == "Token is expired"


def test_authorization_bad_token():
    print("Testing autorization (bad token): \n")

    bad_token = "yJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3Mzg4NjUwMDYsImV4cCI6MTczODg2NTMwNiwiUm9sZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifSx7ImF1dGhvcml0eSI6IlJPTEVfTU9ERVJBVE9SIn1dfQ.HCc9PM_OzPzhl8MGX_PDnHgH20whSxSt9JotfMjiyFU"
    auth_header = {"Authorization": "Bearer " + bad_token}
    response = requests.get("http://localhost:8080/garage", headers=auth_header)
    response_content = json.loads(response.text)
    assert response.status_code == 400 and response_content["error"] == "Token is invalid"


def test_authorization_success(login: str):
    print("Testing autorization (good token): \n")

    auth_header = {"Authorization": "Bearer " + login}
    response = requests.get("http://localhost:8080/garage", headers=auth_header)
    assert response.status_code == 200 and response.text == 'Hello from Garage Service'


def test_garage_request(login):
    print("Testing requests: \n")

    dummy_data = {
      "nip": "1234567890",
      "regon": "361723374",
      "companyName": "CARPOLEX",
      "address": "Ryzowa, Warszawa",
      "phoneNumber": "09876543210",
      "description": "qwerty"
    }

    auth_header = {"Authorization": "Bearer " + login}

    response = requests.post("http://localhost:8080/garage/openApi/add_request", json=dummy_data, headers=auth_header)
    response_content = json.loads(response.text)
    assert response.status_code == 201 and response_content["companyName"] == "CARPOLEX"

    response = requests.get("http://localhost:8080/garage/request/all", headers=auth_header)
    response_content = json.loads(response.text)
    exists = any(item.get("nip") == dummy_data["nip"] for item in response_content)
    assert response.status_code == 200 and exists

    response = requests.delete("http://localhost:8080/garage/request/" + dummy_data["nip"], headers=auth_header)
    assert response.status_code == 200

    response = requests.get("http://localhost:8080/garage/request/all", headers=auth_header)
    response_content = json.loads(response.text)
    exists = any(item.get("nip") == dummy_data["nip"] for item in response_content)
    assert response.status_code == 200 and not exists


def test_get_garege_all(login):
    print("Testing garage searching: \n")

    auth_header = {"Authorization": "Bearer " + login}
    response = requests.get("http://localhost:8080/garage/all", headers=auth_header)
    num_of_garages = len(json.loads(response.text))
    assert response.status_code == 200 and num_of_garages > 0


def test_get_garage_city(login):
    print("Testing garage filtering: \n")

    auth_header = {"Authorization": "Bearer " + login}
    response = requests.get("http://localhost:8080/garage/all/byCity/KIELCE", headers=auth_header)
    response_json = json.loads(response.text)
    only_kielce = all(item['address']['city'] == "KIELCE" for item in response_json)
    assert response.status_code == 200 and only_kielce


def test_company_by_nip():
    print("Testing company searching: \n")

    response = requests.get("http://localhost:8080/garage/openApi/5252344078")
    response_json = json.loads(response.text)
    returned_regon = response_json["companyRegon"]
    google_regon = '140182840'
    assert response.status_code == 200 and returned_regon == google_regon


def test_vehicle_hello_success(login: str):
    print("Testing garage module communication: \n")
    auth_header = {"Authorization": "Bearer " + login}
    response = requests.get("http://localhost:8080/vehicle", headers=auth_header)
    assert response.status_code == 200 and response.text == 'Hello from Vehicle Service!'


def test_vehicle_hello_bad_token():
    print("Testing vehicle module communication: \n")
    bad_token = "yJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3Mzg4NjUwMDYsImV4cCI6MTczODg2NTMwNiwiUm9sZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifSx7ImF1dGhvcml0eSI6IlJPTEVfTU9ERVJBVE9SIn1dfQ.HCc9PM_OzPzhl8MGX_PDnHgH20whSxSt9JotfMjiyFU"
    auth_header = {"Authorization": "Bearer " + bad_token}
    response = requests.get("http://localhost:8080/vehicle", headers=auth_header)
    response_content = json.loads(response.text)
    assert response.status_code == 400 and response_content["error"] == "Token is invalid"


def test_search_vehicle():
    print("Testing searching vehicle searching: \n")
    dummy_data = {
        "username": "usere",
        "password": "12345678"
    }
    response = requests.post("http://localhost:8080/user/auth/signin", json=dummy_data)
    response_content = json.loads(response.text)
    token = response_content["accessToken"]
    auth_header = {"Authorization": "Bearer " + token}
    response = requests.get("http://localhost:8080/vehicle/search", headers=auth_header)
    assert response.status_code == 200 and response.text


def test_search_vehicle_vin():
    print("Testing searching vehicle filtering: \n")
    dummy_data = {
        "username": "usere",
        "password": "12345678"
    }
    response = requests.post("http://localhost:8080/user/auth/signin", json=dummy_data)
    response_content = json.loads(response.text)
    token = response_content["accessToken"]
    auth_header = {"Authorization": "Bearer " + token}
    response = requests.get("http://localhost:8080/vehicle/searchByVin/1HGCM82633A004352", headers=auth_header)
    assert response.status_code == 200 and "GD123AB" in response.text