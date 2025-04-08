const db = require('../config/db');

class LoicPayment {

    static createLoicPayment(batchId, dataArray) {
        db.transaction(() => {
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
                    refMonth,
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
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
                    parseInt(data[10]) || null,
                    data[41],
                    data[11],
                    parseInt(data[12]) || null,
                    data[13] ? parseFloat(data[13].replace(',', '.')) : null,
                    data[15],
                    data[18],
                    data[19],
                    data[20],
                    data[21],
                    data[24],
                    data[30] ? parseFloat(data[30].replace(',', '.')) : null,
                    data[31] ? parseFloat(data[31].replace(',', '.')) : null,
                    data[32] ? parseFloat(data[32].replace(',', '.')) : null,
                    data[33] ? parseFloat(data[33].replace(',', '.')) : null,
                    data[35],
                    data[36],
                    data[39],
                    data[40],
                    data[42],
                    data[44] ? parseFloat(data[44].replace(',', '.')) : null,
                    data[45],
                    data[46],
                ];

                stmt.run(values);
            }
        })();

        return { message: `${dataArray.length} lignes insérées` };
    }
}

module.exports = LoicPayment;
