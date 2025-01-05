package com.apsi_projekt.garage_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyInfo {
    private String companyName;
    private String companyAddress;
    private String workingAddress;
    private String companyNip;
    private String companyRegon;
}
