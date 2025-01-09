package com.apsi_projekt.vehicle_service.rest;

import com.apsi_projekt.vehicle_service.model.Vehicle;
import com.apsi_projekt.vehicle_service.model.VinDecodeResponse;
import com.apsi_projekt.vehicle_service.service.VinDecoderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import com.apsi_projekt.vehicle_service.repository.VehicleRepository;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<List<Vehicle>> getVehiclesByUserId(@PathVariable Long userId) {
        List<Vehicle> vehicles = vehicleRepository.findByUserId(userId);
        if (vehicles.isEmpty()) {
            throw new ResourceNotFoundException("There are no vehicles for user ID " + userId);
        }
        return ResponseEntity.ok(vehicles);
    }


}
