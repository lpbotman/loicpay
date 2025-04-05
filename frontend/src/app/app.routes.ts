import { Routes } from '@angular/router';
import {
  PaymentBatchImportListComponent
} from "./components/payment-batch-import-list/payment-batch-import-list.component";

export const routes: Routes = [
  { path: '', redirectTo: 'payment-batch-imports', pathMatch: 'full' },
  { path: 'payment-batch-imports', component: PaymentBatchImportListComponent },
];
