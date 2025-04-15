package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.dto.LoicInsertRequest;
import be.lpbconsult.loicpayservice.service.LoicPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/loic")
@CrossOrigin(origins = "*")
public class LoicPaymentController {

    @Autowired
    private LoicPaymentService loicPaymentService;

    @PostMapping("/add")
    public void addLoicPayments(@RequestBody LoicInsertRequest request) throws Exception {
        System.out.println("LoicPaymentController - addLoicPayments " + request.getBatchId());
        loicPaymentService.createLoicPayment(request.getBatchId(), request.getLoicRecords());
    }

}
