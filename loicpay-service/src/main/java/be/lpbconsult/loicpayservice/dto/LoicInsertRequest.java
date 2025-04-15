package be.lpbconsult.loicpayservice.dto;


import java.util.List;

public class LoicInsertRequest {
    private Long batchId;
    private List<String[]> loicRecords;

    public Long getBatchId() {
        return batchId;
    }

    public List<String[]> getLoicRecords() {
        return loicRecords;
    }
}
