Notification Service to mikroserwis odpowiedzialny za obsługę powiadomień.
Serwis korzysta z Spring Boot, oferując REST API z autoryzacją opartej na
rolach użytkowników.

## Sturktura projektu
### Gradle Wrapper

W folderze `wrapper` znajdują się pliki konfigurujące `Gradle Wrapper`:
```properties title="gradle-wrapper.properties" linenums="1"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.11.1-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```
`distributionUrl` – wskazuje wersję Gradle (8.11.1), która jest używana do budowania projektu.

### Główne komponenty aplikacji
**Plik `NotificationServiceApplication.java`**
```js title="NotificationServiceApplication.java" linenums="8"
@SpringBootApplication
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}
```
Uruchamia aplikację Spring Boot. Jest to punkt wejścia dla serwisu.

**REST API**
```js title="NotificationRestController.java" linenums="8"
@RestController
@RequestMapping("notification")
public class NotificationRestController {

    public NotificationRestController() {
    }

    @GetMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String sayHello() {
        return "Hello from Notification Service!!";
    }
}
```
Ścieżka bazowa: `/notification`. Metoda `GET` zwraca komunikat powitalny.
`@PreAuthorize` zapewnia ograniczony dostęp - mają go jedynie użytkownicy z rolą ROLE_ADMIN.

**Bezpieczeństwo**

Plik `AuthEntryPoint.java` obsługuje błędy autoryzacji.
```js title="AuthEntryPoint.java" linenums="18"
@Component
public class AuthEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPoint.class);

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authExteption)
    throws IOException {
    logger.error("Unauthorized error: {}", authExteption.getMessage());

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    final Map<String, Object> body = new HashMap<>();
    body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
    body.put("error", "Unauthorized");
    body.put("message", authExteption.getMessage());
    body.put("path", request.getServletPath());

    final ObjectMapper mapper = new ObjectMapper();
    mapper.writeValue(response.getOutputStream(), body);
}
}
```
Przy braku autoryzacji zwraca komunikat JSON z kodem `401 Unauthorized`.

**`Plik AuthFilter.java`**

Filtruje żądania i odczytuje role użytkowników z nagłówka `X-Roles`.
```js title="NotificationServiceApplicationTests.java" linenums="19"
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    throws ServletException, IOException {
        String rolesHeader = request.getHeader("X-Roles");
    
        if (rolesHeader != null) {
            try {
                List<String> roles = Arrays.asList(rolesHeader.split(","));
    
                List<GrantedAuthority> authorities = roles.stream()
                    .map(role -> new SimpleGrantedAuthority(role.trim()))  // Role muszą być odpowiednio sformatowane
                    .collect(Collectors.toList());
    
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    null, null, authorities
                );
    
                SecurityContextHolder.getContext().setAuthentication(authentication);
    
            } catch (Exception e) {
                logger.error("Error reading roles from X-Roles header: {}", e);
            }
        }
    
        filterChain.doFilter(request, response);
    }
```
Wczytuje role z nagłówka HTTP i przypisuje je do bieżącego kontekstu zabezpieczeń.

**`Plik SecurityConfig.java`**

Konfiguracja Spring Security.
```js title="NotificationServiceApplicationTests.java" linenums="13"
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private AuthEntryPoint unauthorizedHandler;

    @Bean
    public AuthFilter authenticationFilter() {
        return new AuthFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
.exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
.authorizeHttpRequests(auth ->
    auth.requestMatchers("/openApi/**").permitAll()
.anyRequest().authenticated()
);

    http.addFilterBefore(authenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
}
```

- Wyłącza CSRF.
- Ustawia sesję jako stateless.
- Dodaje filtr `AuthFilter`.
- Ścieżki `/openApi/**` są publicznie dostępne.

### Testy
```js title="NotificationServiceApplicationTests.java" linenums="6"
@SpringBootTest
class NotificationServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}
```
Testuje podstawową funkcjonalność wczytywania kontekstu aplikacji.

## Funkcjonalności serwisu

OSerwis Notification Service zapewnia funkcjonalność obsługi REST API, które jest
dostępne pod ścieżką `/notification`. Dzięki integracji z Spring Security aplikacja
umożliwia autoryzację użytkowników na podstawie ról przekazywanych w nagłówku
HTTP `X-Roles`. Role te są wykorzystywane do kontrolowania dostępu do metod kontrolera,
co pozwala na precyzyjne zarządzanie uprawnieniami. W przypadku nieautoryzowanych
żądań serwis zwraca czytelne komunikaty w formacie JSON, co ułatwia diagnostykę
błędów związanych z brakiem odpowiednich uprawnień.

## Podsumowanie
Notification Service to lekki mikroserwis z wbudowaną obsługą autoryzacji.
Dzięki konfiguracji Spring Security, obsłudze błędów oraz testom jednostkowym
spełnia wymagania dotyczące bezpieczeństwa i skalowalności w środowisku produkcyjnym.