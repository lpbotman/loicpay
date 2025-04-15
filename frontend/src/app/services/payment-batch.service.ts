// src/app/csv.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {API_BASE_URL} from "../utils/params";

@Injectable({ providedIn: 'root' })
export class PaymentBatchService {
  constructor(private http: HttpClient) {}

  createBatchPayment(name: string) : Observable<any> {
    return this.http.post(API_BASE_URL+'/batch/new', {name: name});
  }

  getAllBatchPayment() : Observable<any> {
    return this.http.get(API_BASE_URL+'/batch/all');
  }

  getBatchPayment(batchId: number) : Observable<any> {
    return this.http.get(API_BASE_URL+'/batch/'+batchId);
  }

  updateScore(batchId: number) : Observable<any> {
    return this.http.get(API_BASE_URL+'/batch/calculate-score?batchId='+batchId);
  }

}
