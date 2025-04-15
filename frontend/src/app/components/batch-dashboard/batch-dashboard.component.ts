import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatchSsinComponent} from "./match-ssin/match-ssin.component";
import {MatchPaymentPlanComponent} from "./match-plan/match-plan.component";
import {MatchAmountComponent} from "./match-amount/match-amount.component";
import {Subject, takeUntil} from "rxjs";
import {PaymentBatchService} from "../../services/payment-batch.service";
import {FlexibleNumberPipe} from "../../pipes/flexible-number.pipe";
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-batch-dashboard',
  imports: [
    MatchSsinComponent,
    MatchPaymentPlanComponent,
    MatchAmountComponent,
    FlexibleNumberPipe,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgIf,
    NgForOf
  ],
  templateUrl: './batch-dashboard.component.html',
  styleUrl: './batch-dashboard.component.css'
})
export class BatchDashboardComponent implements OnInit, OnDestroy {
  batchId: number;
  batchPayment: any;
  private $destroy$: Subject<void> = new Subject<void>();
  protected allBatchPayments: any;
  selectedBatchId: number | null = null;

  constructor(private route: ActivatedRoute, private batchService: PaymentBatchService) {
    this.batchId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.batchId)) {
      throw new Error('Batch ID invalide');
    }
  }

  ngOnInit(): void {
    this.batchService.getBatchPayment(this.batchId).pipe(takeUntil(this.$destroy$)).subscribe(batchPayment => {
      this.batchPayment = batchPayment;
    });

    this.batchService.getAllBatchPayment().pipe(takeUntil(this.$destroy$)).subscribe(batchPayments => {
      console.log('ngOnInit allBatchPayments',batchPayments);
      this.allBatchPayments = batchPayments;
    });
  }

  ngOnDestroy(): void {
    this.$destroy$.next();
    this.$destroy$.complete();
  }

  onChangeBatchCompare(value: number) {
    this.selectedBatchId = value;
  }
}
