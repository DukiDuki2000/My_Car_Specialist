package com.apsi_projekt.garage_service.dto;

public class CompanyInfo {
    private String companyName;
    private String companyAddress;
    private String workingAddress;
    private String companyNip;
    private String companyRegon;

    public CompanyInfo() {}

    public CompanyInfo(String companyName, String companyAddress,String workingAddress, String companyRegon, String companyNip) {
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.workingAddress = workingAddress;
        this.companyRegon = companyRegon;
        this.companyNip = companyNip;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyAddress() {return companyAddress;}

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getCompanyNip() {
        return companyNip;
    }

    public void setCompanyNip(String companyNip) {
        this.companyNip = companyNip;
    }

    public String getCompanyRegon() {
        return companyRegon;
    }

    public void setCompanyRegon(String companyRegon) {
        this.companyRegon = companyRegon;
    }

    public String getAddresOFWHAT(){
        return (companyAddress != null && !companyAddress.isEmpty()) ? companyAddress : workingAddress;
    }
}
