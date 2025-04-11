package be.lpbconsult.loicpayservice.repository;

import be.lpbconsult.loicpayservice.entity.MfxPayment;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MfxPaymentRepository extends JpaRepository<MfxPayment, Long> {
}
