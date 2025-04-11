package be.lpbconsult.loicpayservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class MfxPaymentsInsertRequest {
    private Long batchId;
    private List<Map<String, String>> mfxPayments;
}
