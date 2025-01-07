API Gateway jest kluczowym komponentem w architekturze mikroserwisów, który umożliwia zarządzanie ruchem
między różnymi mikroserwisami w systemie "*My Car Specialist*". Pełni rolę centralnego punktu, który
umożliwia routowanie zapytań HTTP do odpowiednich mikroserwisów, a także zapewnia mechanizmy
uwierzytelniania, autoryzacji, logowania oraz filtrowania. Dzięki centralnemu zarządzaniu ruchem, API
Gateway upraszcza komunikację pomiędzy mikroserwisami, zwiększając bezpieczeństwo oraz skalowalność systemu.

##Struktura aplikacji

### 1. Główna aplikacja

Główna aplikacja API Gateway uruchamia aplikację Spring Boot, która zarządza konfiguracją API Gateway
oraz definiuje punkty wejściowe do różnych usług mikroserwisowych.

```js title="ApiGatewayApplication.java" linenums="6"
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```
Aplikacja ta uruchamia główny kontekst Spring, umożliwiając konfigurację tras oraz integrację z innymi
mikroserwisami. Dzięki tej aplikacji możliwe jest zdefiniowanie reguł routingu i filtrów bezpieczeństwa.

### 2. Komponenty bezpieczeństwa

W ramach API Gateway stosowane są różne komponenty odpowiedzialne za bezpieczeństwo i monitorowanie
zapytań. Przykładem jest filtr `GlobalLoggingFilter`, który odpowiada za logowanie zapytań HTTP, co pozwala
na śledzenie aktywności w systemie.

```js title="GlobalLoggingFilter.java" linenums="9"
@Component
public class GlobalLoggingFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        System.out.println("Request passing through GlobalLoggingFilter: " + exchange.getRequest().getURI());
        return chain.filter(exchange);
    }
}
```
Filtry w API Gateway mogą być również wykorzystywane do weryfikacji tokenów JWT, sprawdzania uprawnień
użytkowników oraz wykonywania innych operacji przed przekazaniem zapytania do odpowiedniego mikroserwisu.

### 3. Pliki konfiguracyjne

Plik `application.yml` to plik konfiguracyjny dla głównej aplikacji, w którym definiowane są trasy
(routes) dla różnych mikroserwisów. Każda trasa wskazuje na konkretny mikroserwis i przypisuje jej
odpowiednią logikę filtrowania oraz predykaty, które określają, kiedy zapytania mają być kierowane
do danej usługi.

```yml title="application.yml" linenums="3" hl_lines="8"
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://user-service:8080
          predicates:
            - Path=/user/**
          filters:
            - name: RoleFilter
```
Plik `application-local.yml` dostosowuje konfigurację API Gateway do lokalnych warunków. W tym
przypadku zmienia adresy URI mikroserwisów na lokalne ścieżki, co umożliwia łatwiejsze testowanie
aplikacji w środowisku deweloperskim.

```yml title="application-local.yml" linenums="3" hl_lines="8"
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
        routes:
            - id: user-service
              uri: http://localhost:8081
              predicates:
                - Path=/user/**
              filters:
              - name: RoleFilter
```

### 4. Testy jednostkowe

Testy jednostkowe w projekcie zapewniają, że aplikacja poprawnie ładuje kontekst Spring Boot oraz nie występują
błędy w konfiguracji. Testy te są kluczowe dla utrzymania integralności aplikacji w miarę jej rozwoju.

```js title="ApiGatewayApplication.java" linenums="6"
@SpringBootTest
class ApiGatewayApplicationTests {

    @Test
    void contextLoads() {
    }
}
```
Testy jednostkowe pozwalają na wczesne wykrywanie problemów, co zmniejsza ryzyko błędów w produkcji
oraz umożliwia szybszy rozwój aplikacji.

## Podsumowanie

API Gateway stanowi fundament wydajnej, bezpiecznej i łatwej w utrzymaniu architektury mikroserwisów.
Dzięki centralnemu zarządzaniu ruchem, logowaniem oraz kontroli dostępu, API Gateway umożliwia
skuteczne zarządzanie komunikacją między mikroserwisami. Mechanizmy takie jak filtrowanie zapytań
oraz weryfikacja JWT zapewniają pełną kontrolę nad dostępem do poszczególnych usług, co jest kluczowe
w systemach, w których bezpieczeństwo i skalowalność mają najwyższe znaczenie.