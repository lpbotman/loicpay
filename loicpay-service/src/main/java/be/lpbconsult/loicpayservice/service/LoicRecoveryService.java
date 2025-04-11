package be.lpbconsult.loicpayservice.service;

import be.lpbconsult.loicpayservice.entity.BatchPayment;
import be.lpbconsult.loicpayservice.entity.LoicPayment;
import be.lpbconsult.loicpayservice.entity.LoicRecovery;
import be.lpbconsult.loicpayservice.repository.LoicRecoveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LoicRecoveryService {

    @Autowired
    private LoicRecoveryRepository loicRecoveryRepository;

    @Autowired
    private BatchPaymentService batchPaymentService;

    public void createLoicRecovery(Long batchId, List<String[]> dataArray) throws Exception {
        Optional<BatchPayment> batchPayment = batchPaymentService.getBatchPayment(batchId);
        if(batchPayment.isEmpty()) {
            throw new Exception("Batch not found");
        }

        List<LoicRecovery> recoveries = new ArrayList<>();
        for (String[] data : dataArray) {
            try {
                if(data.length != 32) {
                    continue;
                }
                LoicRecovery loicRecovery = new LoicRecovery();
                loicRecovery.setBatchPayment(batchPayment.get());
                loicRecovery.setUnemploymentEntity(parseInt(data[0]));
                loicRecovery.setBreakerName(data[1]);
                loicRecovery.setSsin(data[2]);
                loicRecovery.setRefMonth(Integer.parseInt(data[3]));
                loicRecovery.setPayMonth(data[4]);
                loicRecovery.setRecovTotal(parseFloat(data[5]));
                loicRecovery.setRecovBalance(parseFloat(data[6]));
                loicRecovery.setRecovValidityDate(data[7]);
                loicRecovery.setRecovType(data[8]);
                loicRecovery.setC31(data[9]);
                loicRecovery.setRecovWithHoldingTax(parseFloat(data[10]));
                loicRecovery.setDebtNbr(data[11]);
                loicRecovery.setBban(data[12]);
                loicRecovery.setIban(data[13]);
                loicRecovery.setBic(data[14]);
                loicRecovery.setCc(data[15]);
                loicRecovery.setCompetentEntity(data[16]);
                loicRecovery.setClosingDate(data[17]);
                loicRecovery.setRecovTicketNbr(data[18]);
                loicRecovery.setRecovNetAmount(parseFloat(data[19]));
                loicRecovery.setRecovGrossAmount(parseFloat(data[20]));
                loicRecovery.setBreakerAddress(data[21]);
                loicRecovery.setBreakerPostalCode(data[22]);
                loicRecovery.setBreakerCityName(data[23]);
                loicRecovery.setBreakerCountry(data[24]);
                loicRecovery.setCreditorName(data[25]);
                loicRecovery.setComment(data[26]);
                loicRecovery.setCreditorAddress(data[27]);
                loicRecovery.setCreditorPostalCode(data[28]);
                loicRecovery.setCreditorCityName(data[29]);
                loicRecovery.setCreditorLanguage(data[30]);
                loicRecovery.setCreditorGender(data[31]);

                recoveries.add(loicRecovery);
            } catch (NumberFormatException e) {
                System.out.println("NumberFormatException");
            }
        }
        loicRecoveryRepository.saveAll(recoveries);
    }

    private Integer parseInt(String value) {
        try {
            return value != null && !value.isEmpty() ? Integer.parseInt(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Float parseFloat(String value) {
        try {
            return value != null && !value.isEmpty() ? Float.parseFloat(value.replace(",", ".")) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
