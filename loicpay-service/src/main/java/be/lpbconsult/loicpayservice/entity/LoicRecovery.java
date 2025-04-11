package be.lpbconsult.loicpayservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "loic_recovery")
public class LoicRecovery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_batch_payment", referencedColumnName = "id")
    private BatchPayment batchPayment;

    @Column(name = "unemploymentEntity")
    private Integer unemploymentEntity;

    @Column(name = "breakerName")
    private String breakerName;

    @Column(name = "ssin")
    private String ssin;

    @Column(name = "refMonth")
    private Integer refMonth;

    @Column(name = "payMonth")
    private String payMonth;

    @Column(name = "recovTotal")
    private Float recovTotal;

    @Column(name = "recovBalance")
    private Float recovBalance;

    @Column(name = "recovValidityDate")
    private String recovValidityDate;

    @Column(name = "recovType")
    private String recovType;

    @Column(name = "c31")
    private String c31;

    @Column(name = "recovWithHoldingTax")
    private Float recovWithHoldingTax;

    @Column(name = "debtNbr")
    private String debtNbr;

    @Column(name = "bban")
    private String bban;

    @Column(name = "iban")
    private String iban;

    @Column(name = "bic")
    private String bic;

    @Column(name = "cc")
    private String cc;

    @Column(name = "competentEntity")
    private String competentEntity;

    @Column(name = "closingDate")
    private String closingDate;

    @Column(name = "recovTicketNbr")
    private String recovTicketNbr;

    @Column(name = "recovNetAmount")
    private Float recovNetAmount;

    @Column(name = "recovGrossAmount")
    private Float recovGrossAmount;

    @Column(name = "breakerAddress")
    private String breakerAddress;

    @Column(name = "breakerPostalCode")
    private String breakerPostalCode;

    @Column(name = "breakerCityName")
    private String breakerCityName;

    @Column(name = "breakerCountry")
    private String breakerCountry;

    @Column(name = "creditorName")
    private String creditorName;

    @Column(name = "comment")
    private String comment;

    @Column(name = "creditorAddress")
    private String creditorAddress;

    @Column(name = "creditorPostalCode")
    private String creditorPostalCode;

    @Column(name = "creditorCityName")
    private String creditorCityName;

    @Column(name = "creditorLanguage")
    private String creditorLanguage;

    @Column(name = "creditorGender")
    private String creditorGender;
}
