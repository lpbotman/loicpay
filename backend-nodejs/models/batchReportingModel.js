const db = require('../config/db');
const queries = require('../config/queries');

class BatchPayment {

    static executeQuery(queryName, params, singleValue = false) {
        const query = queries[queryName]; // Récupérer la requête à partir du fichier de config
        if (!query) {
            throw new Error('Requête inconnue');
        }

        const rows = db.prepare(query).all(...params);

        if (singleValue) {
            // Si c'est une requête qui retourne une seule valeur, on retourne la première colonne de la première ligne
            return rows.length > 0 ? rows[0][Object.keys(rows[0])[0]] : null;
        } else {
            // Sinon, on retourne la liste complète des résultats
            return rows;
        }
    }

    static getCountDistinctSSINFromLoic(batchId) {
        const query = `select count(distinct(ssin)) from loic_payment where id_batch_payment = ?;`;
        const rows = db.prepare(query).all(batchId);
        return rows;
    }

    static getCountDistinctSSINFromMfx(batchId) {
        const query = `select count(distinct(ssin)) from mfx_payment where id_batch_payment = ?;`;
        const rows = db.prepare(query).all(batchId);
        return rows;
    }

    static getExcluSSINFromLoic(batchId) {
        const query = `select count(distinct ssin) from loic_payment l where id_batch_payment = ?
                        and not exists (select 1 from mfx_payment m where m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin);`;
        const rows = db.prepare(query).all(batchId);
        return rows;
    }

    static getExcluSSINFromMfx(batchId) {
        const query = `select count(distinct ssin) from mfx_payment l where id_batch_payment = ?
                        and not exists (select 1 from loic_payment m where m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin);`;
        const rows = db.prepare(query).all(batchId);
        return rows;
    }
}

module.exports = BatchPayment;
