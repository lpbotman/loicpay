// src/app/services/file-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';
import {UploadFileType} from "../enums/upload-file-type.enum";
import {LoicImport} from "../dtos/LoicImport.dto";
import {MfxImport} from "../dtos/MfxImport.dto";
import {API_BASE_URL} from "../utils/params";

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
      let loicPaymentImport = new LoicImport();
      loicPaymentImport.batchId = idBatch;
      loicPaymentImport.loicRecords = data;
      return this.http.post(API_BASE_URL+'/payment/loic/add', loicPaymentImport);
    }
    else if (uploadFileType === UploadFileType.LOIC_RECOVERY) {
      let loicRecoveryImport = new LoicImport();
      loicRecoveryImport.batchId = idBatch;
      loicRecoveryImport.loicRecords = data;
      return this.http.post(API_BASE_URL+'/recovery/loic/add', loicRecoveryImport);
    }
    else if (uploadFileType === UploadFileType.MFX_PAYMENT) {
      let mfxPaymentImport = new MfxImport();
      mfxPaymentImport.batchId = idBatch;
      mfxPaymentImport.mfxRecords = data;
      console.log(mfxPaymentImport);
      return this.http.post(API_BASE_URL+'/payment/mfx/add', mfxPaymentImport);
    }
    else if (uploadFileType === UploadFileType.MFX_RECOVERY) {
      let mfxRecoveryImport = new MfxImport();
      mfxRecoveryImport.batchId = idBatch;
      mfxRecoveryImport.mfxRecords = data;
      return this.http.post(API_BASE_URL+'/recovery/mfx/add', mfxRecoveryImport);
    }
    else {
      throw new Error('Type de fichier inconnu');
    }
  }
}
