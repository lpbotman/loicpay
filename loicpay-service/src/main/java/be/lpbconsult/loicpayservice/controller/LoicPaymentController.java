package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.dto.LoicPaymentsInsertRequest;
import be.lpbconsult.loicpayservice.service.LoicPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment/loic")
@CrossOrigin(origins = "*")
public class LoicPaymentController {

    @Autowired
    private LoicPaymentService loicPaymentService;

    @PostMapping("/add")
    public void addLoicPayments(@RequestBody LoicPaymentsInsertRequest request) throws Exception {
        loicPaymentService.createLoicPayment(request.getBatchId(), request.getLoicPayments());
    }

}
