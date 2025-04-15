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
    filter: 'amount-diff-gross',
    criteria: 'getCitizenGrossAmountDiff'
  },
  {
    filter: 'amount-diff-net',
    criteria: 'getCitizenNetAmountDiff'
  },
];
