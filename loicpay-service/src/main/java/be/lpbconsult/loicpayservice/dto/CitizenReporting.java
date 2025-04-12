package be.lpbconsult.loicpayservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CitizenReporting {
    private String ssin;
    private int refMonth;
    private List<LabelledValue> data;

    public CitizenReporting(String ssin, int refMonth, List<LabelledValue> data) {
        this.ssin = ssin;
        this.refMonth = refMonth;
        this.data = data;
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

