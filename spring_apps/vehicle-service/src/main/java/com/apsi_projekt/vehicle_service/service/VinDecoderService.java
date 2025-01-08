package com.apsi_projekt.vehicle_service.service;


import com.apsi_projekt.vehicle_service.config.VinDecoderProperties;
import com.apsi_projekt.vehicle_service.model.VinDecodeResponse;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.apache.commons.codec.digest.DigestUtils;

@Service
public class VinDecoderService {
    private static final String API_PREFIX = "https://api.vindecoder.eu/3.2";

    private final RestTemplate restTemplate;
    private final VinDecoderProperties vinProps;

    public VinDecoderService(RestTemplateBuilder builder, VinDecoderProperties vinProps) {
        this.restTemplate = builder.build();
        this.vinProps = vinProps;
    }


    public VinDecodeResponse decode(String vin) {
        String upperCaseVin = vin.toUpperCase();
        String id="decode";
        String controlString=String.format("%s|%s|%s|%s", upperCaseVin, id, vinProps.getApiKey(), vinProps.getSecretKey());
        String sha1Hash=DigestUtils.sha1Hex(controlString);
        String controlSum = sha1Hash.substring(0, 10);

        String url=String.format("%s/%s/%s/%s/%s.json",API_PREFIX,vinProps.getApiKey(),controlSum,id,upperCaseVin);
        ResponseEntity<VinDecodeResponse> response = restTemplate.getForEntity(url, VinDecodeResponse.class);
        VinDecodeResponse body = response.getBody();
        if (body != null && body.getDecode() != null) {
            for (VinDecodeResponse.DecodeItem item : body.getDecode()) {
                System.out.println("Label = " + item.getLabel() + ", Value = " + item.getValue());
            }
        }
        return response.getBody();

    }
}
