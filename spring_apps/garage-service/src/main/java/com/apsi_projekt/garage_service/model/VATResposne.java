package com.apsi_projekt.garage_service.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VATResposne {
    private Result result;

    @JsonProperty("result")
    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        private Subject subject;

        @JsonProperty("subject")
        public Subject getSubject() {
            return subject;
        }

        public void setSubject(Subject subject) {
            this.subject = subject;
        }
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Subject {
        private String name;
        private String nip;
        private String regon;
        private String residenceAddress;

        @JsonProperty("name")
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        @JsonProperty("nip")
        public String getNip() {
            return nip;
        }

        public void setNip(String nip) {
            this.nip = nip;
        }

        @JsonProperty("regon")
        public String getRegon() {
            return regon;
        }

        public void setRegon(String regon) {
            this.regon = regon;
        }

        @JsonProperty("residenceAddress")
        public String getResidenceAddress() {
            return residenceAddress;
        }

        public void setResidenceAddress(String residenceAddress) {
            this.residenceAddress = residenceAddress;
        }
    }
}
