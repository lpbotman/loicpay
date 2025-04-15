package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.dto.LoicInsertRequest;
import be.lpbconsult.loicpayservice.service.LoicRecoveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recovery/loic")
@CrossOrigin(origins = "*")
public class LoicRecoveryController {

    @Autowired
    private LoicRecoveryService loicRecoveryService;

    @PostMapping("/add")
    public void addLoicRecoveries(@RequestBody LoicInsertRequest request) throws Exception {
        loicRecoveryService.createLoicRecovery(request.getBatchId(), request.getLoicRecords());
    }

}
