const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'payment-batch.db');

const db = new Database(dbPath, {
    verbose: () => {} // Aucune sortie dans la console
});

db.exec('PRAGMA foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS batch_payment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
)
`);

db.exec(`
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
  refMonth INTEGER,
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

db.exec(`
    CREATE INDEX IF NOT EXISTS idx_loic_payment_ssin ON loic_payment (ssin);
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS idx_loic_payment_batch_ssin_refmonth ON loic_payment (id_batch_payment, ssin, refMonth);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS loic_recovery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_batch_payment INTEGER,
    unemploymentEntity INTEGER,
    breakerName TEXT,
    ssin TEXT,
    refMonth INTEGER,
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

db.exec(`
    CREATE INDEX IF NOT EXISTS idx_loic_recovery_ssin ON loic_recovery (ssin);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS mfx_payment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_batch_payment INTEGER,
  bc INTEGER,
  nom TEXT,
  ssin TEXT,
  cp TEXT,
  commune TEXT,
  rue TEXT,
  refMonth INTEGER,
  mois_pay TEXT,
  jours INTEGER,
  montant_brut REAL,
  montant_prime REAL,
  montant_retenue REAL,
  montant_net REAL,
  cpt_financier TEXT,
  frais REAL,
  bareme TEXT,
  code_empl TEXT,
  lang INTEGER,
  sexe INTEGER,
  statut_contrat INTEGER,
  contrat_trav INTEGER,
  retenue_onem REAL,
  no_paie INTEGER,
  date_du_jour TEXT,
  etat_civil INTEGER,
  a_droit INTEGER,
  cptedouble TEXT,
  addr_etr TEXT,
  prec REAL,
  imposable REAL,
  nonimposable REAL,
  retenue06 REAL,
  canada TEXT,
  iban TEXT,
  bic TEXT,
  cc TEXT,
  pays TEXT,
  entite INTEGER,
  bce TEXT,
  FOREIGN KEY (id_batch_payment) REFERENCES batch_payment(id) ON DELETE CASCADE
)
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS idx_mfx_payment_ssin ON mfx_payment (ssin);
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS idx_mfx_payment_batch_ssin_refmonth ON mfx_payment (id_batch_payment, ssin, refMonth);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS mfx_recovery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_batch_payment INTEGER,
  bc INTEGER,
  nom TEXT,
  ssin TEXT,
  refMonth INTEGER,
  mois_pay TEXT,
  ret_net REAL,
  ret_bedrag REAL,
  ret_saldo REAL,
  ret_date_val TEXT,
  ret_type INTEGER,
  titulaire TEXT,
  num_C31 TEXT,
  ret_prec REAL,
  ret_schuld_nr TEXT,
  ret_cpt TEXT,
  ret_iban TEXT,
  ret_bic TEXT,
  ret_cc INTEGER,
  ret_instantie TEXT,
  ret_bce TEXT,
  FOREIGN KEY (id_batch_payment) REFERENCES batch_payment(id) ON DELETE CASCADE
)
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS idx_mfx_recovery_ssin ON mfx_recovery (ssin);
`);



module.exports = db;
