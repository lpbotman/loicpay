// src/app/services/file-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';
import {UploadFileType} from "../enums/upload-file-type.enum";
import {LoicPaymentImport} from "../dtos/LoicPaymentImport.dto";
import {LoicRecoveryImport} from "../dtos/LoicRecoveryImport.dto";
import {MfxPaymentImport} from "../dtos/MfxPaymentImport.dto";
import {MfxRecoveryImport} from "../dtos/MfxRecoveryImport.dto";

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  // Méthode pour analyser un fichier CSV en utilisant PapaParse
  parseCsvFile(file: File): Observable<any> {
    return new Observable((observer) => {
      Papa.parse(file, {
        complete: (result) => {
          observer.next(result);
          observer.complete();
        },
        delimiter: ';',
        header: true, // Si le fichier CSV a une ligne d'en-tête
        skipEmptyLines: true, // Ignore les lignes vides
      });
    });
  }


  uploadParsedData(idBatch:number, data: any, uploadFileType: UploadFileType): Observable<any> {
    if (uploadFileType === UploadFileType.LOIC_PAYMENT) {
      let loicPaymentImport = new LoicPaymentImport();
      loicPaymentImport.batchId = idBatch;
      loicPaymentImport.loicPayments = data;
      return this.http.post('http://localhost:8080/api/payment/loic/add', loicPaymentImport);
    }
    else if (uploadFileType === UploadFileType.LOIC_RECOVERY) {
      let loicRecoveryImport = new LoicRecoveryImport();
      loicRecoveryImport.batchId = idBatch;
      loicRecoveryImport.loicRecoveries = data;
      return this.http.post('http://localhost:8080/api/recovery/loic/add', loicRecoveryImport);
    }
    else if (uploadFileType === UploadFileType.MFX_PAYMENT) {
      let mfxPaymentImport = new MfxPaymentImport();
      mfxPaymentImport.batchId = idBatch;
      mfxPaymentImport.mfxPayments = data;
      console.log(mfxPaymentImport);
      return this.http.post('http://localhost:8080/api/payment/mfx/add', mfxPaymentImport);
    }
    else if (uploadFileType === UploadFileType.MFX_RECOVERY) {
      let mfxRecoveryImport = new MfxRecoveryImport();
      mfxRecoveryImport.batchId = idBatch;
      mfxRecoveryImport.mfxRecoveries = data;
      return this.http.post('http://localhost:8080/api/recovery/mfx/add', mfxRecoveryImport);
    }
    else {
      throw new Error('Type de fichier inconnu');
    }
  }
}
