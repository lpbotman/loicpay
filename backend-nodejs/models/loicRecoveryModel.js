const db = require('../config/db');

class LoicRecovery {

    static createLoicRecovery(batchId, dataArray) {
        db.transaction(() => {
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
                    data[2],                      // ssin
                    parseInt(data[3]) || null,   // refMonth
                    data[4],                      // payMonth
                    data[5] ? parseFloat(data[5].replace(',', '.')) : null,  // recovTotal
                    data[6] ? parseFloat(data[6].replace(',', '.')) : null,  // recovBalance
                    data[7],                      // recovValidityDate
                    data[8],                      // recovType
                    data[9],                      // c31
                    data[10] ? parseFloat(data[10].replace(',', '.')) : null, // recovWithHoldingTax
                    data[11],                     // debtNbr
                    data[12],                     // bban
                    data[13],                     // iban
                    data[14],                     // bic
                    data[15],                     // cc
                    data[16],                     // competentEntity
                    data[17],                     // closingDate
                    data[18],                     // recovTicketNbr
                    data[19] ? parseFloat(data[19].replace(',', '.')) : null, // recovNetAmount
                    data[20] ? parseFloat(data[20].replace(',', '.')) : null, // recovGrossAmount
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
        })();

        return { message: `${dataArray.length} lignes insérées` };
    }
}

module.exports = LoicRecovery;
