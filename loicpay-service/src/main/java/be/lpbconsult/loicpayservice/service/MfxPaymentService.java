package be.lpbconsult.loicpayservice.service;

import be.lpbconsult.loicpayservice.entity.BatchPayment;
import be.lpbconsult.loicpayservice.entity.MfxPayment;
import be.lpbconsult.loicpayservice.repository.MfxPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MfxPaymentService {

    @Autowired
    private MfxPaymentRepository mfxPaymentRepository;

    @Autowired
    private BatchPaymentService batchPaymentService;

    public void createMfxPayments(Long batchId, List<Map<String, String>> dataArray) throws NumberFormatException {
        Optional<BatchPayment> batchPaymentOptional = batchPaymentService.getBatchPayment(batchId);
        if (batchPaymentOptional.isEmpty()) {
            throw new RuntimeException("Batch not found");
        }

        List<MfxPayment> payments = new ArrayList<>();
        for (Map<String, String> data : dataArray) {
            try {
                MfxPayment payment = new MfxPayment();
                payment.setBatchPayment(batchPaymentOptional.get());
                payment.setUnemploymentEntity(parseInt(data.get("bc")));
                payment.setCitizenName(data.get("nom"));
                payment.setSsin(data.get("ssin"));
                payment.setPostalCode(data.get("cp"));
                payment.setCityName(data.get("commune"));
                payment.setAddress(data.get("rue"));
                payment.setRefMonth(Integer.valueOf(data.get("refMonth")));
                payment.setPayMonth(data.get("mois_pay"));
                payment.setDaysCovered(parseInt(data.get("jours")));
                payment.setGrossAmountPaid(parseDecimal(data.get("montant_brut"),100));
                payment.setTotalRecov(parseDecimal(data.get("montant_retenue"),100));
                payment.setNetPaid(parseDecimal(data.get("montant_net"),100));
                payment.setIban(data.get("cpt_financier"));
                payment.setPayscale(data.get("bareme"));
                payment.setEmplCode(data.get("code_empl"));
                payment.setCitizenLanguage(data.get("lang"));
                payment.setGender(data.get("sexe"));
                payment.setRecovNeo(parseDecimal(data.get("retenue_onem"),100));
                payment.setWithholdingTaxAmountPaid(parseDecimal(data.get("prec")));
                payment.setRecov06(parseDecimal(data.get("retenue06"),100));
                payment.setIban(data.get("iban"));
                payment.setBic(data.get("bic"));
                payment.setCountry(data.get("pays"));
                payment.setCompetentEntity(data.get("entite"));
                payment.setBce(data.get("bce"));

                payments.add(payment);
            } catch (NumberFormatException e) {
                System.out.println("NumberFormatException" + e.getMessage());
            }

        }
        mfxPaymentRepository.saveAll(payments);
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

