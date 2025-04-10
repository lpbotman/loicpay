const db = require('../config/db');

class BatchPayment {

    static createBatchPayment(name) {
        const sql = `INSERT INTO batch_payment (name) VALUES (?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(name);
        return {
            id: result.lastInsertRowid,
            name
        };
    }

    static getAllBatchPayment() {
        const sql = `SELECT * FROM batch_payment`;
        const rows = db.prepare(sql).all();
        return rows;
    }
}

module.exports = BatchPayment;
