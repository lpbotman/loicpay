package be.lpbconsult.loicpayservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mfx_recovery")
public class MfxRecovery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_batch_payment", nullable = false)
    private BatchPayment batchPayment;

    @JoinColumn(name = "unemployment_entity", nullable = false)
    private Integer unemploymentEntity;

    @Column(name = "creditor_name")
    private String creditorName;

    private String ssin;

    private Integer refMonth;

    @Column(name = "pay_month")
    private String payMonth;

    private Float net;
    private Float gross;
    private Float balance;

    @Column(name = "validity_date")
    private String validityDate;

    private String type;
    private String owner;
    private String c31;

    @Column(name = "with_holding_tax")
    private Float withHoldingTax;

    @Column(name = "debt_nbr")
    private String debtNbr;

    @Column(name = "account_number")
    private String accountNumber;

    private String iban;
    private String bic;

    private Integer cc;
    private String instantie;
    private String bce;
}