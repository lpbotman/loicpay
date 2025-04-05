const db = require('../config/db');

class LoicRecovery {

    static createLoicRecovery(batchId, dataArray) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");

                const stmt = db.prepare(`
                    INSERT INTO loic_recovery (
                        id_batch_payment,
                        unemploymentEntity,
                        breakerName,
                        ssin,
                        refMonth,
                        payMonth,
                        recovTotal,
                        recovBalance,
                        recovValidityDate,
                        recovType,
                        c31,
                        recovWithHoldingTax,
                        debtNbr,
                        bban,
                        iban,
                        bic,
                        cc,
                        competentEntity,
                        closingDate,
                        recovTicketNbr,
                        recovNetAmount,
                        recovGrossAmount,
                        breakerAddress,
                        breakerPostalCode,
                        breakerCityName,
                        breakerCountry,
                        creditorName,
                        comment,
                        creditorAddress,
                        creditorPostalCode,
                        creditorCityName,
                        creditorLanguage,
                        creditorGender
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                for (const data of dataArray) {
                    const values = [
                        batchId,
                        parseInt(data[0]) || null,   // unemploymentEntity
                        data[1],                      // breakerName
                        data[2],                      // inss
                        data[3],                      // refMonth
                        data[4],                      // payMonth
                        parseFloat(data[5]) || null,  // recovTotal
                        parseFloat(data[6]) || null,  // recovBalance
                        data[7],                      // recovValidDate
                        data[8],                      // recovType
                        data[9],                      // c31
                        parseFloat(data[10]) || null, // recovWithHoldingTax
                        data[11],                     // debtNbr
                        data[12],                     // bban
                        data[13],                     // iban
                        data[14],                     // bic
                        data[15],                     // cc
                        data[16],                     // competentEntity
                        data[17],                     // closingDate
                        data[18],                     // recovTicketNbr
                        parseFloat(data[19]) || null, // recovNetAmount
                        parseFloat(data[20]) || null, // recovGrossAmount
                        data[21],                     // breakerAddress
                        data[22],                     // breakerPostalCode
                        data[23],                     // breakerCityName
                        data[24],                     // breakerCountry
                        data[25],                     // creditorName
                        data[26],                     // comment
                        data[27],                     // creditorAddress
                        data[28],                     // creditorPostalCode
                        data[29],                     // creditorCityName
                        data[30],                     // creditorLanguage
                        data[31]                      // creditorGender
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

module.exports = LoicRecovery;