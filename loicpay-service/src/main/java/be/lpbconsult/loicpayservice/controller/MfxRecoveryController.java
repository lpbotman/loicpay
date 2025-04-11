package be.lpbconsult.loicpayservice.controller;

import be.lpbconsult.loicpayservice.dto.MfxRecoveriesInsertRequest;
import be.lpbconsult.loicpayservice.service.MfxRecoveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recovery/mfx")
@CrossOrigin(origins = "*")
public class MfxRecoveryController {

    @Autowired
    private MfxRecoveryService mfxRecoveryService;

    @PostMapping("/add")
    public void addLoicRecoveries(@RequestBody MfxRecoveriesInsertRequest request) throws Exception {
        mfxRecoveryService.createMfxRecoveries(request.getBatchId(), request.getMfxRecoveries());
    }

}
