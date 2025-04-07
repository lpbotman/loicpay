import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ReportingBatchService} from "../../services/reporting-batch.service";
import {MatchSsinComponent} from "./match-ssin/match-ssin.component";
import {MatchPaymentPlanComponent} from "./match-payment-plan/match-payment-plan.component";
import {MatchPaymentAmountComponent} from "./match-payment-amount/match-payment-amount.component";

@Component({
  selector: 'app-batch-dashboard',
  imports: [
    MatchSsinComponent,
    MatchPaymentPlanComponent,
    MatchPaymentAmountComponent
  ],
  templateUrl: './batch-dashboard.component.html',
  styleUrl: './batch-dashboard.component.css'
})
export class BatchDashboardComponent {
  batchId: number;

  constructor(private route: ActivatedRoute, private reportingService: ReportingBatchService) {
    this.batchId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.batchId)) {
      throw new Error('Batch ID invalide');
    }
  }


}
