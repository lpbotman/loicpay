const BatchReporting = require('../models/batchReportingModel');

class ReportingController {

    static async getMatchSSIN(req, res) {
        try {
            const batchId = parseInt(req.query.batchId);
            const loicCount = await BatchReporting.executeQuery('getCountDistinctSSINFromLoic', [batchId], true);
            const mfxCount = await BatchReporting.executeQuery('getCountDistinctSSINFromMfx', [batchId], true);
            const loicExclu = await BatchReporting.executeQuery('getCountExcluSSINFromLoic', [batchId], true);
            const mfxExclu = await BatchReporting.executeQuery('getCountExcluSSINFromMfx', [batchId], true);

            res.status(200).json({loicCount, mfxCount, loicExclu, mfxExclu});

        } catch (error) {
            console.error('getMatchSSIN:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async getMatchPaymentPlan(req, res) {
        try {
            const batchId = parseInt(req.query.batchId);
            const loicCount = await BatchReporting.executeQuery('getCountPaymentPlanFromLoic', [batchId], true);
            const mfxCount = await BatchReporting.executeQuery('getCountPaymentPlanFromMfx', [batchId], true);
            const allMatch = await BatchReporting.executeQuery('getCountMatchPaymentPlan', [batchId], true);

            res.status(200).json({loicCount, mfxCount, allMatch});

        } catch (error) {
            console.error('getMatchSSIN:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async getAmountDiff(req, res) {
        try {
            const batchId = parseInt(req.query.batchId);
            const amountType = req.query.amountType;
            const intervalLow = parseFloat(req.query.intervalLow);
            const intervalHigh = parseFloat(req.query.intervalHigh);

            let count = 0;

            if (amountType === 'gross' && intervalHigh > 0) {
                count = await BatchReporting.executeQuery('getCountGrossAmountDiff', [batchId, intervalLow, intervalHigh, intervalHigh*-1, intervalLow*-1], true);
            } else if (amountType === 'gross' && intervalHigh === 0) {
                count = await BatchReporting.executeQuery('getCountGrossAmountMatch', [batchId], true);
            } else if (amountType === 'net' && intervalHigh > 0) {
                count = await BatchReporting.executeQuery('getCountNetAmountDiff', [batchId, intervalLow, intervalHigh, intervalHigh*-1, intervalLow*-1], true);
            } else if (amountType === 'net' && intervalHigh === 0) {
                count = await BatchReporting.executeQuery('getCountNetAmountMatch', [batchId], true);
            }

            res.status(200).json(count);

        } catch (error) {
            console.error('getMatchSSIN:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = ReportingController;