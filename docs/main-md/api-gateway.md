**API Gateway** pełni rolę centralnego punktu komunikacji dla mikroserwerów systemu
"*My Car Specialist*". Wszystkie usługi z różnych domen (garaż, powiadomienia, rekomendacje,
użytkownicy, pojazdy) są połączone z API Gateway, który pełni rolę posrednika,
umożliwiającego wygodne komunikowanie się między front-endem a mikroserwisami.  

API Gateway zapewnia:  

- jednolitą strukturę API,  
- wygodny dostęp do wszystkich funkcji systemu.  

Dzięki tej architekturze system jest bardziej skalowalny i łatwiejszy w utrzymaniu.

**Funkcjonalnosć i implementacja**

Każdy mikroserwer posiada dedykowaną klasę *klient REST* do komunikacji:

- *RestGarageServiceClient* - klienci wchodzą w interakcje z mikroserwisem garażowym,
- *RestNotificationServiceClient* - klienci odpowiadają za komunikacją z serwisem powiadomień.
- *RestRecommendationServiceClient* - komunikacja z mikroserwisem rekomendacyjnym.
- *RestUserServiceClient* - zapewnia interakcję z serwisem użytkowników.
- *RestVehicleServiceClient* - klient odpowiedzialny za komunikację z serwisem pojazdów.

Klienci korzystają z *RestClint* do wysyłania żądań HTTP do odpowiednich mikroserwisów.
Każdy klient jest konfigurowany za pomocą adresu URL mikroserwisu, pobieranego z pliku *application.properties*.

Każdy mikroserwis ma przypisany *kontroler REST*, który obsługuje żądania przychodzące od
API Gateway i deeguje je do odpowiednich klientów:

- *GarageRestController* dla mikroserwisu garażowego,
- *NotificationRestController* dla mikroserwisu powiadomień,
- *RecommendationRestController* dla mikroserwisu rekomendacji,
- *UserRestController* dla mikroserwisu użytkowników,
- *VehicleRestController* dla mikroserwisu pojazdów.

Każdy kontroler udostępnia endpoint obsługujący metodę GET na scieżce odpowiadającej
domenie mikroserwisu. Dodatowo API Gateway posiada punkt końcowy */hello*, który umożliwia
testowanie dostępnosci usługi i potwierdzenie działania serwera API. Punkt ten jest realizowany
przez metodę *hello*, która zawiera komunikat powitalny, umożliwiający weryfikację działania aplikacji.

**Technologie**

- Spring Boot - do budowy backendu oraz mikroserwisowej komunikacji.
- Sprinf RestTemplate / RestClient - do obsługi zapytań HTTP.
- Spring Boot Annotations - m.in. *@RestController*, *@Service* oraz *@Value* do wstrzykiwania zależnosci z konfiguracji.

**Przykład klienta REST**

W pliku *@RestGarageServiceClient.java* znajduje się implementcja klienta, który łączy się z
serwisem garażowym. Jest to przykład jak komunikować się z każdym z mikroserwisów:

```js title="RestGarageServiceClient.java" linenums="8"
@Service
public class RestGarageServiceClient {
    private final RestClient restClient;

    RestGarageServiceClient(@Value("${services.garage_service}") String garageServiceUrl) {
    this.restClient = RestClient.create(garageServiceUrl);
}

    public String getHello() {
        return restClient.get()
            .uri("garage")
            .retrieve()
            .body(new ParameterizedTypeReference<>() {});
    }
}

```

**Gradle Wrapper**

W projekcie znajduje się plik *gradle.bat*, który umożliwia budowanie i uruchamianie projektu
przy użyciu gradle Wrapper. Zapewnia on odpwoednia wersję Gradle do pracy z projektem.

**Podsumowanie** 

API Gateway pełni kluczową rolę w systemie "*My Car Specialist*", zarządzając routingiem i
ujednolicając dostęp do różnych mikroserwisów. Dzięki modlarnej strukturze (kontrolery,
klienci REST), łatwo jest zarządzać kodem i rozszerzać funkcjonalnosc. Plik konfiguracujny
*application.properties* pozwala na elastyczną zmianę eddpointów mikroserwisów, co ułatwia
wdrażanie w różnych srodowiskach.