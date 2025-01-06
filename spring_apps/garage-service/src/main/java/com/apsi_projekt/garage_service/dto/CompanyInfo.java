package com.apsi_projekt.garage_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class CompanyInfo {
    private String companyName;
    private String companyAddress;
    private String workingAddress;
    private String companyRegon;
    private String companyNip;

}

