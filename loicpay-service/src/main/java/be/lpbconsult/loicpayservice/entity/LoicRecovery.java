package be.lpbconsult.loicpayservice.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "loic_recovery")
public class LoicRecovery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_batch_payment", referencedColumnName = "id")
    private BatchPayment batchPayment;

    @Column(name = "unemployment_entity")
    private Integer unemploymentEntity;

    @Column(name = "citizen_name")
    private String breakerName;

    @Column(name = "ssin")
    private String ssin;

    @Column(name = "ref_month")
    private Integer refMonth;

    @Column(name = "pay_month")
    private String payMonth;

    @Column(name = "recov_total")
    private BigDecimal recovTotal;

    @Column(name = "recov_balance")
    private BigDecimal recovBalance;

    @Column(name = "recov_validity_date")
    private String recovValidityDate;

    @Column(name = "recov_type")
    private String recovType;

    @Column(name = "c31")
    private String c31;

    @Column(name = "withholding_tax")
    private BigDecimal recovWithHoldingTax;

    @Column(name = "debt_nbr")
    private String debtNbr;

    @Column(name = "bban")
    private String bban;

    @Column(name = "iban")
    private String iban;

    @Column(name = "bic")
    private String bic;

    @Column(name = "cc")
    private String cc;

    @Column(name = "competent_entity")
    private String competentEntity;

    @Column(name = "closing_date")
    private String closingDate;

    @Column(name = "ticket_nbr")
    private String recovTicketNbr;

    @Column(name = "net_amount")
    private BigDecimal recovNetAmount;

    @Column(name = "gross_amount")
    private BigDecimal recovGrossAmount;

    @Column(name = "citizen_address")
    private String breakerAddress;

    @Column(name = "citizen_postal_code")
    private String breakerPostalCode;

    @Column(name = "citizen_city_name")
    private String breakerCityName;

    @Column(name = "citizen_country")
    private String breakerCountry;

    @Column(name = "creditor_name")
    private String creditorName;

    @Column(name = "comment")
    private String comment;

    @Column(name = "creditor_address")
    private String creditorAddress;

    @Column(name = "creditor_postal_code")
    private String creditorPostalCode;

    @Column(name = "creditor_city_name")
    private String creditorCityName;

    @Column(name = "creditor_language")
    private String creditorLanguage;

    @Column(name = "creditor_gender")
    private String creditorGender;

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

    public String getBreakerName() {
        return breakerName;
    }

    public void setBreakerName(String breakerName) {
        this.breakerName = breakerName;
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

    public BigDecimal getRecovTotal() {
        return recovTotal;
    }

    public void setRecovTotal(BigDecimal recovTotal) {
        this.recovTotal = recovTotal;
    }

    public BigDecimal getRecovBalance() {
        return recovBalance;
    }

    public void setRecovBalance(BigDecimal recovBalance) {
        this.recovBalance = recovBalance;
    }

    public String getRecovValidityDate() {
        return recovValidityDate;
    }

    public void setRecovValidityDate(String recovValidityDate) {
        this.recovValidityDate = recovValidityDate;
    }

    public String getRecovType() {
        return recovType;
    }

    public void setRecovType(String recovType) {
        this.recovType = recovType;
    }

    public String getC31() {
        return c31;
    }

    public void setC31(String c31) {
        this.c31 = c31;
    }

    public BigDecimal getRecovWithHoldingTax() {
        return recovWithHoldingTax;
    }

    public void setRecovWithHoldingTax(BigDecimal recovWithHoldingTax) {
        this.recovWithHoldingTax = recovWithHoldingTax;
    }

    public String getDebtNbr() {
        return debtNbr;
    }

    public void setDebtNbr(String debtNbr) {
        this.debtNbr = debtNbr;
    }

    public String getBban() {
        return bban;
    }

    public void setBban(String bban) {
        this.bban = bban;
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

    public String getCc() {
        return cc;
    }

    public void setCc(String cc) {
        this.cc = cc;
    }

    public String getCompetentEntity() {
        return competentEntity;
    }

    public void setCompetentEntity(String competentEntity) {
        this.competentEntity = competentEntity;
    }

    public String getClosingDate() {
        return closingDate;
    }

    public void setClosingDate(String closingDate) {
        this.closingDate = closingDate;
    }

    public String getRecovTicketNbr() {
        return recovTicketNbr;
    }

    public void setRecovTicketNbr(String recovTicketNbr) {
        this.recovTicketNbr = recovTicketNbr;
    }

    public BigDecimal getRecovNetAmount() {
        return recovNetAmount;
    }

    public void setRecovNetAmount(BigDecimal recovNetAmount) {
        this.recovNetAmount = recovNetAmount;
    }

    public BigDecimal getRecovGrossAmount() {
        return recovGrossAmount;
    }

    public void setRecovGrossAmount(BigDecimal recovGrossAmount) {
        this.recovGrossAmount = recovGrossAmount;
    }

    public String getBreakerAddress() {
        return breakerAddress;
    }

    public void setBreakerAddress(String breakerAddress) {
        this.breakerAddress = breakerAddress;
    }

    public String getBreakerPostalCode() {
        return breakerPostalCode;
    }

    public void setBreakerPostalCode(String breakerPostalCode) {
        this.breakerPostalCode = breakerPostalCode;
    }

    public String getBreakerCityName() {
        return breakerCityName;
    }

    public void setBreakerCityName(String breakerCityName) {
        this.breakerCityName = breakerCityName;
    }

    public String getBreakerCountry() {
        return breakerCountry;
    }

    public void setBreakerCountry(String breakerCountry) {
        this.breakerCountry = breakerCountry;
    }

    public String getCreditorName() {
        return creditorName;
    }

    public void setCreditorName(String creditorName) {
        this.creditorName = creditorName;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getCreditorAddress() {
        return creditorAddress;
    }

    public void setCreditorAddress(String creditorAddress) {
        this.creditorAddress = creditorAddress;
    }

    public String getCreditorPostalCode() {
        return creditorPostalCode;
    }

    public void setCreditorPostalCode(String creditorPostalCode) {
        this.creditorPostalCode = creditorPostalCode;
    }

    public String getCreditorCityName() {
        return creditorCityName;
    }

    public void setCreditorCityName(String creditorCityName) {
        this.creditorCityName = creditorCityName;
    }

    public String getCreditorLanguage() {
        return creditorLanguage;
    }

    public void setCreditorLanguage(String creditorLanguage) {
        this.creditorLanguage = creditorLanguage;
    }

    public String getCreditorGender() {
        return creditorGender;
    }

    public void setCreditorGender(String creditorGender) {
        this.creditorGender = creditorGender;
    }
}
