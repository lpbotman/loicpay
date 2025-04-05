const express = require('express');
const PaymentBatchController = require('../controllers/paymentBatchController');

const router = express.Router();

// Route pour ajouter un paiement
router.post('/payment/loic/add', PaymentBatchController.addLoicPayments);
router.post('/recovery/loic/add', PaymentBatchController.addLoicRecoveries);
router.post('/batch/new', PaymentBatchController.createBatchPayment);
router.get('/batch/all', PaymentBatchController.getAllBatchPayment);

module.exports = router;
