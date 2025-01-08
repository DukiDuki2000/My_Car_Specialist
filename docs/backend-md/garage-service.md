Garage Service jest mikroserwisem w systemie "*My Car Specialist*", który zarządza danymi warsztatów
samochodowych oraz umożliwia ich integrację z zewnętrznymi API, takimi jak API podatkowe (VAT). Jego funkcje
obejmują m.in. obsługę zgłoszeń nowych warsztatów, przechowywanie szczegółowych informacji o firmach, walidację
danych oraz integrację z innymi usługami systemu. Dzięki temu mikroserwisowi system oferuje centralny punkt
zarządzania informacjami o warsztatach.

## Główna aplikacja

Główna klasa aplikacji Spring Boot uruchamia kontekst Spring, definiuje podstawowe komponenty (np.
`RestTemplate` do obsługi zewnętrznych zapytań HTTP) oraz zarządza konfiguracją całej aplikacji.

```js title="GarageServiceApplication.java" linenums="11"
@SpringBootApplication
public class GarageServiceApplication {

    public static void main(String[] args) {
    SpringApplication.run(GarageServiceApplication.class, args);
    }
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```
Komponent `RestTemplate` jest wykorzystywany do wysyłania żądań HTTP do zewnętrznego API (np. API VAT),
co pozwala na weryfikację danych o firmach w czasie rzeczywistym.

## Model danych

### Encja `Garage`
Encja `Garage` reprezentuje warsztat samochodowy i odpowiada tabeli w bazie danych. Zawiera szczegółowe
informacje o warsztacie, takie jak nazwa firmy, NIP, REGON, numery IBAN oraz dane kontaktowe.

**Adnotacje na poziomie klasy**
```js title="Garage.java" linenums="18"
@Table (name = "garages", uniqueConstraints = {
    @UniqueConstraint(columnNames = "nip"),
    @UniqueConstraint(columnNames = "regon")
})
```

- `@Entity` – definiuje tę klasę jako encję JPA, co oznacza, że jej obiekty mogą być mapowane do rekordów w bazie danych.
- `@Table` – określa nazwę tabeli w bazie danych jako "garages", a także definiuje unikalne ograniczenia dla kolumn nip
oraz regon, aby zapobiec duplikatom tych danych.

**Pola klasy**

Każde pole w klasie odpowiada kolumnie w tabeli bazy danych.

```js title="Garage.java" linenums="24"
private @Id
@GeneratedValue(strategy = GenerationType.AUTO)
Long Id;
```

- `@Id` – wskazuje główny klucz encji.
- `@GeneratedValue(strategy = GenerationType.AUTO)` – definiuje automatyczne generowanie wartości klucza głównego.

**NIP**
```js title="Garage.java" linenums="28"
@NotBlank
@NotNull
@Size(min = 10, max = 10, message = "Nip length must be exactly 10")
@Pattern(regexp = "\\d{10}")
@Column(name = "nip", nullable = false, updatable = false, unique = true, length = 10)
String nip;
```
**REGON**
```js title="Garage.java" linenums="35"
@NotBlank
@NotNull
@Size(min = 7, max = 14, message = "REGON length must be 7 or 9 or 14")
@Pattern(regexp = "^\\d{7}$|\\d{9}$|\\d{14}$")
@Column(name = "regon", nullable = false, updatable = false, unique = true, length = 14)
String regon;
```
REGON obsługuje różne długości (7, 9 lub 14 cyfr), co odzwierciedla różne standardy identyfikacji.

**Lista rachunków IBAN**
```js title="Garage.java" linenums="58"
@NotNull
@ElementCollection(fetch = FetchType.LAZY)
@Column(name = "ibans", nullable = false, length = 35)
List<@NotBlank
@Pattern(regexp = "^[A-Z]{2}\\d{2}[A-Z0-9]{4,30}$")
@Size(min = 15, max = 34) String> ibans;
```

- `@ElementCollection` – wskazuje, że pole przechowuje listę wartości.
- `@Pattern` – wymusza format zgodny ze standardem IBAN (krajowy kod i cyfry).
- `@Size(min` = 15, max = 34) – definiuje długość IBAN w zależności od kraju.

### DTO: `CompanyInfo`
Obiekt DTO (Data Transfer Object), który służy do przesyłania danych o firmie w wyniku integracji
z zewnętrznymi API.

```js title="CompanyInfo.java" linenums="8"
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyInfo {
    private String name;
    private String address;
    private String nip;
    private String regon;
}
```

## Repozytoria

### GarageRepository
Repozytorium JPA do zarządzania danymi warsztatów w bazie danych.

```js title="GarageRepository.java" linenums="6"
public interface GarageRepository extends JpaRepository<Garage, Long> {
    Optional<Garage> findByNip(String nip);
}
```
Repozytorium umożliwia wykonywanie operacji CRUD oraz dostarcza metodę do wyszukiwania warsztatu
na podstawie numeru NIP.

## Usługi

### GarageService
Klasa GarageService odpowiada za obsługę logiki biznesowej związanej z warsztatami oraz integrację
z API podatkowym VAT. Wykorzystuje komponent RestTemplate do komunikacji z zewnętrznym API oraz
repozytorium JPA do zarządzania danymi warsztatów. Główne funkcje:

- `getCompanyInfoByNip` - pozyskuje dane o firmie na podstawie numeru NIP z zewnętrznego API,
- `addGarage` - dodaje nowy warsztat do bazy danych.

```js title="GarageService.java" linenums="13" hl_lines="14 35"
@Service
public class GarageService {

    private final RestTemplate restTemplate;
    private final String apiUrl = "https://wl-api.mf.gov.pl/api/search/nip/{nip}?date={date}";
    private final GarageRepository garageRepository;

    @Autowired
    public GarageService(RestTemplate restTemplate, GarageRepository garageRepository) {
    this.restTemplate = restTemplate;
    this.garageRepository = garageRepository;
}

public CompanyInfo getCompanyInfoByNip(String nip) {
    String date = LocalDate.now().toString();

    VATResposne response = restTemplate.getForObject(apiUrl, VATResposne.class, nip, date);

    if (response != null && response.getResult() != null && response.getResult().getSubject() != null) {

        VATResposne.Subject subject = response.getResult().getSubject();

        return new CompanyInfo(
            subject.getName(),
            subject.getResidenceAddress(),
            subject.getWorkingAddress(),
            subject.getRegon(),
            subject.getNip()
        );
    } else {
        throw new RuntimeException("Nie znaleziono danych dla NIP: " + nip);
    }
}

    public Garage addGarage(Garage newGarage) {
        return garageRepository.save(newGarage);
    }
}
```

## Kontrolery REST
### `GarageOpenApiController`
Publiczny kontroler REST obsługujący integrację z API VAT oraz umożliwiający zgłoszenia nowych warsztatów.

```js title="GarageOpenApiController.java" linenums="15"
@RestController
@RequestMapping("/garage/openApi")
@RequiredArgsConstructor
public class GarageOpenApiController {

    private final GarageService garageService;

    @GetMapping("/{nip}")
    public ResponseEntity<CompanyInfo> getCompanyInfo(@PathVariable String nip) {
        return ResponseEntity.ok(garageService.getCompanyInfo(nip));
    }
}
```
### `GarageRestController`
Chroniony kontroler REST umożliwiający zarządzanie danymi warsztatów.

```js title="GarageRestController.java" linenums="17"
@RestController
@RequestMapping("/garage")
@RequiredArgsConstructor
public class GarageRestController {

    private final GarageService garageService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> addGarage(@RequestBody Garage garage) {
        garageService.addGarage(garage);
            return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
```

## Bezpieczeństwo
### `SecurityConfig`
Definiuje reguły bezpieczeństwa aplikacji, w tym dostęp do publicznych i chronionych endpointów.

```js title="SecurityConfig.java" linenums="14"
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/garage/openApi/**").permitAll()
            .anyRequest().authenticated();
    }
}
```

## Testy jednostkowe

Testy jednostkowe pozwalają na weryfikację poprawności działania serwisów i kontrolerów. Przykład testu
sprawdzającego załadowanie kontekstu aplikacji:

```js title="GarageServiceApplicationTests.java" linenums="6"
@SpringBootTest
class GarageServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}
```

## Podsumowanie

Garage Service to kluczowy mikroserwis w systemie "*My Car Specialist*" odpowiedzialny za obsługę warsztatów.
Dzięki integracji z API VAT, zarządzaniu danymi w bazie oraz precyzyjnym mechanizmom bezpieczeństwa, serwis
ten zapewnia kompleksowe wsparcie dla funkcji związanych z zarządzaniem warsztatami, co przekłada się na
lepsze działanie całego systemu.