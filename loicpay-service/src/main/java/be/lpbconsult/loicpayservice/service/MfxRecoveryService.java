package be.lpbconsult.loicpayservice.service;

import be.lpbconsult.loicpayservice.entity.BatchPayment;
import be.lpbconsult.loicpayservice.entity.MfxRecovery;
import be.lpbconsult.loicpayservice.repository.MfxRecoveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MfxRecoveryService {

    @Autowired
    private MfxRecoveryRepository mfxRecoveryRepository;

    @Autowired
    private BatchPaymentService batchPaymentService;

    public void createMfxRecoveries(Long batchId, List<Map<String, String>> dataArray) throws Exception {
        Optional<BatchPayment> batchPaymentOptional = batchPaymentService.getBatchPayment(batchId);
        if (batchPaymentOptional.isEmpty()) {
            throw new Exception("Batch not found");
        }

        BatchPayment batch = batchPaymentOptional.get();

        List<MfxRecovery> recoveries = new java.util.ArrayList<>();
        for (Map<String, String> data : dataArray) {
            try {
                MfxRecovery recovery = new MfxRecovery();

                recovery.setBatchPayment(batch);
                recovery.setUnemploymentEntity(parseInt(data.get("unemployment_entity")));
                recovery.setCreditorName(data.get("nom"));
                recovery.setSsin(data.get("ssin"));
                recovery.setRefMonth(parseInt(data.get("refMonth")));
                recovery.setPayMonth(data.get("mois_pay"));
                recovery.setGross(parseDecimal(data.get("ret_bedrag"),100));
                recovery.setNet(parseDecimal(data.get("ret_net"),100));
                recovery.setBalance(parseDecimal(data.get("ret_saldo"),100));
                recovery.setType(data.get("ret_type"));
                recovery.setC31(data.get("num_C31"));
                recovery.setWithHoldingTax(parseDecimal(data.get("ret_prec"),100));
                recovery.setDebtNbr(data.get("ret_schuld_nr"));
                recovery.setIban(data.get("ret_iban"));
                recovery.setBic(data.get("ret_bic"));

                recoveries.add(recovery);

            } catch (NumberFormatException e) {
                System.out.println("NumberFormatException");
            }
        }
        mfxRecoveryRepository.saveAll(recoveries);
    }

    private Integer parseInt(String value) {
        try {
            return (value != null && !value.isBlank()) ? Integer.parseInt(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private BigDecimal parseDecimal(String value) {
        return parseDecimal(value, 1);
    }

    private BigDecimal parseDecimal(String value, int divisor) {
        try {
            if (value != null && !value.isBlank()) {
                BigDecimal parsedValue = new BigDecimal(value.replace(",", "."));

                return parsedValue.divide(BigDecimal.valueOf(divisor), 2, RoundingMode.HALF_UP);
            }
            return null;
        } catch (NumberFormatException | ArithmeticException e) {
            return null;
        }
    }
}
