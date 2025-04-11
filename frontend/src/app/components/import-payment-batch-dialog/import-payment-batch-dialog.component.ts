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

  paymentFileLoic!: File;
  recoveryFileLoic!: File;
  paymentFileMfx!: File;
  readonly CHUNK_SIZE = 20000;

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
      filePayment: [null, Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  async submit() {
    if (!this.paymentFileLoic || !this.recoveryFileLoic || !this.paymentFileMfx) {
      throw new Error('Aucun fichier sélectionné');
    }
    this.isImporting = true;
    this.totalLines = await this.calculateTotalLines(this.paymentFileLoic);
    this.totalLines += await this.calculateTotalLines(this.recoveryFileLoic);
    this.totalLines += await this.calculateTotalLines(this.paymentFileMfx);
    console.log('Total de lignes:', this.totalLines);

    this.paymentBatchService.createBatchPayment(this.step0Form.get('importName')?.value).subscribe(async (id:number) => {
      this.currentBatchId = id;

      this.progressInfo = {'task': 'Importation des paiements Loic', 'progress': 0, 'total': this.totalLines};
      await this.importLoicFile(this.paymentFileLoic, UploadFileType.LOIC_PAYMENT);

      this.progressInfo.task = 'Importation des retenues Loic';
      await this.importLoicFile(this.recoveryFileLoic, UploadFileType.LOIC_RECOVERY);

      this.progressInfo.task = 'Importation des paiements Mfx';
      await this.importMfxFile(this.paymentFileMfx);
    });
    //this.dialogRef.close();
  }

  onFileSelected(file: File, uploadFileType: UploadFileType) {
      if (uploadFileType === UploadFileType.LOIC_PAYMENT) {
        this.step1Form.get('filePayment')?.setValue(file);
        this.paymentFileLoic = file;
      } else if (uploadFileType === UploadFileType.LOIC_RECOVERY) {
        this.step1Form.get('fileRecovery')?.setValue(file);
        this.recoveryFileLoic = file;
      } else if (uploadFileType === UploadFileType.MFX_PAYMENT) {
        this.step2Form.get('filePayment')?.setValue(file);
        this.paymentFileMfx = file;
      }
  }

  async importMfxFile(file: File): Promise<void> {
    const reader = new FileReader();

    reader.onload = async (event: any) => {
      const content = event.target.result as string;
      const lines = content.split('\n').filter(line => line.trim() !== '');

      const linesPayments = lines.filter(line => line[0] !== '3');
      const linesRecoveries = lines.filter(line => line[0] === '3');

      const recordsPayments = linesPayments.map(line => this.parseFixedWidthLinePayment(line));
      const recordsRecoveries = linesRecoveries.map(line => this.parseFixedWidthLineRecovery(line));

      // Envois séquentiels
      await this.uploadChunksSequentially(recordsPayments, UploadFileType.MFX_PAYMENT);
      await this.uploadChunksSequentially(recordsRecoveries, UploadFileType.MFX_RECOVERY);

      console.log('Tous les envois terminés.');
    };

    reader.readAsText(file);
  }

  private async uploadChunksSequentially(records: any[], uploadFileType: UploadFileType): Promise<void> {
    for (let i = 0; i < records.length; i += this.CHUNK_SIZE) {
      const chunk = records.slice(i, i + this.CHUNK_SIZE);
      await this.uploadChunk(chunk, uploadFileType);
    }
  }

  private uploadChunk(chunk: any[], uploadFileType: UploadFileType): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fileUploadService.uploadParsedData(this.currentBatchId, chunk, uploadFileType).subscribe({
        next: (response) => {
          console.log('Chunk envoyé avec succès:', response);
          this.progressInfo.progress += chunk.length / this.progressInfo.total * 100;
          resolve();
        },
        error: (err) => {
          console.error('Erreur lors de l\'envoi du chunk:', err);
          reject(err);
        }
      });
    });
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
          console.log('Données envoyées avec succès:', result);
          this.fileUploadService.uploadParsedData(this.currentBatchId, result.data, uploadFileType).subscribe({
            next: (response) => {
              this.progressInfo.progress += chunk.length / this.progressInfo.total * 100;
              resolve();
            },
            error: (error) => {
              reject(error);
            }
          });
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }


  private parseFixedWidthLinePayment(line: string): any {
    const get = (start: number, end: number) => {
      const value = line.slice(start - 1, end).trim();
      return value === '' ? null : value;
    }

    return {
      rec: get(1, 1),
      bc: get(2, 3),
      nom: get(4, 96),
      ssin: get(94, 106),
      cp: get(107, 110),
      commune: get(111, 130),
      rue: get(131, 160),
      refMonth: this.parseDate(get(161, 167), 'MM/YYYY'),
      mois_pay: this.parseDate(get(168, 174), 'MM/YYYY'),
      jours: get(175, 176),
      montant_brut: get(177, 182),
      montant_prime: get(183, 188),
      montant_retenue: get(189, 194),
      montant_net: get(195, 200),
      cpt_financier: get(201, 214),
      frais: get(215, 217),
      bareme: get(218, 226),
      code_empl: get(227, 228),
      lang: get(229, 229),
      sexe: get(230, 230),
      statut_contrat: get(231, 231),
      contrat_trav: get(232, 232),
      retenue_onem: get(233, 238),
      no_paie: get(239, 241),
      date_du_jour: this.parseDate(get(242, 249), 'YYYYMMDD'),
      etat_civil: get(250, 250),
      a_droit: get(251, 252),
      cptedouble: get(253, 253),
      addr_etr: get(254, 313),
      prec: get(314, 319),
      imposable: get(320, 325),
      nonimposable: get(326, 331),
      retenue06: get(332, 337),
      canada: get(338, 343),
      iban: get(344, 377),
      bic: get(378, 388),
      cc: get(389, 389),
      pays: get(390, 391),
      entite: get(392, 393),
      bce: get(394, 403)
    };
  }


  parseFixedWidthLineRecovery(line: string): any {
    const get = (start: number, end: number) => {
      const value = line.slice(start - 1, end).trim();
      return value === '' ? null : value;
    }

    return {
      rec: get(0, 1),
      bc: get(1, 2),
      nom: get(3, 33),
      ssin: get(93, 106),
      refMonth: this.parseDate(get(160, 167),'MM/YYYY'),
      mois_pay: this.parseDate(get(167, 174), 'YYYYMMDD'),
      ret_net: get(274, 282),
      ret_bedrag: get(254, 264),
      ret_saldo: get(264, 274),
      ret_date_val: this.parseDate(get(274, 282), 'YYYYMMDD'),
      ret_type: get(282, 284),
      titulaire: get(284, 299),
      num_C31: get(299, 313),
      ret_prec: get(313, 319),
      ret_schuld_nr: get(319, 329),
      ret_cpt: get(329, 339),
      ret_iban: get(339, 373),
      ret_bic: get(373, 384),
      ret_cc: get(384, 385),
      ret_instantie: get(385, 387),
      ret_bce: get(387, 401),
    };
  }

  private parseDate(val: string | null, format: 'MM/YYYY' | 'YYYYMMDD'): string | null {
    // Renvoie la date au format ISO ou null si invalide
    if (!val) return null;

    if (format === 'MM/YYYY') {
      const [month, year] = val.split('/');
      if (month && year) return `${year}${month.padStart(2, '0')}`;
    }

    if (format === 'YYYYMMDD') {
      return `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}`;
    }

    return null;
  }


  calculateTotalLines(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      let totalLines = 0;

      fileReader.onload = (e: any) => {
        try {
          const fileContent = e.target.result;
          const lines = fileContent.split('\n'); // Diviser le contenu du fichier par lignes
          totalLines = lines.length; // Calculer le nombre de lignes
          resolve(totalLines); // Résoudre la promesse avec le total des lignes
        } catch (error) {
          reject(error); // Rejeter la promesse en cas d'erreur
        }
      };

      fileReader.onerror = (error) => {
        reject(error); // Rejeter la promesse en cas d'erreur de lecture du fichier
      };

      fileReader.readAsText(file); // Lire le fichier comme texte
    });
  }



  protected readonly UploadFileType = UploadFileType;
}
