const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Créer la base de données SQLite
const db = new sqlite3.Database(path.join(__dirname, '../payment-batch.db'), (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite');
    }
});

db.serialize(() => {
    db.run(`
    PRAGMA foreign_keys = ON
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS batch_payment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS loic_payment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_batch_payment INTEGER,
      unemployment_entity INTEGER,
      citizen_name TEXT,
      ssin TEXT,
      postal_code TEXT,
      city_name TEXT,
      address TEXT,
      country INTEGER,
      ref_month TEXT,
      closing_date TEXT,
      pay_month TEXT,
      days_covered INTEGER,
      gross_amount_paid REAL,
      total_recov TEXT,
      payscale TEXT,
      empl_code TEXT,
      citizen_language TEXT,
      gender TEXT,
      recov_neo TEXT,
      withholding_tax_amount_paid REAL,
      recov_net_amount REAL,
      recov_gross_amount REAL,
      recov_06 REAL,
      iban TEXT,
      bic TEXT,
      competent_entity TEXT,
      bce TEXT,
      ticket_nbr TEXT,
      net_paid REAL,
      leave_type TEXT,
      interruption_regime TEXT,
      FOREIGN KEY (id_batch_payment) REFERENCES batch_payment(id) ON DELETE CASCADE
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS loic_recovery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_batch_payment INTEGER,
        unemploymentEntity INTEGER,
        breakerName TEXT,
        ssin TEXT,
        refMonth TEXT,
        payMonth TEXT,
        recovTotal REAL,
        recovBalance REAL,
        recovValidityDate TEXT,
        recovType TEXT,
        c31 TEXT,
        recovWithHoldingTax REAL,
        debtNbr TEXT,
        bban TEXT,
        iban TEXT,
        bic TEXT,
        cc TEXT,
        competentEntity TEXT,
        closingDate TEXT,
        recovTicketNbr TEXT,
        recovNetAmount REAL,
        recovGrossAmount REAL,
        breakerAddress TEXT,
        breakerPostalCode TEXT,
        breakerCityName TEXT,
        breakerCountry TEXT,
        creditorName TEXT,
        comment TEXT,
        creditorAddress TEXT,
        creditorPostalCode TEXT,
        creditorCityName TEXT,
        creditorLanguage TEXT,
        creditorGender TEXT,
        FOREIGN KEY (id_batch_payment) REFERENCES batch_payment(id) ON DELETE CASCADE
    )
  `);
});


module.exports = db;
