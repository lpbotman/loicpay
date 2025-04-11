package be.lpbconsult.loicpayservice.repository;

import be.lpbconsult.loicpayservice.entity.BatchPayment;
import be.lpbconsult.loicpayservice.entity.LoicPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoicPaymentRepository extends JpaRepository<LoicPayment, Long> {
    List<LoicPayment> findByIdBatchPayment(BatchPayment idBatchPayment);
}
