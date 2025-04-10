package be.lpbconsult.loicpayservice.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

@Getter
@Setter
@Table(name = "loic_payment")
public class LoicPayment {

    @Id
    private Long id;
    private Long idBatchPayment;
    private Integer unemploymentEntity;
    private String citizenName;
    private String ssin;
    private String postalCode;
    private String cityName;
    private String address;
    private Integer country;
    private Integer refMonth;
    private String closingDate;
    private String payMonth;
    private Integer daysCovered;
    private Float grossAmountPaid;
    private Float totalRecov;
    private String payscale;
    private String emplCode;
    private String citizenLanguage;
    private String gender;
    private Float recovNeo;
    private Float withholdingTaxAmountPaid;
    private Float recovNetAmount;
    private Float recovGrossAmount;
    private Float recov06;
    private String iban;
    private String bic;
    private String competentEntity;
    private String bce;
    private String ticketNbr;
    private Float netPaid;
    private String leaveType;
    private String interruptionRegime;

    // Getters and setters
    // (le code des getters et setters est omis ici pour la concision)
}
