import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FileUploadService} from "../../services/fileupload.service";
import * as Papa from 'papaparse';
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {FileUploadPickerComponent} from "../utils/file-upload-picker/file-upload-picker.component";
import {PaymentBatchService} from "../../services/payment-batch.service";
import {UploadFileType} from "../../enums/upload-file-type.enum";

@Component({
  selector: 'app-import-payment-batch-dialog',
  imports: [
    MatFormField,
    MatLabel,
    MatStepper,
    MatDialogContent,
    MatStep,
    ReactiveFormsModule,
    MatStepLabel,
    MatFormField,
    MatButton,
    MatStepperNext,
    MatInput,
    MatDialogTitle,
    MatProgressBar,
    NgIf,
    FileUploadPickerComponent,
  ],
  templateUrl: './import-payment-batch-dialog.component.html',
  standalone: true,
  styleUrl: './import-payment-batch-dialog.component.css'
})
export class ImportPaymentBatchDialogComponent {
  @ViewChild('stepper') stepper: MatStepper | undefined;
  @ViewChild('fileProgress') fileProgressBar: MatProgressBar | undefined;
  step0Form: FormGroup;
  step1Form: FormGroup;
  step2Form: FormGroup;



  isImporting = false;
  progressInfo = {'task': '', 'progress': 0, 'total': 0};
  totalLines = 0;

  currentBatchId!: number;

  paymentFileLoic?: File;
  recoveryFileLoic?: File;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ImportPaymentBatchDialogComponent>,
    private fileUploadService: FileUploadService,
    private paymentBatchService: PaymentBatchService
  ) {
    this.step0Form = this.fb.group({
      importName: ['', Validators.required],
    });

    this.step1Form = this.fb.group({
      filePayment: [null, Validators.required],
      fileRecovery: [null, Validators.required],

    });

    this.step2Form = this.fb.group({
      confirmation: ['', Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    // Ajoute ta logique d'import ici
    console.log('Importation lancée');
    this.dialogRef.close();
  }

  onFileSelected(file: File, uploadFileType: UploadFileType) {
      if (uploadFileType === UploadFileType.PAYMENT) {
        this.step1Form.get('filePayment')?.setValue(file);
        this.paymentFileLoic = file;
      } else if (uploadFileType === UploadFileType.RECOVERY) {
        this.step1Form.get('fileRecovery')?.setValue(file);
        this.recoveryFileLoic = file;
      }

  }

  validateStep(currentStep:number) {
    if (currentStep === 0) {
      this.saveBatch();
    }
    this.stepper?.next();
  }

  saveBatch() {
    this.paymentBatchService.createBatchPayment(this.step0Form.get('importName')?.value).subscribe((response) => {
      this.currentBatchId = response.id;
    });
  }

  async importLoic(): Promise<void> {
    if (!this.paymentFileLoic || !this.recoveryFileLoic) {
      throw new Error('Aucun fichier sélectionné');
    }
    this.isImporting = true;
    this.totalLines = 0;
    this.calculateTotalLines(this.paymentFileLoic);
    this.calculateTotalLines(this.recoveryFileLoic);

    console.log('Progression: initialisation');
    this.progressInfo = {'task': 'Importation des paiements Loic', 'progress': 0, 'total': this.totalLines};
    console.log('Importation des paiements Loic');
    await this.importLoicFile(this.paymentFileLoic, UploadFileType.PAYMENT);
    this.progressInfo.task = 'Importation des retenues Loic';
    console.log('Importation des retenues Loic');
    await this.importLoicFile(this.recoveryFileLoic, UploadFileType.RECOVERY);
    this.stepper?.next();
  }

  importLoicFile(fileLoic: File, uploadFileType: UploadFileType): Promise<void> {
    return new Promise((resolve, reject) => {
      const chunkSize = 20000;
      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        const fileContent = e.target.result;
        const lines = fileContent.split('\n');
        let lineNumber = 0;
        const chunks = [];

        // Diviser en chunks
        while (lineNumber < lines.length) {
          const chunk = lines.slice(lineNumber, lineNumber + chunkSize);
          chunks.push(chunk);
          lineNumber += chunkSize;
        }

        // Upload tous les chunks en série (ou en parallèle avec Promise.all si tu préfères)
        const uploadPromises = chunks.map((chunk) => this.parseAndUploadChunk(chunk, uploadFileType));
        Promise.all(uploadPromises)
          .then(() => resolve())
          .catch((err) => reject(err));
      };

      fileReader.onerror = (e) => reject(e);
      fileReader.readAsText(fileLoic);
    });
  }


  parseAndUploadChunk(chunk: string[], uploadFileType: UploadFileType): Promise<void> {
    return new Promise((resolve, reject) => {
      Papa.parse(chunk.join('\n'), {
        complete: (result) => {
          this.fileUploadService.uploadParsedData(this.currentBatchId, result.data, uploadFileType).subscribe({
            next: (response) => {
              console.log('Données envoyées avec succès:', response);
              this.progressInfo.progress += chunk.length / this.progressInfo.total * 100;
              resolve();
            },
            error: (error) => {
              console.error('Erreur lors de l\'envoi des données', error);
              reject(error);
            }
          });
        },
        error: (error: any) => {
          console.error('Erreur lors du parsing du chunk', error);
          reject(error);
        }
      });
    });
  }


  calculateChunkSize(chunk: string[]): number {
    const jsonString = JSON.stringify(chunk); // Convertir en chaîne JSON
    return new TextEncoder().encode(jsonString).length; // Calculer la taille en octets
  }

  calculateTotalLines(file:File): void {

    const fileReader = new FileReader();
    let totalLines = 0;

    fileReader.onload = (e: any) => {
      const fileContent = e.target.result;
      const lines = fileContent.split('\n'); // Diviser le contenu du fichier par lignes
      this.totalLines += lines.length; // Mettre à jour le nombre total de lignes
    };

    fileReader.readAsText(file);
  }

  protected readonly UploadFileType = UploadFileType;
}
