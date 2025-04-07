import { Component } from '@angular/core';
import {PaymentBatchService} from "./services/payment-batch.service";
import {NgIf} from "@angular/common";
import {Router, RouterOutlet} from "@angular/router";
import {MatFabButton} from "@angular/material/button";
import {
  ImportPaymentBatchDialogComponent
} from "./components/import-payment-batch-dialog/import-payment-batch-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
    imports: [
        RouterOutlet,
        MatFabButton
    ],
  standalone: true
})
export class AppComponent {

  constructor(private importDialog: MatDialog, private router: Router) {
  }

  openImportWizard() {
    this.importDialog.open(ImportPaymentBatchDialogComponent, {
      width: '800px',
      minHeight: '400px',
      maxWidth: '800px',
    });
  }

  goHome() {
    this.router.navigate(['']);
  }
}
