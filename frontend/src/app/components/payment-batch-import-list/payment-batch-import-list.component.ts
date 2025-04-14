import {Component, OnInit} from '@angular/core';
import {PaymentBatchService} from "../../services/payment-batch.service";
import {NgForOf} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {ImportPaymentBatchDialogComponent} from "../import-payment-batch-dialog/import-payment-batch-dialog.component";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {FlexibleNumberPipe} from "../../pipes/flexible-number.pipe";
import {MatFabButton} from "@angular/material/button";

@Component({
  selector: 'app-payment-batch-import-list',
  imports: [
    MatCard,
    MatCardContent,
    NgForOf,
    MatIcon,
    FlexibleNumberPipe,
    MatFabButton,
  ],
  templateUrl: './payment-batch-import-list.component.html',
  standalone: true,
  styleUrl: './payment-batch-import-list.component.css'
})
export class PaymentBatchImportListComponent implements OnInit {
  batchPayments: any[] = [];

  constructor(private importDialog: MatDialog,
              private paymentBatchService: PaymentBatchService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadAllBatchPayment();
  }

  openBatchImport(id: number) {
    this.router.navigate(['/batch-dashboard', id]);
  }

  private loadAllBatchPayment() {
    this.paymentBatchService.getAllBatchPayment().subscribe((response) => {
      console.log('loadAllBatchPayment',response);
      this.batchPayments = response;
    });
  }

  openImportWizard() {
    const dialogRef =this.importDialog.open(ImportPaymentBatchDialogComponent, {
      width: '800px',
      minHeight: '400px',
      maxWidth: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/batch-dashboard', result]);
    });
  }
}
