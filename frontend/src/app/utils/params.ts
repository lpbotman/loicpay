export const API_BASE_URL = 'http://localhost:8080/api';

export const filterTocriteria = [
  {
    filter: 'payment-exclu-loic',
    criteria: 'getPaymentExcluSSINFromLoic'
  },
  {
    filter: 'recovery-exclu-loic',
    criteria: 'getRecoveryExcluSSINFromLoic'
  },
  {
    filter: 'payment-amount-diff-gross',
    criteria: 'getCitizenPaymentGrossAmountDiff'
  },
  {
    filter: 'recovery-amount-diff-gross',
    criteria: 'getCitizenRecoveryGrossAmountDiff'
  },
  {
    filter: 'payment-amount-diff-net',
    criteria: 'getCitizenPaymentNetAmountDiff'
  },
  {
    filter: 'recovery-amount-diff-net',
    criteria: 'getCitizenRecoveryNetAmountDiff'
  },
];
