const db = require('../config/db');

class LoicPayment {

    static createLoicPayment(batchId,dataArray) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");

                const stmt = db.prepare(`
                    INSERT INTO loic_payment (
                        id_batch_payment,
                        unemployment_entity,
                        citizen_name,
                        ssin,
                        postal_code,
                        city_name,
                        address,
                        country,
                        ref_month,
                        closing_date,
                        pay_month,
                        days_covered,
                        gross_amount_paid,
                        total_recov,
                        payscale,
                        empl_code,
                        citizen_language,
                        gender,
                        recov_neo,
                        withholding_tax_amount_paid,
                        recov_net_amount,
                        recov_gross_amount,
                        recov_06,
                        iban,
                        bic,
                        competent_entity,
                        bce,
                        ticket_nbr,
                        net_paid,
                        leave_type,
                        interruption_regime
                    )
                    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                for (const data of dataArray) {
                    const values = [
                        batchId,
                        parseInt(data[1]) || null,
                        data[2],
                        data[6],
                        data[7],
                        data[8],
                        data[9],
                        parseInt(data[38]) || null,
                        data[10],
                        data[41],
                        data[11],
                        parseInt(data[12]) || null,
                        parseFloat(data[13]) || null,
                        data[15],
                        data[18],
                        data[19],
                        data[20],
                        data[21],
                        data[24],
                        parseFloat(data[30]) || null,
                        parseFloat(data[31]) || null,
                        parseFloat(data[32]) || null,
                        parseFloat(data[33]) || null,
                        data[35],
                        data[36],
                        data[39],
                        data[40],
                        data[42],
                        parseFloat(data[44]) || null,
                        data[45],
                        data[46],
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

module.exports = LoicPayment;