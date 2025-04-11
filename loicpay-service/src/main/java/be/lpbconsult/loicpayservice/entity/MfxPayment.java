package be.lpbconsult.loicpayservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mfx_payment")
public class MfxPayment {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_batch_payment", referencedColumnName = "id")
    private BatchPayment batchPayment;

    @Column(name = "unemployment_entity")
    private Integer unemploymentEntity;

    @Column(name = "citizen_name")
    private String citizenName;

    @Column(name = "ssin")
    private String ssin;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "city_name")
    private String cityName;

    @Column(name = "address")
    private String address;

    @Column(name = "country")
    private String country;

    @Column(name = "ref_month")
    private Integer refMonth;

    @Column(name = "closing_date")
    private String closingDate;

    @Column(name = "pay_month")
    private String payMonth;

    @Column(name = "days_covered")
    private Integer daysCovered;

    @Column(name = "gross_amount_paid")
    private Float grossAmountPaid;

    @Column(name = "total_recov")
    private Float totalRecov;

    @Column(name = "payscale")
    private String payscale;

    @Column(name = "empl_code")
    private String emplCode;

    @Column(name = "lang")
    private String citizenLanguage;

    @Column(name = "gender")
    private String gender;

    @Column(name = "recov_neo")
    private Float recovNeo;

    @Column(name = "withholding_tax_amount_paid")
    private Float withholdingTaxAmountPaid;

    @Column(name = "recov_net_amount")
    private Float recovNetAmount;

    @Column(name = "recov_gross_amount")
    private Float recovGrossAmount;

    @Column(name = "recov_06")
    private Float recov06;

    @Column(name = "iban")
    private String iban;

    @Column(name = "bic")
    private String bic;

    @Column(name = "competent_entity")
    private String competentEntity;

    @Column(name = "bce")
    private String bce;

    @Column(name = "ticket_nbr")
    private String ticketNbr;

    @Column(name = "net_paid")
    private Float netPaid;

    @Column(name = "leave_type")
    private String leaveType;

    @Column(name = "interruption_regime")
    private String interruptionRegime;


    // Getters and setters
    // (le code des getters et setters est omis ici pour la concision)
}
