import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ReportingBatchService} from "../../services/reporting-batch.service";
import {MatchSsinComponent} from "./match-ssin/match-ssin.component";
import {MatchPaymentPlanComponent} from "./match-payment-plan/match-payment-plan.component";
import {MatchPaymentAmountComponent} from "./match-payment-amount/match-payment-amount.component";
import {Subject, takeUntil} from "rxjs";
import {PaymentBatchService} from "../../services/payment-batch.service";
import {FlexibleNumberPipe} from "../../pipes/flexible-number.pipe";

interface onDestroy {
}

@Component({
  selector: 'app-batch-dashboard',
  imports: [
    MatchSsinComponent,
    MatchPaymentPlanComponent,
    MatchPaymentAmountComponent,
    FlexibleNumberPipe
  ],
  templateUrl: './batch-dashboard.component.html',
  styleUrl: './batch-dashboard.component.css'
})
export class BatchDashboardComponent implements OnInit, OnDestroy {
  batchId: number;
  batchPayment: any;
  private $destroy$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private reportingService: ReportingBatchService, private batchService: PaymentBatchService) {
    this.batchId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.batchId)) {
      throw new Error('Batch ID invalide');
    }
  }

  ngOnInit(): void {
    this.batchService.getBatchPayment(this.batchId).pipe(takeUntil(this.$destroy$)).subscribe(batchPayment => {
      this.batchPayment = batchPayment;
    });
  }

  ngOnDestroy(): void {
    this.$destroy$.next();
    this.$destroy$.complete();
  }


}
