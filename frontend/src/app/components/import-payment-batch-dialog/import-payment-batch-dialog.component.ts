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

    this.paymentBatchService.createBatchPayment(this.step0Form.get('importName')?.value).subscribe(async (response) => {
      this.currentBatchId = response.id;

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


  private parseFixedWidthLinePayment(line: string): any {
    const get = (start: number, end: number) =>
      line.slice(start - 1, end).trim();
    return {
      rec: parseInt(get(1, 1)),
      bc: parseInt(get(2, 4)),
      nom: get(4, 96),
      ssin: get(94, 106),
      cp: this.nullIfEmpty(get(107, 110)),
      commune: this.nullIfEmpty(get(111, 130)),
      rue: this.nullIfEmpty(get(131, 160)),
      refMonth: this.parseDate(get(161, 167), 'MM/YYYY'),
      mois_pay: this.parseDate(get(168, 174), 'MM/YYYY'),
      jours: this.toInt(get(175, 176)),
      montant_brut: this.parseDecimal(get(177, 182)),
      montant_prime: this.parseDecimal(get(183, 188)),
      montant_retenue: this.parseDecimal(get(189, 194)),
      montant_net: this.toFloat(get(195, 200), 10),
      cpt_financier: get(201, 214),
      frais: this.parseDecimal(get(215, 217)),
      bareme: get(218, 226),
      code_empl: get(227, 228),
      lang: this.toInt(get(229, 229)),
      sexe: this.toInt(get(230, 230)),
      statut_contrat: this.toInt(get(231, 231)),
      contrat_trav: this.toInt(get(232, 232)),
      retenue_onem: this.parseDecimal(get(233, 238)),
      no_paie: this.toInt(get(239, 241)),
      date_du_jour: this.parseDate(get(242, 249), 'YYYYMMDD'),
      etat_civil: this.toInt(get(250, 250)),
      a_droit: this.toInt(get(251, 252)),
      cptedouble: this.nullIfEmpty(get(253, 253)),
      addr_etr: this.nullIfEmpty(get(254, 313)),
      prec: this.parseDecimal(get(314, 319)),
      imposable: this.parseDecimal(get(320, 325)),
      nonimposable: this.parseDecimal(get(326, 331)),
      retenue06: this.parseDecimal(get(332, 337)),
      canada: get(338, 343),
      iban: this.nullIfEmpty(get(344, 377)),
      bic: this.nullIfEmpty(get(378, 388)),
      cc: this.nullIfEmpty(get(389, 389)),
      pays: this.nullIfEmpty(get(390, 391)),
      entite: this.toInt(get(392, 393)),
      bce: this.nullIfEmpty(get(394, 401))
    };
  }


  parseFixedWidthLineRecovery(line: string): any {
    return {
      rec: parseInt(line.substring(0, 1), 10),
      bc: parseInt(line.substring(1, 4), 10),
      nom: line.substring(3, 33).trim(),
      ssin: line.substring(93, 106),
      refMonth: this.formatDateFromMMYYYY(line.substring(160, 167)),
      mois_pay: this.formatDateFromMMYYYY(line.substring(167, 174)),
      ret_net: this.parseDecimal(line.substring(274, 282)),
      ret_bedrag: this.parseDecimal(line.substring(254, 264)),
      ret_saldo: this.parseDecimal(line.substring(264, 274)),
      ret_date_val: this.formatDateFromYYYYMMDD(line.substring(274, 282)),
      ret_type: parseInt(line.substring(282, 284), 10),
      titulaire: line.substring(284, 299).trim(),
      num_C31: line.substring(299, 313).trim(),
      ret_prec: this.parseDecimal(line.substring(313, 319)),
      ret_schuld_nr: line.substring(319, 329).trim(),
      ret_cpt: line.substring(329, 339).trim(),
      ret_iban: line.substring(339, 373).trim(),
      ret_bic: line.substring(373, 384).trim(),
      ret_cc: this.parseIntSafe(line.substring(384, 385)),
      ret_instantie: line.substring(385, 387).trim(),
      ret_bce: line.substring(387, 398).trim(),
    };
  }

  parseDecimal(str: string): number | null {
    const trimmed = str.trim();
    return trimmed ? parseFloat(trimmed) / 100 : null;
  }

  formatDateFromMMYYYY(str: string): string | null {
    const trimmed = str.trim();
    if (!trimmed.includes('/')) return null;
    const [month, year] = trimmed.split('/');
    return `${year}-${month}-01`;
  }

  formatDateFromYYYYMMDD(str: string): string | null {
    const trimmed = str.trim();
    if (!/^\d{8}$/.test(trimmed)) return null;
    return `${trimmed.substring(0, 4)}-${trimmed.substring(4, 6)}-${trimmed.substring(6, 8)}`;
  }

  parseIntSafe(str: string): number | null {
    const trimmed = str.trim();
    return trimmed ? parseInt(trimmed, 10) : null;
  }

  private toInt(val: string): number | null {
    const parsed = parseInt(val);
    return isNaN(parsed) ? null : parsed;
  }

  private toFloat(val: string, divisor: number = 10): number | null {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed / divisor;
  }

  private nullIfEmpty(val: string): string | null {
    return val === '' ? null : val;
  }

  private parseDate(val: string, format: 'MM/YYYY' | 'YYYYMMDD'): string | null {
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
