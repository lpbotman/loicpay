package be.lpbconsult.loicpayservice.service;


import be.lpbconsult.loicpayservice.entity.LoicPayment;
import be.lpbconsult.loicpayservice.repository.LoicPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class LoicPaymentService {

    @Autowired
    private LoicPaymentRepository loicPaymentRepository;

    @Transactional
    public String createLoicPayment(Long batchId, List<String[]> dataArray) {
        List<LoicPayment> payments = new ArrayList<>();

        for (String[] data : dataArray) {
            LoicPayment payment = new LoicPayment();
            payment.setIdBatchPayment(batchId);
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
            payment.setGrossAmountPaid(parseFloat(data[13]));
            payment.setTotalRecov(parseFloat(data[15]));
            payment.setPayscale(data[18]);
            payment.setEmplCode(data[19]);
            payment.setCitizenLanguage(data[20]);
            payment.setGender(data[21]);
            payment.setRecovNeo(parseFloat(data[24]));
            payment.setWithholdingTaxAmountPaid(parseFloat(data[30]));
            payment.setRecovNetAmount(parseFloat(data[31]));
            payment.setRecovGrossAmount(parseFloat(data[32]));
            payment.setRecov06(parseFloat(data[33]));
            payment.setIban(data[35]);
            payment.setBic(data[36]);
            payment.setCompetentEntity(data[39]);
            payment.setBce(data[40]);
            payment.setTicketNbr(data[42]);
            payment.setNetPaid(parseFloat(data[44]));
            payment.setLeaveType(data[45]);
            payment.setInterruptionRegime(data[46]);

            payments.add(payment);
        }

        loicPaymentRepository.saveAll(payments);

        return payments.size() + " lignes insérées";
    }

    private Integer parseInt(String value) {
        return value != null && !value.isEmpty() ? Integer.parseInt(value) : null;
    }

    private Float parseFloat(String value) {
        return value != null && !value.isEmpty() ? Float.parseFloat(value.replace(",", ".")) : null;
    }

}
