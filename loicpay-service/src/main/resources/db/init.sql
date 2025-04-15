PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS batch_payment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score REAL
);

CREATE TABLE IF NOT EXISTS loic_payment
(
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    id_batch_payment            INTEGER,
    unemployment_entity         INTEGER,
    citizen_name                TEXT,
    ssin                        TEXT,
    postal_code                 TEXT,
    city_name                   TEXT,
    address                     TEXT,
    country                     INTEGER,
    ref_month                    INTEGER,
    closing_date                TEXT,
    pay_month                   TEXT,
    days_covered                INTEGER,
    gross_amount_paid           REAL,
    total_recov                 TEXT,
    payscale                    TEXT,
    empl_code                   TEXT,
    citizen_language            TEXT,
    gender                      TEXT,
    recov_neo                   TEXT,
    withholding_tax_amount_paid REAL,
    recov_net_amount            REAL,
    recov_gross_amount          REAL,
    recov_06                    REAL,
    iban                        TEXT,
    bic                         TEXT,
    competent_entity            TEXT,
    bce                         TEXT,
    ticket_nbr                  TEXT,
    net_paid                    REAL,
    leave_type                  TEXT,
    interruption_regime         TEXT,
    FOREIGN KEY (id_batch_payment) REFERENCES batch_payment (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_loic_payment_ssin ON loic_payment (ssin);

CREATE INDEX IF NOT EXISTS idx_loic_payment_batch_ssin_refmonth ON loic_payment (id_batch_payment, ssin, ref_month);



CREATE TABLE IF NOT EXISTS loic_recovery
(
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    id_batch_payment    INTEGER,
    unemployment_entity  INTEGER,
    citizen_name         TEXT,
    ssin                TEXT,
    ref_month            INTEGER,
    pay_month            TEXT,
    recov_total          REAL,
    recov_balance        REAL,
    recov_validity_date   TEXT,
    recov_type           TEXT,
    c31                 TEXT,
    withholding_tax REAL,
    debt_nbr             TEXT,
    bban                TEXT,
    iban                TEXT,
    bic                 TEXT,
    cc                  TEXT,
    competent_entity     TEXT,
    closing_date         TEXT,
    ticket_nbr      TEXT,
    net_amount      REAL,
    gross_amount    REAL,
    citizen_address      TEXT,
    citizen_postal_code   TEXT,
    citizen_city_name     TEXT,
    citizen_country      TEXT,
    creditor_name        TEXT,
    comment             TEXT,
    creditor_address     TEXT,
    creditor_postal_code  TEXT,
    creditor_city_name    TEXT,
    creditor_language    TEXT,
    creditor_gender      TEXT,
    FOREIGN KEY (id_batch_payment) REFERENCES batch_payment (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_loic_recovery_ssin ON loic_recovery (ssin);


CREATE TABLE IF NOT EXISTS mfx_payment
(
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    id_batch_payment INTEGER,
    unemployment_entity               INTEGER,
    name              TEXT,
    ssin             TEXT,
    postal_code               TEXT,
    city_name          TEXT,
    address              TEXT,
    ref_month         INTEGER,
    mois_pay         TEXT,
    days_covered            INTEGER,
    gross_amount_paid     REAL,
    prime    REAL,
    total_recov  REAL,
    net_paid      REAL,
    fee            REAL,
    oayscale           TEXT,
    code_empl        TEXT,
    lang             INTEGER,
    gender             INTEGER,
    contract_status   INTEGER,
    contract_worker     INTEGER,
    recov_neo     REAL,
    issue_nbr          INTEGER,
    foreign_address         TEXT,
    withholding_tax_amount_paid REAL,
    imposable        REAL,
    nonimposable     REAL,
    recov_06        REAL,
    iban             TEXT,
    bic              TEXT,
    cc               TEXT,
    country             TEXT,
    competent_entity           TEXT,
    bce              TEXT,
    FOREIGN KEY (id_batch_payment) REFERENCES batch_payment (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mfx_payment_ssin ON mfx_payment (ssin);

CREATE INDEX IF NOT EXISTS idx_mfx_payment_batch_ssin_refmonth ON mfx_payment (id_batch_payment, ssin, ref_month);



CREATE TABLE IF NOT EXISTS mfx_recovery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_batch_payment INTEGER,
  unemployment_entity INTEGER,
  creditor_name TEXT,
  ssin TEXT,
  ref_month INTEGER,
  pay_month TEXT,
  net_amount REAL,
  gross_amount REAL,
  balance REAL,
  validity_date TEXT,
  type TEXT,
  owner TEXT,
  c31 TEXT,
  with_holding_tax REAL,
  debt_nbr TEXT,
  account_number TEXT,
  iban TEXT,
  bic TEXT,
  cc INTEGER,
  instantie TEXT,
  bce TEXT,
  FOREIGN KEY (id_batch_payment) REFERENCES batch_payment(id) ON DELETE CASCADE
);


CREATE INDEX IF NOT EXISTS idx_mfx_recovery_ssin ON mfx_recovery (ssin);

CREATE TABLE IF NOT EXISTS citizen_reporting (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ssin TEXT,
    ref_month INTEGER,
    labels TEXT,
    ignored BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_citizen_reporting_ssin ON citizen_reporting (ssin);
CREATE INDEX IF NOT EXISTS idx_citizen_reporting_ssin_refmonth ON citizen_reporting (ssin, ref_month);
