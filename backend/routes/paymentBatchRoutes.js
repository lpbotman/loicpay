const express = require('express');
const PaymentBatchController = require('../controllers/paymentBatchController');
const ReportingController = require('../controllers/reportingController');

const router = express.Router();

// Route pour ajouter un paiement
router.post('/payment/loic/add', PaymentBatchController.addLoicPayments);
router.post('/recovery/loic/add', PaymentBatchController.addLoicRecoveries);
router.post('/payment/mfx/add', PaymentBatchController.addMfxPayments);
router.post('/recovery/mfx/add', PaymentBatchController.addMfxRecoveries);
router.post('/batch/new', PaymentBatchController.createBatchPayment);
router.get('/batch/all', PaymentBatchController.getAllBatchPayment);
router.get('/reporting/matchSsin', ReportingController.getMatchSSIN);
router.get('/reporting/matchPaymentPlan', ReportingController.getMatchPaymentPlan);

module.exports = router;
