import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData} from "chart.js";
import {Subject, takeUntil} from "rxjs";
import {ReportingBatchService} from "../../../services/reporting-batch.service";
import {DecimalPipe, NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {FlexibleNumberPipe} from "../../../pipes/flexible-number.pipe";

@Component({
  selector: 'app-match-payment-plan',
  imports: [
    BaseChartDirective,
    DecimalPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
    MatHeaderCellDef,
    FlexibleNumberPipe
  ],
  templateUrl: './match-payment-plan.component.html',
  styleUrl: './match-payment-plan.component.css'
})
export class MatchPaymentPlanComponent implements OnInit, OnDestroy{

  @Input() batchId!: number;

  displayedColumns: string[] = ['desc', 'value'];
  dataSource: { desc: string, value: number, percent?: number }[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [],
  };
  pieChartType: 'pie' = 'pie';
  private destroy$ = new Subject<void>();

  constructor(private reportingService: ReportingBatchService) {}

  ngOnInit(): void {
    this.reportingService.getMatchPaymentPlan(this.batchId).pipe(takeUntil(this.destroy$)).subscribe((response) => {

      const matchMfxPercent: number = response.allMatch / response.mfxCount * 100;

      this.dataSource = [
        {desc: 'Nombre de plans de paiement dans LOIC', value: response.loicCount},
        {desc: 'Nombre de plans de paiement dans MFX', value: response.mfxCount},
        {desc: 'Correspondance des plans de paiement', value: response.allMatch, percent: matchMfxPercent},
      ]
      this.pieChartData = {
        labels: ['Correspondance', 'Différence'],
        datasets: [
          {
            data: [matchMfxPercent, 100-matchMfxPercent],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
          },
        ],
      };
      this.chart?.update();
    });
  }

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
