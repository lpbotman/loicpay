package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.entity.BatchPayment;
import be.lpbconsult.loicpayservice.service.BatchPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batch")
@CrossOrigin(origins = "*")
public class BatchPaymentController {

    @Autowired
    private BatchPaymentService batchPaymentServiceService;

    @GetMapping("/all")
    public List<BatchPayment> getAllPaymentBatches() {
        return batchPaymentServiceService.findAll();
    }

    @PostMapping("/new")
    public ResponseEntity<Long> addPaymentBatch(@RequestBody BatchPayment batchPayment) {
        Long id = batchPaymentServiceService.addBatchPayment(batchPayment);
        return ResponseEntity.ok(id);
    }
}
