PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS batch_payment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
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
    refMonth                    INTEGER,
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

CREATE INDEX IF NOT EXISTS idx_loic_payment_batch_ssin_refmonth ON loic_payment (id_batch_payment, ssin, refMonth);



CREATE TABLE IF NOT EXISTS loic_recovery
(
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    id_batch_payment    INTEGER,
    unemploymentEntity  INTEGER,
    breakerName         TEXT,
    ssin                TEXT,
    refMonth            INTEGER,
    payMonth            TEXT,
    recovTotal          REAL,
    recovBalance        REAL,
    recovValidityDate   TEXT,
    recovType           TEXT,
    c31                 TEXT,
    recovWithHoldingTax REAL,
    debtNbr             TEXT,
    bban                TEXT,
    iban                TEXT,
    bic                 TEXT,
    cc                  TEXT,
    competentEntity     TEXT,
    closingDate         TEXT,
    recovTicketNbr      TEXT,
    recovNetAmount      REAL,
    recovGrossAmount    REAL,
    breakerAddress      TEXT,
    breakerPostalCode   TEXT,
    breakerCityName     TEXT,
    breakerCountry      TEXT,
    creditorName        TEXT,
    comment             TEXT,
    creditorAddress     TEXT,
    creditorPostalCode  TEXT,
    creditorCityName    TEXT,
    creditorLanguage    TEXT,
    creditorGender      TEXT,
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
    refMonth         INTEGER,
    mois_pay         TEXT,
    dayx_covered            INTEGER,
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

CREATE INDEX IF NOT EXISTS idx_mfx_payment_batch_ssin_refmonth ON mfx_payment (id_batch_payment, ssin, refMonth);



CREATE TABLE IF NOT EXISTS mfx_recovery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_batch_payment INTEGER,
  unemployment_entity INTEGER,
  creditor_name TEXT,
  ssin TEXT,
  refMonth INTEGER,
  pay_month TEXT,
  net REAL,
  gross REAL,
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

