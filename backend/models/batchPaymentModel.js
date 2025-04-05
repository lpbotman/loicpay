
const db = require('../config/db');

class BatchPayment {

    static async createBatchPayment(name) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO batch_payment (name) VALUES (?)`;
            db.run(sql, [name], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        name
                    });
                }
            });
        });
    }

    static async getAllBatchPayment() {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(`
                    SELECT *
                    FROM batch_payment
                `, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        });
    }
}

module.exports = BatchPayment;