import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ReportingBatchService} from "../../../services/reporting-batch.service";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {FlexibleNumberPipe} from "../../../pipes/flexible-number.pipe";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-match-ssin',
  imports: [
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatTable,
    BaseChartDirective,
    FlexibleNumberPipe,
    RouterLink,
    NgIf,
    MatProgressSpinner
  ],
  templateUrl: './match-ssin.component.html',
  styleUrl: './match-ssin.component.css'
})
export class MatchSsinComponent implements OnInit, OnDestroy, OnChanges{

  @Input() batchId!: number;
  @Input() compareBatchId?: number | null;
  @Input() source: 'payment' | 'recovery' = 'payment';

  displayedColumns: string[] = ['desc', 'value'];
  dataSource: { desc: string, value: number, compareValue?: number | null, percent?: number, comparePercent?: number | null, filter?: string}[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [],
  };
  pieChartType: 'pie' = 'pie';

  isloaded = false;

  private destroy$ = new Subject<void>();

  constructor(private reportingService: ReportingBatchService) {}

  ngOnInit(): void{
    this.prepareData();
  }

  private async prepareData() {
    try {
      const response: any = await this.loadData(this.batchId);
      const responseCompare: any = this.compareBatchId ? await this.loadData(this.compareBatchId) : null;


      const excludeMFXPercent: number = (response.mfxCount - response.mfxExclu) / response.mfxCount * 100;
      const compareExcludeMFXPercent: number | null = responseCompare ? (response.mfxCount - response.mfxExclu) / response.mfxCount * 100 : null;

      this.dataSource = [
        {desc: 'Nombre de citoyens distincts dans LOIC', value: response.loicCount, compareValue: responseCompare?.loicCount},
        {desc: 'Nombre de citoyens distincts dans MFX', value: response.mfxCount, compareValue: responseCompare?.mfxCount},
        {desc: 'Nombre de citoyens exclusifs LOIC', value: response.loicExclu, percent: response.loicExclu / response.loicCount * 100,
          compareValue: responseCompare ? responseCompare.loicExclu : null,
          comparePercent: responseCompare ? (responseCompare.loicExclu / responseCompare.loicCount * 100) : null,filter: this.source+'-exclu-loic' },
        {desc: 'Nombre de citoyens exclusifs MFX', value: response.mfxExclu, percent: response.mfxExclu / response.mfxCount * 100,
          compareValue: responseCompare?.mfxExclu,
          comparePercent: responseCompare ? (responseCompare.mfxExclu / responseCompare.mfxCount * 100) : null},
        {desc: 'Correspondance entre LOIC et MFX', value: response.mfxCount - response.mfxExclu, percent: excludeMFXPercent,
          compareValue: responseCompare ? (responseCompare.mfxCount - responseCompare.mfxExclu) : null,
          comparePercent: compareExcludeMFXPercent},
      ]

      console.log('ngOnInit dataSource', this.dataSource);
      this.pieChartData = {
        labels: ['Ok', 'Diff.'],
        datasets: [
          {
            data: [excludeMFXPercent, 100-excludeMFXPercent],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
          },
        ],
      };
      this.chart?.update();
      this.isloaded = true;
      console.log('ngOnInit isloaded', this.displayedColumns);
    } catch (error) {
      console.error('Error loading data', error);
    }
  }

  private loadData(batchId: number) {
    return new Promise((resolve, reject) => {
      let request$;

      if (this.source === 'payment') {
        request$ = this.reportingService.getPaymentMatchSSIN(batchId);
      } else if (this.source === 'recovery') {
        request$ = this.reportingService.getRecoveryMatchSSIN(batchId);
      } else {
        reject(new Error(`Source inconnue: ${this.source}`));
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
        this.prepareData();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

