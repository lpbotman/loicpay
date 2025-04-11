package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.entity.BatchPayment;
import be.lpbconsult.loicpayservice.service.BatchPaymentService;
import be.lpbconsult.loicpayservice.service.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/batch")
@CrossOrigin(origins = "*")
public class BatchPaymentController {

    @Autowired
    private BatchPaymentService batchPaymentService;

    @Autowired
    private ReportingService reportingService;

    @GetMapping("/all")
    public List<BatchPayment> getAllPaymentBatches() {
        return batchPaymentService.findAll();
    }

    @PostMapping("/new")
    public ResponseEntity<Long> addPaymentBatch(@RequestBody BatchPayment batchPayment) {
        Long id = batchPaymentService.addBatchPayment(batchPayment);
        return ResponseEntity.ok(id);
    }

    @PostMapping("/calculate-score")
    public ResponseEntity<?> calculateScore(@RequestParam Long batchId) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("batchId", batchId);
            int mfxCount = (int) reportingService.executeQuery("getCountMfxSsin", params, true);
            int diffCount = (int) reportingService.executeQuery("getCountSsinWithDiff", params, true);

            float score = 100 - ((float)diffCount / mfxCount * 100);
            batchPaymentService.updateScore(batchId, score);
            return ResponseEntity.ok(new BatchPaymentController.scoreResponse(score));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error");
        }
    }

    private record scoreResponse(Float matchPercent) {}
}
