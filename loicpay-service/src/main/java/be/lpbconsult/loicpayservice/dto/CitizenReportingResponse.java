package be.lpbconsult.loicpayservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
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

    @Getter
    @Setter
    public static class LabelledValue {
        private String key;
        private String value;

        public LabelledValue(String key, String value) {
            this.key = key;
            this.value = value;
        }
    }
}

