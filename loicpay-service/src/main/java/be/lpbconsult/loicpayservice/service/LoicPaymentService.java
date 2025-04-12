package be.lpbconsult.loicpayservice.service;


import be.lpbconsult.loicpayservice.entity.BatchPayment;
import be.lpbconsult.loicpayservice.entity.LoicPayment;
import be.lpbconsult.loicpayservice.repository.LoicPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LoicPaymentService {

    @Autowired
    private LoicPaymentRepository loicPaymentRepository;

    @Autowired
    private BatchPaymentService batchPaymentService;

    @Transactional
    public void createLoicPayment(Long batchId, List<String[]> dataArray) throws Exception {
        List<LoicPayment> payments = new ArrayList<>();
        Optional<BatchPayment> batchPayment = batchPaymentService.getBatchPayment(batchId);
        if(batchPayment.isEmpty()) {
            throw new Exception("Batch not found");
        }
        for (String[] data : dataArray) {
            if(data.length != 47) {
                continue;
            }

            LoicPayment payment = new LoicPayment();
            payment.setIdBatchPayment(batchPayment.get());
            payment.setUnemploymentEntity(parseInt(data[1]));
            payment.setCitizenName(data[2]);
            payment.setSsin(data[6]);
            payment.setPostalCode(data[7]);
            payment.setCityName(data[8]);
            payment.setAddress(data[9]);
            payment.setCountry(parseInt(data[38]));
            payment.setRefMonth(parseInt(data[10]));
            payment.setClosingDate(data[41]);
            payment.setPayMonth(data[11]);
            payment.setDaysCovered(parseInt(data[12]));
            payment.setGrossAmountPaid(parseDecimal(data[13]));
            payment.setTotalRecov(parseDecimal(data[15]));
            payment.setPayscale(data[18]);
            payment.setEmplCode(data[19]);
            payment.setCitizenLanguage(data[20]);
            payment.setGender(data[21]);
            payment.setRecovNeo(parseDecimal(data[24]));
            payment.setWithholdingTaxAmountPaid(parseDecimal(data[30]));
            payment.setRecovNetAmount(parseDecimal(data[31]));
            payment.setRecovGrossAmount(parseDecimal(data[32]));
            payment.setRecov06(parseDecimal(data[33]));
            payment.setIban(data[35]);
            payment.setBic(data[36]);
            payment.setCompetentEntity(data[39]);
            payment.setBce(data[40]);
            payment.setTicketNbr(data[42]);
            payment.setNetPaid(parseDecimal(data[44]));
            payment.setLeaveType(data[45]);
            payment.setInterruptionRegime(data[46]);


            payments.add(payment);
        }

        loicPaymentRepository.saveAll(payments);

    }

    private Integer parseInt(String value) {
        try {
            return value != null && !value.isEmpty() ? Integer.parseInt(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private BigDecimal parseDecimal(String value) {
        try {
            if (value != null && !value.isEmpty()) {
                BigDecimal parsedValue = new BigDecimal(value.replace(",", "."));
                return parsedValue.setScale(2, RoundingMode.HALF_UP);
            }
            return null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

}
