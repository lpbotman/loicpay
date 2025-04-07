const db = require('../config/db');
const queries = require('../config/queries');

class BatchPayment {

    static async executeQuery(queryName, params, singleValue = false) {
        return new Promise((resolve, reject) => {
            const query = queries[queryName]; // Récupérer la requête à partir du fichier de config
            if (!query) {
                return reject(new Error('Requête inconnue'));
            }

            db.all(query, params, (err, rows) => {
                if (err) return reject(err);

                if (singleValue) {
                    // Si c'est une requête qui retourne une seule valeur, on retourne la première colonne de la première ligne
                    resolve(rows.length > 0 ? rows[0][Object.keys(rows[0])[0]] : null);
                } else {
                    // Sinon, on retourne la liste complète des résultats
                    resolve(rows);
                }
            });
        });
    }

    static async getCountDistinctSSINFromLoic(batchId) {
        return new Promise((resolve, reject) => {
            const query = `select count(distinct(ssin)) from loic_payment where id_batch_payment = ?;`;

            db.all(query, [batchId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getCountDistinctSSINFromMfx(batchId) {
        return new Promise((resolve, reject) => {
            const query = `select count(distinct(ssin)) from mfx_payment where id_batch_payment = ?;`;

            db.all(query, [batchId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getExcluSSINFromLoic(batchId) {
        return new Promise((resolve, reject) => {
            const query = `select count(distinct ssin) from loic_payment l where id_batch_payment = ?
                             and not exists (select 1 from mfx_payment m where m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin);`;

            db.all(query, [batchId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getExcluSSINFromMfx(batchId) {
        return new Promise((resolve, reject) => {
            const query = `select count(distinct ssin) from mfx_payment l where id_batch_payment = ?
                             and not exists (select 1 from loic_payment m where m.id_batch_payment = l.id_batch_payment and m.ssin = l.ssin);`;

            db.all(query, [batchId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

}

module.exports = BatchPayment;