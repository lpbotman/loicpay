const db = require('../config/db');

class MfxRecovery {

    static createMfxRecovery(batchId,dataArray) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");

                const stmt = db.prepare(`
                    INSERT INTO mfx_recovery (
                        id_batch_payment, bc, nom, ssin, refMonth, mois_pay,
                        ret_net, ret_bedrag, ret_saldo, ret_date_val,
                        ret_type, titulaire, num_C31, ret_prec,
                        ret_schuld_nr, ret_cpt, ret_iban, ret_bic,
                        ret_cc, ret_instantie, ret_bce
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                for (const data of dataArray) {
                    const values = [
                        batchId,
                        data.bc,
                        data.nom,
                        data.ssin,
                        data.refMonth,
                        data.mois_pay,
                        data.ret_net,
                        data.ret_bedrag,
                        data.ret_saldo,
                        data.ret_date_val,
                        data.ret_type,
                        data.titulaire,
                        data.num_C31,
                        data.ret_prec,
                        data.ret_schuld_nr,
                        data.ret_cpt,
                        data.ret_iban,
                        data.ret_bic,
                        data.ret_cc,
                        data.ret_instantie,
                        data.ret_bce
                    ];

                    stmt.run(values);
                }

                stmt.finalize((err) => {
                    if (err) {
                        db.run("ROLLBACK");
                        reject(err);
                    } else {
                        db.run("COMMIT", (commitErr) => {
                            if (commitErr) reject(commitErr);
                            else resolve({ message: `${dataArray.length} lignes insérées` });
                        });
                    }
                });
            });
        });
    }
}

module.exports = MfxRecovery;