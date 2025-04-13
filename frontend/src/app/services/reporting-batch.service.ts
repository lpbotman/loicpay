// src/app/csv.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {CitizenReporting, PaginatedCitizenReporting} from "../dtos/CitizenReporting.dto";

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

  getCitizensByCriteria(batchId: number | null, criteria: string, page: number, size: number, includeIgnored: boolean) : Observable<PaginatedCitizenReporting> {
    return this.http.get<PaginatedCitizenReporting>('http://localhost:8080/api/reporting/'+criteria+'?batchId='+batchId+'&page='+page+'&size='+size+'&includeIgnored='+includeIgnored);
  }

  updateCitizenReporting(ssin: string, refMonth: number, labels: string | null, ignored: boolean): Observable<any> {
    return this.http.post('http://localhost:8080/api/reporting/citizen/update', { ssin, refMonth, labels, ignored });
  }

  exportCsv(query: string, batchId: number | null): Observable<Blob> {
    return this.http.get('http://localhost:8080/api/reporting/export?query='+query+'&batchId='+batchId, {
      responseType: 'blob'
    });
  }
}
