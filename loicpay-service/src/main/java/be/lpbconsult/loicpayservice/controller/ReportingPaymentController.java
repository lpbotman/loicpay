package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.dto.CitizenReportingResponse;
import be.lpbconsult.loicpayservice.dto.ReportingPaginatedRequest;
import be.lpbconsult.loicpayservice.entity.CitizenReporting;
import be.lpbconsult.loicpayservice.service.ReportingService;
import be.lpbconsult.loicpayservice.utils.CsvUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

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

    @GetMapping("/exclu-loic")
    public ResponseEntity<?> getExcluLoic(@RequestParam Integer batchId, @RequestParam int page, @RequestParam int size, @RequestParam boolean includeIgnored) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("batchId", batchId);
            int offset = page * size;
            List<CitizenReportingResponse> results = reportingService.getCitizenReportings("getExcluSSINFromLoic", params, offset, size, includeIgnored);
            int total = reportingService.countTotal("getExcluSSINFromLoic", params);

            return ResponseEntity.ok(new PaginatedCitizenReporting(results, total));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error " + e.getMessage());
        }
    }

    @PostMapping("/amount/diff")
    public ResponseEntity<?> getAmountDiff(@RequestBody ReportingPaginatedRequest request) {
        try {
            Map<String, Object> params = new HashMap<>();
            int offset = request.getPage() * request.getSize();
            List<CitizenReportingResponse> results = reportingService.getCitizenReportings("getCitizenGrossAmountDiff", params, offset, request.getSize(), request.isIncludeIgnored());
            int total = reportingService.countTotal("getCitizenGrossAmountDiff", params);

            return ResponseEntity.ok(new PaginatedCitizenReporting(results, total));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error " + e.getMessage());
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

    @PostMapping("/citizen/get-citizens-by-criteria")
    public ResponseEntity<?> getCitizensByCriteria(@RequestBody ReportingPaginatedRequest request) {
        setIntervalParams(request.getParams());

        try {
            int offset = request.getPage() * request.getSize();
            List<CitizenReportingResponse> results = reportingService.getCitizenReportings(request.getQuery(), request.getParams(), offset, request.getSize(), request.isIncludeIgnored());
            int total = reportingService.countTotal(request.getQuery(), request.getParams());
            return ResponseEntity.ok(new PaginatedCitizenReporting(results, total));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error " + e.getMessage());
        }
    }

    @PostMapping("/citizen/update")
    public ResponseEntity<?> updateCitizenReporting(@RequestBody CitizenReporting request) {
        try {
            reportingService.updateCitizenReporting(request);
            return ResponseEntity.ok(Collections.singletonMap("status", "OK"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error");
        }
    }

    @GetMapping("/export")
    public ResponseEntity<Resource> exportCsv(@RequestParam String query, @RequestParam Integer batchId) throws IOException {

        Map<String, Object> params = new HashMap<>();
        params.put("batchId", batchId);
        List<CitizenReportingResponse> results = reportingService.getCitizenReportings("getExcluSSINFromLoic", params, 0, 0, true);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        CsvUtils.writeReportingsToCsv(results, outputStream);
        ByteArrayResource csv = new ByteArrayResource(outputStream.toByteArray());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=citizens-"+query+".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }


    private void setIntervalParams(Map<String, Object> params) {
        if (params != null && params.containsKey("intervalLow") && params.containsKey("intervalHigh")) {
            BigDecimal intervalLowObj = new BigDecimal((String)params.get("intervalLow"));
            BigDecimal intervalHighObj = new BigDecimal((String)params.get("intervalHigh"));
            System.out.println("intervalLowObj " + intervalLowObj);
            System.out.println("intervalHighObj " + intervalHighObj);


            System.out.println("intervalLowObj instanceof Number && intervalHighObj instanceof Number");
            double intervalLow = ((Number) intervalLowObj).doubleValue();
            double intervalHigh = ((Number) intervalHighObj).doubleValue();

            params.put("intervalLowUp", intervalLow);
            params.put("intervalHighUp", intervalHigh);
            params.put("intervalHighDown", -1 * intervalHigh);
            params.put("intervalLowDown", -1 * intervalLow);

            params.remove("intervalLow");
            params.remove("intervalHigh");
        }
    }
    // DTOs internes pour les réponses JSON
    private record SSINMatchResponse(int loicCount, int mfxCount, int loicExclu, int mfxExclu) {}
    private record PaymentPlanResponse(int loicCount, int mfxCount, int allMatch) {}
    private record PaginatedCitizenReporting(List<CitizenReportingResponse> results, int total) {}

}