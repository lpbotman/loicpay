package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.dto.MfxInsertRequest;
import be.lpbconsult.loicpayservice.service.MfxPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/mfx")
@CrossOrigin(origins = "*")
public class MfxPaymentController {

    @Autowired
    private MfxPaymentService mfxPaymentService;

    @PostMapping("/add")
    public void addLoicPayments(@RequestBody MfxInsertRequest request) throws Exception {
        mfxPaymentService.createMfxPayments(request.getBatchId(), request.getMfxRecords());
    }

}
