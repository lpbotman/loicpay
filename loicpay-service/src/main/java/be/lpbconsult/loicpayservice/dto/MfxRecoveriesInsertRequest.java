package be.lpbconsult.loicpayservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class MfxRecoveriesInsertRequest {
    private Long batchId;
    private List<Map<String, String>> mfxRecoveries;
}
