package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.service.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reporting")
@CrossOrigin(origins = "*")
public class ReportingPaymentController {

    @Autowired
    private ReportingService reportingService;

    @GetMapping("/match-ssin")
    public ResponseEntity<?> getMatchSSIN(@RequestParam Integer batchId) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("batchId", batchId);
            int loicCount = (int) reportingService.executeQuery("getCountDistinctSSINFromLoic", params, true);
            int mfxCount = (int) reportingService.executeQuery("getCountDistinctSSINFromMfx", params, true);
            int loicExclu = (int) reportingService.executeQuery("getCountExcluSSINFromLoic", params, true);
            int mfxExclu = (int) reportingService.executeQuery("getCountExcluSSINFromMfx", params, true);

            return ResponseEntity.ok(new SSINMatchResponse(loicCount, mfxCount, loicExclu, mfxExclu));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error");
        }
    }

    @GetMapping("/match-payment-plan")
    public ResponseEntity<?> getMatchPaymentPlan(@RequestParam Integer batchId) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("batchId", batchId);

            int loicCount = (int) reportingService.executeQuery("getCountPaymentPlanFromLoic",params, true);
            int mfxCount = (int) reportingService.executeQuery("getCountPaymentPlanFromMfx", params, true);
            int allMatch = (int) reportingService.executeQuery("getCountMatchPaymentPlan", params, true);

            return ResponseEntity.ok(new PaymentPlanResponse(loicCount, mfxCount, allMatch));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error");
        }
    }

    @GetMapping("/amount-diff")
    public ResponseEntity<?> getAmountDiff(
            @RequestParam int batchId,
            @RequestParam String amountType,
            @RequestParam float intervalLow,
            @RequestParam float intervalHigh
    ) {
        try {
            int count = 0;

            Map<String, Object> params = new HashMap<>();
            params.put("batchId", batchId);

            if(intervalLow > 0) {
                params.put("intervalLowUp", intervalLow);
                params.put("intervalHighUp", intervalHigh);
                params.put("intervalHighDown", -intervalHigh);
                params.put("intervalLowDown", -intervalLow);
            }

            if ("gross".equals(amountType) && intervalHigh > 0) {
                count = (int) reportingService.executeQuery("getCountGrossAmountDiff", params, true);
            } else if ("gross".equals(amountType)) {
                count = (int) reportingService.executeQuery("getCountGrossAmountMatch", params, true);
            } else if ("net".equals(amountType) && intervalHigh > 0) {
                count = (int) reportingService.executeQuery("getCountNetAmountDiff", params, true);
            } else if ("net".equals(amountType)) {
                count = (int) reportingService.executeQuery("getCountNetAmountMatch", params, true);
            }

            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error");
        }
    }

    // DTOs internes pour les réponses JSON
    private record SSINMatchResponse(int loicCount, int mfxCount, int loicExclu, int mfxExclu) {}
    private record PaymentPlanResponse(int loicCount, int mfxCount, int allMatch) {}
}