package be.lpbconsult.loicpayservice.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

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

    @Column(name = "ref_month")
    private Integer refMonth;

    @Column(name = "pay_month")
    private String payMonth;

    @Column(name = "net_amount")
    private BigDecimal net;

    @Column(name = "gross_amount")
    private BigDecimal gross;

    @Column(name = "balance")
    private BigDecimal balance;

    @Column(name = "validity_date")
    private String validityDate;

    private String type;
    private String owner;
    private String c31;

    @Column(name = "withholding_tax")
    private BigDecimal withHoldingTax;

    @Column(name = "debt_nbr")
    private String debtNbr;

    @Column(name = "account_number")
    private String accountNumber;

    private String iban;
    private String bic;

    private Integer cc;
    private String instantie;
    private String bce;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BatchPayment getBatchPayment() {
        return batchPayment;
    }

    public void setBatchPayment(BatchPayment batchPayment) {
        this.batchPayment = batchPayment;
    }

    public Integer getUnemploymentEntity() {
        return unemploymentEntity;
    }

    public void setUnemploymentEntity(Integer unemploymentEntity) {
        this.unemploymentEntity = unemploymentEntity;
    }

    public String getCreditorName() {
        return creditorName;
    }

    public void setCreditorName(String creditorName) {
        this.creditorName = creditorName;
    }

    public String getSsin() {
        return ssin;
    }

    public void setSsin(String ssin) {
        this.ssin = ssin;
    }

    public Integer getRefMonth() {
        return refMonth;
    }

    public void setRefMonth(Integer refMonth) {
        this.refMonth = refMonth;
    }

    public String getPayMonth() {
        return payMonth;
    }

    public void setPayMonth(String payMonth) {
        this.payMonth = payMonth;
    }

    public BigDecimal getNet() {
        return net;
    }

    public void setNet(BigDecimal net) {
        this.net = net;
    }

    public BigDecimal getGross() {
        return gross;
    }

    public void setGross(BigDecimal gross) {
        this.gross = gross;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getValidityDate() {
        return validityDate;
    }

    public void setValidityDate(String validityDate) {
        this.validityDate = validityDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getC31() {
        return c31;
    }

    public void setC31(String c31) {
        this.c31 = c31;
    }

    public BigDecimal getWithHoldingTax() {
        return withHoldingTax;
    }

    public void setWithHoldingTax(BigDecimal withHoldingTax) {
        this.withHoldingTax = withHoldingTax;
    }

    public String getDebtNbr() {
        return debtNbr;
    }

    public void setDebtNbr(String debtNbr) {
        this.debtNbr = debtNbr;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public String getBic() {
        return bic;
    }

    public void setBic(String bic) {
        this.bic = bic;
    }

    public Integer getCc() {
        return cc;
    }

    public void setCc(Integer cc) {
        this.cc = cc;
    }

    public String getInstantie() {
        return instantie;
    }

    public void setInstantie(String instantie) {
        this.instantie = instantie;
    }

    public String getBce() {
        return bce;
    }

    public void setBce(String bce) {
        this.bce = bce;
    }
}