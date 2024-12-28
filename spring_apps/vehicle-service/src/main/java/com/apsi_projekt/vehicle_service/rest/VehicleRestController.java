package com.apsi_projekt.vehicle_service.rest;

import com.apsi_projekt.vehicle_service.model.VinDecodeResponse;
import com.apsi_projekt.vehicle_service.service.VinDecoderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("vehicle")
public class VehicleRestController {

    private final VinDecoderService vinDecoderService;

    public VehicleRestController(VinDecoderService vinDecoderService) {
        this.vinDecoderService = vinDecoderService;
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from Vehicle Service";
    }


    @GetMapping("/decode-info/{vin}")
    public ResponseEntity<VinDecodeResponse> decodeInfo(@PathVariable("vin") String vin) {
        VinDecodeResponse response =vinDecoderService.decode(vin);
        return ResponseEntity.ok(response);
    }
}
