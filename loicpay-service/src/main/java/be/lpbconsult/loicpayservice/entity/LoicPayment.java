package be.lpbconsult.loicpayservice.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "loic_payment")
public class LoicPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_batch_payment", referencedColumnName = "id")
    private BatchPayment idBatchPayment;

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
    private Integer country;

    @Column(name = "ref_month")
    private Integer refMonth;

    @Column(name = "closing_date")
    private String closingDate;

    @Column(name = "pay_month")
    private String payMonth;

    @Column(name = "days_covered")
    private Integer daysCovered;

    @Column(name = "gross_amount_paid")
    private BigDecimal grossAmountPaid;

    @Column(name = "total_recov")
    private BigDecimal totalRecov;

    @Column(name = "payscale")
    private String payscale;

    @Column(name = "empl_code")
    private String emplCode;

    @Column(name = "citizen_language")
    private String citizenLanguage;

    @Column(name = "gender")
    private String gender;

    @Column(name = "recov_neo")
    private BigDecimal recovNeo;

    @Column(name = "withholding_tax_amount_paid")
    private BigDecimal withholdingTaxAmountPaid;

    @Column(name = "recov_net_amount")
    private BigDecimal recovNetAmount;

    @Column(name = "recov_gross_amount")
    private BigDecimal recovGrossAmount;

    @Column(name = "recov_06")
    private BigDecimal recov06;

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
    private BigDecimal netPaid;

    @Column(name = "leave_type")
    private String leaveType;

    @Column(name = "interruption_regime")
    private String interruptionRegime;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BatchPayment getIdBatchPayment() {
        return idBatchPayment;
    }

    public void setIdBatchPayment(BatchPayment idBatchPayment) {
        this.idBatchPayment = idBatchPayment;
    }

    public Integer getUnemploymentEntity() {
        return unemploymentEntity;
    }

    public void setUnemploymentEntity(Integer unemploymentEntity) {
        this.unemploymentEntity = unemploymentEntity;
    }

    public String getCitizenName() {
        return citizenName;
    }

    public void setCitizenName(String citizenName) {
        this.citizenName = citizenName;
    }

    public String getSsin() {
        return ssin;
    }

    public void setSsin(String ssin) {
        this.ssin = ssin;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getCountry() {
        return country;
    }

    public void setCountry(Integer country) {
        this.country = country;
    }

    public Integer getRefMonth() {
        return refMonth;
    }

    public void setRefMonth(Integer refMonth) {
        this.refMonth = refMonth;
    }

    public String getClosingDate() {
        return closingDate;
    }

    public void setClosingDate(String closingDate) {
        this.closingDate = closingDate;
    }

    public String getPayMonth() {
        return payMonth;
    }

    public void setPayMonth(String payMonth) {
        this.payMonth = payMonth;
    }

    public Integer getDaysCovered() {
        return daysCovered;
    }

    public void setDaysCovered(Integer daysCovered) {
        this.daysCovered = daysCovered;
    }

    public BigDecimal getGrossAmountPaid() {
        return grossAmountPaid;
    }

    public void setGrossAmountPaid(BigDecimal grossAmountPaid) {
        this.grossAmountPaid = grossAmountPaid;
    }

    public BigDecimal getTotalRecov() {
        return totalRecov;
    }

    public void setTotalRecov(BigDecimal totalRecov) {
        this.totalRecov = totalRecov;
    }

    public String getPayscale() {
        return payscale;
    }

    public void setPayscale(String payscale) {
        this.payscale = payscale;
    }

    public String getEmplCode() {
        return emplCode;
    }

    public void setEmplCode(String emplCode) {
        this.emplCode = emplCode;
    }

    public String getCitizenLanguage() {
        return citizenLanguage;
    }

    public void setCitizenLanguage(String citizenLanguage) {
        this.citizenLanguage = citizenLanguage;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public BigDecimal getRecovNeo() {
        return recovNeo;
    }

    public void setRecovNeo(BigDecimal recovNeo) {
        this.recovNeo = recovNeo;
    }

    public BigDecimal getWithholdingTaxAmountPaid() {
        return withholdingTaxAmountPaid;
    }

    public void setWithholdingTaxAmountPaid(BigDecimal withholdingTaxAmountPaid) {
        this.withholdingTaxAmountPaid = withholdingTaxAmountPaid;
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

    public BigDecimal getRecov06() {
        return recov06;
    }

    public void setRecov06(BigDecimal recov06) {
        this.recov06 = recov06;
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

    public String getCompetentEntity() {
        return competentEntity;
    }

    public void setCompetentEntity(String competentEntity) {
        this.competentEntity = competentEntity;
    }

    public String getBce() {
        return bce;
    }

    public void setBce(String bce) {
        this.bce = bce;
    }

    public String getTicketNbr() {
        return ticketNbr;
    }

    public void setTicketNbr(String ticketNbr) {
        this.ticketNbr = ticketNbr;
    }

    public BigDecimal getNetPaid() {
        return netPaid;
    }

    public void setNetPaid(BigDecimal netPaid) {
        this.netPaid = netPaid;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public String getInterruptionRegime() {
        return interruptionRegime;
    }

    public void setInterruptionRegime(String interruptionRegime) {
        this.interruptionRegime = interruptionRegime;
    }
}
