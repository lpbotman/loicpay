package be.lpbconsult.loicpayservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoicRecoveriesInsertRequest {
    private Long batchId;
    private List<String[]> loicRecoveries;
}
