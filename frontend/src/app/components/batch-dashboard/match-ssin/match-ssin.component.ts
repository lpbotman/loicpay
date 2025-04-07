import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {DecimalPipe, NgIf} from "@angular/common";
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {BaseChartDirective} from "ng2-charts";

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
    DecimalPipe,
    NgIf,
    BaseChartDirective
  ],
  templateUrl: './match-ssin.component.html',
  styleUrl: './match-ssin.component.css'
})
export class MatchSsinComponent implements OnInit, OnDestroy{

  @Input() batchId!: number;

  displayedColumns: string[] = ['desc', 'percent', 'value'];
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
    this.reportingService.getMatchSSIN(this.batchId).pipe(takeUntil(this.destroy$)).subscribe((response) => {

      const excludeMFXPercent: number = (response.mfxCount - response.mfxExclu) / response.mfxCount * 100;

      this.dataSource = [
        {desc: 'Nombre de citoyens distincts dans LOIC', value: response.loicCount},
        {desc: 'Nombre de citoyens distincts dans MFX', value: response.mfxCount},
        {desc: 'Nombre de citoyens exclusifs LOIC', value: response.loicExclu, percent: response.loicExclu / response.loicCount * 100},
        {desc: 'Nombre de citoyens exclusifs MFX', value: response.mfxExclu, percent: response.mfxExclu / response.mfxCount * 100},
        {desc: 'Correspondance entre LOIC et MFX', value: response.mfxCount - response.mfxExclu, percent: excludeMFXPercent},
      ]
      this.pieChartData = {
        labels: ['Correspondance', 'Différence'],
        datasets: [
          {
            data: [excludeMFXPercent, 100-excludeMFXPercent],
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

