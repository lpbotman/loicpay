package be.lpbconsult.loicpayservice.repository;

import be.lpbconsult.loicpayservice.entity.BatchPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchPaymentRepository extends JpaRepository<BatchPayment, Long> {

}
