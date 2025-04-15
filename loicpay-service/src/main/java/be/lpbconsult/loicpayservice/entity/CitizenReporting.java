package be.lpbconsult.loicpayservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "citizen_reporting")
public class CitizenReporting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ssin")
    private String ssin;

    @Column(name = "ref_month")
    private Integer refMonth;

    @Column(name = "labels")
    private String labels;

    @Column(name = "ignored")
    private boolean ignored;

    public boolean getIgnored() {
        return ignored;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getLabels() {
        return labels;
    }

    public void setLabels(String labels) {
        this.labels = labels;
    }

    public boolean isIgnored() {
        return ignored;
    }

    public void setIgnored(boolean ignored) {
        this.ignored = ignored;
    }
}
