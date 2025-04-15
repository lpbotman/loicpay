package be.lpbconsult.loicpayservice.dto;


import java.util.List;

public class CitizenReportingResponse {
    private String ssin;
    private int refMonth;
    private List<LabelledValue> data;
    private boolean ignored;
    private String labels;

    public CitizenReportingResponse(String ssin, int refMonth, List<LabelledValue> data, boolean ignored, String labels) {
        this.ssin = ssin;
        this.refMonth = refMonth;
        this.data = data;
        this.ignored = ignored;
        this.labels = labels;
    }

    public String getSsin() {
        return ssin;
    }

    public void setSsin(String ssin) {
        this.ssin = ssin;
    }

    public int getRefMonth() {
        return refMonth;
    }

    public void setRefMonth(int refMonth) {
        this.refMonth = refMonth;
    }

    public List<LabelledValue> getData() {
        return data;
    }

    public void setData(List<LabelledValue> data) {
        this.data = data;
    }

    public boolean isIgnored() {
        return ignored;
    }

    public void setIgnored(boolean ignored) {
        this.ignored = ignored;
    }

    public String getLabels() {
        return labels;
    }

    public void setLabels(String labels) {
        this.labels = labels;
    }

    public static class LabelledValue {
        private String key;
        private String value;

        public LabelledValue(String key, String value) {
            this.key = key;
            this.value = value;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }
    }
}

