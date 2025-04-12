package be.lpbconsult.loicpayservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
}
