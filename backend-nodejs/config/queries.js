
module.exports = {
    /**
     * Critère 1 : Match SSIN
     */
    getCountDistinctSSINFromLoic: 'select count(distinct(ssin)) from loic_payment where id_batch_payment = ?;',
    getCountDistinctSSINFromMfx: 'select count(distinct(ssin)) from mfx_payment where id_batch_payment = ?;',
    getCountExcluSSINFromLoic: 'select count(distinct ssin) from loic_payment l where id_batch_payment = ? and not exists (select 1 from mfx_payment m where m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin);',
    getCountExcluSSINFromMfx: 'select count(distinct ssin) from mfx_payment l where id_batch_payment = ? and not exists (select 1 from loic_payment m where m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin);',

    /**
     * Critère 2 : Match PaymentPlan
     */
    getCountPaymentPlanFromLoic: 'select count(*) from loic_payment where id_batch_payment = ?;',
    getCountPaymentPlanFromMfx: 'select count(*) from mfx_payment where id_batch_payment = ?;',
    getCountMatchPaymentPlan: 'select count(*) from mfx_payment l where id_batch_payment = ? and exists (select 1 from loic_payment m where m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin and m.refMonth = l.refMonth);',

    /**
     * Critère 3 : Gross Amount
     */
    getCountGrossAmountMatch: 'select count(*) from mfx_payment m join loic_payment l on m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin and m.refMonth = l.refMonth where l.id_batch_payment = ? and m.montant_brut = l.gross_amount_paid;',
    getCountNetAmountMatch: 'select count(*) from mfx_payment m join loic_payment l on m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin and m.refMonth = l.refMonth where l.id_batch_payment = ? and m.montant_net = l.net_paid;',
    getCountGrossAmountDiff: 'select count(*) from mfx_payment m join loic_payment l on m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin and m.refMonth = l.refMonth where l.id_batch_payment = ? and ((l.gross_amount_paid - m.montant_brut) BETWEEN ? AND ? OR (l.gross_amount_paid - m.montant_brut) BETWEEN ? AND ?);',
    getCountNetAmountDiff: 'select count(*) from mfx_payment m join loic_payment l on m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin and m.refMonth = l.refMonth where l.id_batch_payment = ? and ((l.net_paid - m.montant_net) BETWEEN ? AND ? OR (l.net_paid - m.montant_net) BETWEEN ? AND ?);',
};
