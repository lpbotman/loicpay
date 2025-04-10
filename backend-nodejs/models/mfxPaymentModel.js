const db = require('../config/db');

class MfxPayment {

    static createMfxPayment(batchId, dataArray) {
        db.transaction(() => {
            const stmt = db.prepare(`
                INSERT INTO mfx_payment (
                    id_batch_payment,
                    bc, nom, ssin, cp, commune, rue, refMonth, mois_pay, jours,
                    montant_brut, montant_prime, montant_retenue, montant_net,
                    cpt_financier, frais, bareme, code_empl, lang, sexe,
                    statut_contrat, contrat_trav, retenue_onem, no_paie,
                    date_du_jour, etat_civil, a_droit, cptedouble, addr_etr,
                    prec, imposable, nonimposable, retenue06,
                    canada, iban, bic, cc, pays, entite, bce
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (const data of dataArray) {
                const values = [
                    batchId,
                    data.bc,
                    data.nom,
                    data.ssin,
                    data.cp,
                    data.commune,
                    data.rue,
                    data.refMonth,
                    data.mois_pay,
                    data.jours,
                    data.montant_brut,
                    data.montant_prime,
                    data.montant_retenue,
                    data.montant_net,
                    data.cpt_financier,
                    data.frais,
                    data.bareme,
                    data.code_empl,
                    data.lang,
                    data.sexe,
                    data.statut_contrat,
                    data.contrat_trav,
                    data.retenue_onem,
                    data.no_paie,
                    data.date_du_jour,
                    data.etat_civil,
                    data.a_droit,
                    data.cptedouble,
                    data.addr_etr,
                    data.prec,
                    data.imposable,
                    data.nonimposable,
                    data.retenue06,
                    data.canada,
                    data.iban,
                    data.bic,
                    data.cc,
                    data.pays,
                    data.entite,
                    data.bce
                ];

                stmt.run(values);
            }
        })();

        return { message: `${dataArray.length} lignes insérées` };
    }
}

module.exports = MfxPayment;
