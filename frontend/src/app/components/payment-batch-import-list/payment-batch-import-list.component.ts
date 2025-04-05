import {Component, OnInit} from '@angular/core';
import {PaymentBatchService} from "../../services/payment-batch.service";
import {NgForOf, NgIf} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {ImportPaymentBatchDialogComponent} from "../import-payment-batch-dialog/import-payment-batch-dialog.component";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-payment-batch-import-list',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    NgForOf,
  ],
  templateUrl: './payment-batch-import-list.component.html',
  standalone: true,
  styleUrl: './payment-batch-import-list.component.css'
})
export class PaymentBatchImportListComponent implements OnInit {
  selectedFile!: File;
  stats: any;
  batchPayments: any[] = [];

  constructor(private paymentBatchService: PaymentBatchService, private importDialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAllBatchPayment();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  openImportWizard() {
    this.importDialog.open(ImportPaymentBatchDialogComponent, {
      width: '800px',
      minHeight: '400px',
      maxWidth: '800px',
    });
  }


  private loadAllBatchPayment() {
    this.paymentBatchService.getAllBatchPayment().subscribe((response) => {
      console.log('loadAllBatchPayment',response);
      this.batchPayments = response;
    });
  }
}
