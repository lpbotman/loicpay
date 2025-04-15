import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData} from "chart.js";
import {Subject, takeUntil} from "rxjs";
import {ReportingBatchService} from "../../../services/reporting-batch.service";
import { NgIf} from "@angular/common";
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
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-match-plan',
  imports: [
    BaseChartDirective,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    FlexibleNumberPipe,
    NgIf,
    MatProgressSpinner
  ],
  templateUrl: './match-plan.component.html',
  styleUrl: './match-plan.component.css'
})
export class MatchPaymentPlanComponent implements OnInit, OnDestroy, OnChanges{

  @Input() batchId!: number;
  @Input() compareBatchId?: number | null;
  @Input() source: 'payment' | 'recovery' = 'payment';

  displayedColumns: string[] = ['desc', 'value'];
  dataSource: { desc: string, value: number, percent?: number, compareValue?: number | null, comparePercent?: number | null }[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [],
  };
  pieChartType: 'pie' = 'pie';

  isLoaded = false;

  private destroy$ = new Subject<void>();

  constructor(private reportingService: ReportingBatchService) {}

  ngOnInit(): void {
    this.refreshData();

  }

  private async refreshData() {
    const response: any = await this.loadData(this.batchId);
    const responseCompare: any = this.compareBatchId ? await this.loadData(this.compareBatchId) : null;

    const matchMfxPercent: number = response.allMatch / response.mfxCount * 100;
    const matchMfxPercentCompare: number | null = this.compareBatchId ? (responseCompare.allMatch / responseCompare.mfxCount * 100) : null;

    const planTypeLabel = this.source === 'payment' ? 'paiement' : 'récupération';

    this.dataSource = [
      {desc: 'Nombre de plans de '+planTypeLabel+' dans LOIC', value: response.loicCount, compareValue: responseCompare ? responseCompare.loicCount : null},
      {desc: 'Nombre de plans de '+planTypeLabel+' dans MFX', value: response.mfxCount, compareValue: responseCompare ? responseCompare.mfxCount : null},
      {desc: 'Correspondance des plans de '+planTypeLabel, value: response.allMatch, percent: matchMfxPercent,
        compareValue: responseCompare ? responseCompare.allMatch : null,
        comparePercent: responseCompare ? matchMfxPercentCompare : null},
    ]
    this.pieChartData = {
      labels: ['Ok', 'Diff.'],
      datasets: [
        {
          data: [matchMfxPercent, 100-matchMfxPercent],
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        },
      ],
    };
    this.chart?.update();
    this.isLoaded = true;
  }

  private loadData(batchId: number) {
    return new Promise((resolve, reject) => {
      let request$;

      if (this.source === 'payment') {
        request$ = this.reportingService.getPaymentMatchPaymentPlan(batchId);
      } else if (this.source === 'recovery') {
        request$ = this.reportingService.getRecoveryMatchPaymentPlan(batchId);
      } else {
        reject(new Error(`Unknown Source: ${this.source}`));
        return;
      }

      request$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => resolve(response),
          error: (err) => reject(err)
        });
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['compareBatchId']) {
      if(this.compareBatchId === null) {
        this.displayedColumns = ['desc', 'value'];
      } else {
        this.displayedColumns = ['desc', 'value', 'compareValue'];
        this.refreshData();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
