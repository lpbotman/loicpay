import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { PaginatedCitizenReporting} from "../dtos/CitizenReporting.dto";
import {ReportingPaginatedRequest} from "../dtos/ReportingPaginatedRequest.dto";
import {API_BASE_URL} from "../utils/params";

@Injectable({ providedIn: 'root' })
export class ReportingBatchService {
  constructor(private http: HttpClient) {}

  getPaymentMatchSSIN(batchId: number) : Observable<any> {
    return this.http.get(API_BASE_URL+'/reporting/payment/match-ssin?batchId='+batchId);
  }

  getPaymentMatchPaymentPlan(batchId: number) : Observable<any> {
    return this.http.get(API_BASE_URL+'/reporting/payment/match-plan?batchId='+batchId);
  }

  getMatchPaymentAmount(batchId: number, amountType: string, intervalLow: number = 0, intervalHigh: number = 0) : Observable<any> {
    if (amountType !== 'gross' && amountType !== 'net') {
      throw new Error('Amount type invalide');
    }
    return this.http.get(API_BASE_URL+'/reporting/payment/amount-diff?batchId='+batchId+'&amountType='+amountType+'&intervalLow='+intervalLow+'&intervalHigh='+intervalHigh);
  }

  getRecoveryMatchSSIN(batchId: number) : Observable<any> {
    return this.http.get(API_BASE_URL+'/reporting/recovery/match-ssin?batchId='+batchId);
  }

  getRecoveryMatchPaymentPlan(batchId: number) : Observable<any> {
    return this.http.get(API_BASE_URL+'/reporting/recovery/match-plan?batchId='+batchId);
  }

  getMatchRecoveryAmount(batchId: number, amountType: string, intervalLow: number = 0, intervalHigh: number = 0) : Observable<any> {
    if (amountType !== 'gross' && amountType !== 'net') {
      throw new Error('Amount type invalide');
    }
    return this.http.get(API_BASE_URL+'/reporting/recovery/amount-diff?batchId='+batchId+'&amountType='+amountType+'&intervalLow='+intervalLow+'&intervalHigh='+intervalHigh);
  }

  getCitizensByCriteria(reportingPaginatedRequest: ReportingPaginatedRequest) : Observable<PaginatedCitizenReporting> {
    return this.http.post<PaginatedCitizenReporting>(API_BASE_URL+'/reporting/citizen/get-citizens-by-criteria', reportingPaginatedRequest.toJSON());
  }

  updateCitizenReporting(ssin: string, refMonth: number, labels: string | null, ignored: boolean): Observable<any> {
    return this.http.post(API_BASE_URL+'/reporting/citizen/update', { ssin, refMonth, labels, ignored });
  }

  exportCsv(query: string, batchId: number | null): Observable<Blob> {
    return this.http.get(API_BASE_URL+'/reporting/export?query='+query+'&batchId='+batchId, {
      responseType: 'blob'
    });
  }

}
