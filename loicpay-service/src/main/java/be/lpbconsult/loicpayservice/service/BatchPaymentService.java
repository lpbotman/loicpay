package be.lpbconsult.loicpayservice.service;

import org.springframework.stereotype.Service;
import be.lpbconsult.loicpayservice.entity.BatchPayment;
import be.lpbconsult.loicpayservice.repository.BatchPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class BatchPaymentService {

    @Autowired
    private BatchPaymentRepository batchPaymentRepository;

    // Méthode pour récupérer tous les PaymentBatchs
    public List<BatchPayment> findAll() {
        return batchPaymentRepository.findAll();
    }

    // Méthode pour ajouter un PaymentBatch
    public Long addBatchPayment(BatchPayment batchPayment) {
        BatchPayment savedBatchPayment = batchPaymentRepository.save(batchPayment);
        return savedBatchPayment.getId();
    }

    public Optional<BatchPayment> getBatchPayment(Long batchId) {
        return batchPaymentRepository.findById(batchId);
    }
}
