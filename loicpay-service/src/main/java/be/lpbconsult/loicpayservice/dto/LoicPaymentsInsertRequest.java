package be.lpbconsult.loicpayservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoicPaymentsInsertRequest {
    private Long paymentBatchId;
    private List<String[]> loicPayments;
}
