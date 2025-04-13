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

    public Optional<BatchPayment> find(Long id) {
        return batchPaymentRepository.findById(id);
    }

    // Méthode pour ajouter un PaymentBatch
    public Long addBatchPayment(BatchPayment batchPayment) {
        BatchPayment savedBatchPayment = batchPaymentRepository.save(batchPayment);
        return savedBatchPayment.getId();
    }

    public Optional<BatchPayment> getBatchPayment(Long batchId) {
        return batchPaymentRepository.findById(batchId);
    }

    public void updateScore(Long batchId, Float score) {
        Optional<BatchPayment> batchPayment = batchPaymentRepository.findById(batchId);
        if (batchPayment.isPresent()) {
            batchPayment.get().setScore(score);
            batchPaymentRepository.save(batchPayment.get());
        }
    }

}
