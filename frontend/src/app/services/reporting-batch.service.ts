// src/app/csv.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class ReportingBatchService {
  constructor(private http: HttpClient) {}

  getMatchSSIN(batchId: number) : Observable<any> {
    return this.http.get('http://localhost:3000/api/reporting/matchSsin?batchId='+batchId);
  }

  getMatchPaymentPlan(batchId: number) : Observable<any> {
    return this.http.get('http://localhost:3000/api/reporting/matchPaymentPlan?batchId='+batchId);
  }

}
