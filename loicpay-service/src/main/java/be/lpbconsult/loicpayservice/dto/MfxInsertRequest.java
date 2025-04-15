package be.lpbconsult.loicpayservice.dto;

import java.util.List;
import java.util.Map;

public class MfxInsertRequest {
    private Long batchId;
    private List<Map<String, String>> mfxRecords;

    public Long getBatchId() {
        return batchId;
    }

    public List<Map<String, String>> getMfxRecords() {
        return mfxRecords;
    }
}
