package com.apsi_projekt.garage_service.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Setter;

import java.util.List;

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
        @Setter
        private String name;
        @Setter
        private String nip;
        @Setter
        private String regon;
        @Setter
        private String residenceAddress;
        @Setter
        private String workingAddress;
        @Setter
        private List<String> ibans;

        @JsonProperty("accountNumbers")
        public List<String> getIbans() {
            return ibans;
        }
        @JsonProperty("name")
        public String getName() {
            return name;
        }

        @JsonProperty("nip")
        public String getNip() {
            return nip;
        }

        @JsonProperty("regon")
        public String getRegon() {
            return regon;
        }

        @JsonProperty("residenceAddress")
        public String getResidenceAddress() {
            return residenceAddress;
        }


        @JsonProperty("workingAddress")
        public String getWorkingAddress() {return workingAddress;}


    }
}
