Recommendation Service to mikroserwis wykorzystujący Gradle jako narzędzie do zarządzania zależnościami i budową
aplikacji. W folderze `wrapper` znajduje się plik `gradle-wrapper.properties`, który konfiguruje
dostęp do narzędzia Gradle, umożliwiając korzystanie z określonej wersji Gradle bez potrzeby jej instalowania globalnie.

## Główne komponenty aplikacji
### `RecommendationServiceApplication.java`

Plik ten zawiera główną klasę aplikacji, która uruchamia serwis rekomendacji. Aplikacja jest skonfigurowana
przy pomocy adnotacji `@SpringBootApplication`, co umożliwia jej uruchomienie w środowisku Spring Boot.
To główny punkt wejściowy aplikacji, który uruchamia całą logikę systemu.

```js title="RecommendationServiceApplication.java" linenums="8"
@SpringBootApplication
public class RecommendationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecommendationServiceApplication.class, args);
    }
}
```
### RecommendationRestController.java

W tym pliku znajduje się kontroler REST, który udostępnia proste API pod ścieżką `/recommendation`.
W tej wersji aplikacji kontroler zawiera jedną metodę, która zwraca komunikat powitalny:
```js title="RecommendationServiceApplicationTests.java" linenums="7"
@RestController
@RequestMapping("recommendation")
public class RecommendationRestController {

    public RecommendationRestController() {
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from Recommendation Service!";
    }
}
```

## Plik konfiguracyjny
W folderze `resources` znajduje się plik `application.yml`, w którym konfigurowana jest aplikacja.
Określono tam nazwę aplikacji jako recommendation-service, co pozwala na łatwiejsze zarządzanie
i rozpoznawanie serwisów w systemie.
```yml title="application.yml" linenums="1"
spring:
  application:
    name: recommendation-service
```

## Testy

Plik testowy `RecommendationServiceApplicationTests.java` sprawdza, czy aplikacja poprawnie ładuje się
w kontekście Spring Boot. Testy te są podstawowe, ale ważne do zapewnienia poprawności uruchomienia aplikacji.
```js title="RecommendationServiceApplicationTests.java" linenums="6"
@SpringBootTest
class RecommendationServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}
```

## Funkcjonalności serwisu

Recommendation Service to prosty serwis, który na chwilę obecną udostępnia jedynie metodę GET
na ścieżce /recommendation, zwracającą komunikat powitalny. W przyszłości serwis zostanie rozbudowany.

[//]: # (Jest to wstępna wersja serwisu, który w przyszłości będzie rozbudowany o funkcjonalności związane z generowaniem rekomendacji dla użytkowników. Na przykład, serwis może wykorzystywać dane o preferencjach użytkowników lub historię ich działań w systemie, aby oferować spersonalizowane propozycje produktów, usług czy innych zasobów w obrębie całego systemu.)