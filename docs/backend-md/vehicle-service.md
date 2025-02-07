Vehicle Service to mikroserwis odpowiedzialny za zarządzanie pojazdami w systemie. Jego zadaniem jest
przechowywanie informacji o pojazdach, dekodowanie VIN (numerów identyfikacyjnych pojazdów) oraz zapewnienie
odpowiednich punktów dostępu (API) do tych danych. Usługa ta używa technologii Spring Boot oraz Spring
Security, co umożliwia integrację z innymi mikroserwisami, takimi jak API Gateway, oraz zapewnia odpowiednie
mechanizmy bezpieczeństwa.

## Struktura Vehicle Service

### 1. Podstawowa konfiguracja i uruchamianie aplikacji

**`VehicleServiceApplication.java`**

Jest to główna klasa uruchamiająca aplikację mikroserwisu za pomocą Spring Boot. Umożliwia ona uruchomienie
całego serwisu oraz integrację z innymi mikroserwisami w systemie, takimi jak API Gateway.
```js title="VehicleServiceApplication.java" linenums="8"
@SpringBootApplication
public class VehicleServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(VehicleServiceApplication.class, args);
    }
}
```

### 2. Konfiguracja VIN Dekodera 

**`VinDecoderProperties.java`**

Plik ten zawiera konfigurację API VIN Dekodera, czyli zewnętrznej usługi służącej do dekodowania numerów VIN
pojazdów. Przechowywane są tutaj klucze API, które umożliwiają dostęp do tej zewnętrznej usługi.
```js title="VinDecoderProperties.java" linenums="8"
@Configuration
@ConfigurationProperties(prefix = "vin.decoder")
public class VinDecoderProperties {
    private String apiKey;
    private String secretKey;

    // Getters and Setters
}
```

### 3. Model danych pojazdów

**`Vehicle.java`**

Model ten reprezentuje dane pojazdu przechowywane w bazie danych. Zawiera informacje takie jak VIN,
numer rejestracyjny, marka, model, rok produkcji, pojemność silnika, moc silnika, typ paliwa itp.
Klasa ta jest powiązana z tabelą w bazie danych.
```js title="Vehicle.java" linenums="9"
@Entity
@Table(name = "vehicles")
@Data
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="vin",nullable=false,updatable=false,unique=true)
    @NotBlank(message = "VIN cannot be blank")
    @Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
    private String vin;

    // Additional fields and annotations
}
```

**`VinDecodeResponse.java`**

Model odpowiedzi z zewnętrznej usługi dekodowania VIN. Zawiera listę obiektów DecodeItem, 
które zawierają szczegóły związane z pojazdem zdekodowanym na podstawie VIN.
```js title="VinDecodeResponse.java" linenums="5"
public class VinDecodeResponse {
    private List<DecodeItem> decode;

    public List<DecodeItem> getDecode() {
        return decode;
    }

    public void setDecode(List<DecodeItem> decode) {
    this.decode = decode;
    }
    
    public static class DecodeItem {
        private String label;
        private Object value;
        private Integer id;
    
        // Getters and Setters
    }
}
```

### 4. Repozytoria i operacje na danych

**`VehicleRepository.java`**

Repozytorium dla modelu Vehicle. Umożliwia wykonywanie operacji na bazie danych, takich jak
wyszukiwanie pojazdów po VIN, numerze rejestracyjnym, czy nazwie użytkownika.
```js title="VehicleRepository.java" linenums="9"
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle,Long> {
    Optional<Vehicle> findByVin(String vin);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    List<Vehicle> findByUserName(String userName);
}
```

### 5. REST API i kontrolery

**`VehicleRestController.java`**

Kontroler obsługujący żądania HTTP związane z pojazdami. Umożliwia dodawanie pojazdów, wyszukiwanie po VIN,
numerze rejestracyjnym oraz po nazwie użytkownika. Dodatkowo implementuje dekodowanie VIN.
```js title="VehicleRestController.java" linenums="18"
@RestController
@RequestMapping("vehicle")
public class VehicleRestController {

    private final VinDecoderService vinDecoderService;

    private final VehicleRepository vehicleRepository;

    public VehicleRestController(VinDecoderService vinDecoderService, VehicleRepository vehicleRepository) {

    this.vinDecoderService = vinDecoderService;
    this.vehicleRepository = vehicleRepository;
    }
    
    @PostMapping("/add")
    public ResponseEntity<Vehicle> create(@RequestBody Vehicle vehicle, HttpServletRequest request)  {
        String usernameHeader = request.getHeader("X-Username");
        String idHeader = request.getHeader("X-Id");
        vehicle.setUserId(Long.parseLong(idHeader));
        vehicle.setUserName(usernameHeader);
        Vehicle saved = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping()
    public String sayHello() {
        return "Hello from Vehicle Service!";
    }
    
    @GetMapping("/decode-info/{vin}")
    public ResponseEntity<VinDecodeResponse> decodeInfo(@PathVariable("vin") String vin) {
        VinDecodeResponse response =vinDecoderService.decode(vin);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/searchByVin/{vin}")
    public ResponseEntity<Vehicle> searchByVin(@PathVariable("vin") String vin) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findByVin(vin);
        return vehicleOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());}
    
    @GetMapping("/searchByReg/{reg}")
    public ResponseEntity<Vehicle> searchByRegistrationNumber(@PathVariable("reg") String reg) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findByRegistrationNumber(reg);
        return vehicleOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());}
    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchByUserName(HttpServletRequest request) {
        String usernameHeader = request.getHeader("X-Username");
        List<Vehicle> vehicles = vehicleRepository.findByUserName(usernameHeader);
        if (vehicles.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(vehicles);
        }
    }
}
```

### 6. Autentykacja i autoryzacja

**`AuthEntryPoint.java`**

Klasa implementująca punkt wejścia dla autoryzacji. Jest używana do zwracania odpowiedzi,
gdy użytkownik nie jest autoryzowany.
```js title="AuthEntryPoint.java" linenums="16"
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

**`AuthFilter.java`**

Filtr, który sprawdza role użytkownika w nagłówku `X-Roles` i przypisuje odpowiednie uprawnienia w
kontekście bezpieczeństwa.
```js title="AuthEntryPoint.java" linenums="19"
public class AuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String rolesHeader = request.getHeader("X-Roles");
        if (rolesHeader != null ) {
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
}
```

**`SecurityConfig.java`**

Konfiguracja bezpieczeństwa, w tym ustawienie filtrowania żądań oraz weryfikacja uprawnień 
do poszczególnych endpointów.
```js title="SecurityConfig.java" linenums="13"
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