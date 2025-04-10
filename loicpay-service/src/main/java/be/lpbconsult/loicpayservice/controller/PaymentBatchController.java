package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.entity.PaymentBatch;
import be.lpbconsult.loicpayservice.repository.PaymentBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batch")
@CrossOrigin(origins = "*")
public class PaymentBatchController {

    @Autowired
    private PaymentBatchRepository paymentBatchRepository;

    @GetMapping("/all")
    public List<PaymentBatch> getAllPaymentBatches() {
        return paymentBatchRepository.findAll();
    }

    @PostMapping("/new")
    public ResponseEntity<Long> addPaymentBatch(@RequestBody PaymentBatch paymentBatch) {
        Long id = paymentBatchRepository.addPaymentBatch(paymentBatch);
        return ResponseEntity.ok(id);
    }
}
