package com.apsi_projekt.vehicle_service.model;

import java.util.List;

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

        public String getLabel() {
            return label;
        }
        public void setLabel(String label) {
            this.label = label;
        }

        public Object getValue() {
            return value;
        }
        public void setValue(Object value) {
            this.value = value;
        }

        public Integer getId() {
            return id;
        }
        public void setId(Integer id) {
            this.id = id;
        }
    }
}
