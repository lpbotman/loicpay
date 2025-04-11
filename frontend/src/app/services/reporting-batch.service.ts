// src/app/csv.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class ReportingBatchService {
  constructor(private http: HttpClient) {}

  getMatchSSIN(batchId: number) : Observable<any> {
    return this.http.get('http://localhost:8080/api/reporting/match-ssin?batchId='+batchId);
  }

  getMatchPaymentPlan(batchId: number) : Observable<any> {
    return this.http.get('http://localhost:8080/api/reporting/match-payment-plan?batchId='+batchId);
  }

  getMatchPaymentAmount(batchId: number, amountType: string, intervalLow: number = 0, intervalHigh: number = 0) : Observable<any> {
    if (amountType !== 'gross' && amountType !== 'net') {
      throw new Error('Amount type invalide');
    }
    return this.http.get('http://localhost:8080/api/reporting/amount-diff?batchId='+batchId+'&amountType='+amountType+'&intervalLow='+intervalLow+'&intervalHigh='+intervalHigh);
  }

}
