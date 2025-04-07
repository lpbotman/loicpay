// src/app/services/file-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';
import {UploadFileType} from "../enums/upload-file-type.enum";

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
      return this.http.post('http://localhost:3000/api/payment/loic/add', {idBatch, data});
    }
    else if (uploadFileType === UploadFileType.LOIC_RECOVERY) {
      return this.http.post('http://localhost:3000/api/recovery/loic/add', {idBatch, data});
    }
    else if (uploadFileType === UploadFileType.MFX_PAYMENT) {
      return this.http.post('http://localhost:3000/api/payment/mfx/add', {idBatch, data});
    }
    else if (uploadFileType === UploadFileType.MFX_RECOVERY) {
      console.log(data);
      return this.http.post('http://localhost:3000/api/recovery/mfx/add', {idBatch, data});
    }
    else {
      throw new Error('Type de fichier inconnu');
    }
  }
}
