// src/app/csv.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class PaymentBatchService {
  constructor(private http: HttpClient) {}

  createBatchPayment(name: string) : Observable<any> {
    return this.http.post('http://localhost:8080/api/batch/new', {name: name});
  }

  getAllBatchPayment() : Observable<any> {
    return this.http.get('http://localhost:8080/api/batch/all');
  }

}
