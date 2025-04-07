const BatchReporting = require('../models/batchReportingModel');

class ReportingController {

    static async getMatchSSIN(req, res) {
        try {
            const batchId = parseInt(req.query.batchId);
            const loicCount = await BatchReporting.executeQuery('getCountDistinctSSINFromLoic', [batchId], true);
            const mfxCount = await BatchReporting.executeQuery('getCountDistinctSSINFromMfx', [batchId], true);
            const loicExclu = await BatchReporting.executeQuery('getCountExcluSSINFromLoic', [batchId], true);
            const mfxExclu = await BatchReporting.executeQuery('getCountExcluSSINFromMfx', [batchId], true);

            res.status(201).json({loicCount, mfxCount, loicExclu, mfxExclu});

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

            res.status(201).json({loicCount, mfxCount, allMatch});

        } catch (error) {
            console.error('getMatchSSIN:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = ReportingController;