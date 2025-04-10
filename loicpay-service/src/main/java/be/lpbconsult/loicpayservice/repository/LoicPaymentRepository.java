package be.lpbconsult.loicpayservice.repository;

import be.lpbconsult.loicpayservice.entity.LoicPayment;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface LoicPaymentRepository extends CrudRepository<LoicPayment, Long> {
    List<LoicPayment> findByIdBatchPayment(Long batchId);
}
