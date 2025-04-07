
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

};
