const LoicPayment = require('../models/loicPaymentModel');
const LoicRecovery = require('../models/loicRecoveryModel');
const BatchPayment = require('../models/batchPaymentModel');

class PaymentBatchController {

    static async createBatchPayment(req, res) {
        try {
            const name = req.body.name;
            const batch = await BatchPayment.createBatchPayment(name);
            res.status(201).json(batch);
        } catch (error) {
            console.error('Erreur lors de la création du batch payment:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async getAllBatchPayment(req, res) {
        try {
            const batch = await BatchPayment.getAllBatchPayment();
            res.status(201).json(batch);
        } catch (error) {
            console.error('Erreur lors de la récupération du batch payment:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async addLoicPayments(req, res) {
        try {
            const batchId = req.body.idBatch;
            const paymentDataArray = req.body.data;
            await LoicPayment.createLoicPayment(batchId, paymentDataArray);
            res.status(201).json({ message: 'Paiement ajouté'});
        } catch (error) {
            console.error('Erreur lors de l\'ajout du paiement:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async addLoicRecoveries(req, res) {
        try {
            const batchId = req.body.idBatch;
            const recoveryDataArray = req.body.data;
            await LoicRecovery.createLoicRecovery(batchId, recoveryDataArray);
            res.status(201).json({ message: 'Recovery ajouté'});
        } catch (error) {
            console.error('Erreur lors de l\'ajout des retenues:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}

module.exports = PaymentBatchController;