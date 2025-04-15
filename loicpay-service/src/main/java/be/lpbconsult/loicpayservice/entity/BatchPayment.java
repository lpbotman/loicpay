package be.lpbconsult.loicpayservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "batch_payment")
public class BatchPayment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "score")
    private Float score;

    public BatchPayment(Long batchId) {
        id = batchId;
    }

    public BatchPayment() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getScore() {
        return score;
    }

    public void setScore(Float score) {
        this.score = score;
    }
}
