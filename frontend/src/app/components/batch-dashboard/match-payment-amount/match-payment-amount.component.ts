import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData} from "chart.js";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {ReportingBatchService} from "../../../services/reporting-batch.service";
import {DecimalPipe} from "@angular/common";
import {FlexibleNumberPipe} from "../../../pipes/flexible-number.pipe";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";

@Component({
  selector: 'app-match-payment-amount',
  imports: [
    BaseChartDirective,
    DecimalPipe,
    FlexibleNumberPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef
  ],
  templateUrl: './match-payment-amount.component.html',
  styleUrl: './match-payment-amount.component.css'
})
export class MatchPaymentAmountComponent implements OnInit, OnDestroy{

  @Input() batchId!: number;

  displayedColumns: string[] = ['desc', 'gross', 'net'];
  dataSource: { desc: string, gross: number, net: number }[] = [];

  public barChartLabels = [']0,0.05]', ']0.05,1]', ']1,10]', ']10,100]', '+100'];// Catégories
  public barChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartData: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(private reportingService: ReportingBatchService) {}

  ngOnInit(): void {
    this.initAmountDiff();

      /*
      datasets: [
        {
          data: [matchMfxPercent, 100-matchMfxPercent],
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        },
      ],*/

    //this.chart?.update();
  }

  public barChartOptions = {
    responsive: true,
    indexAxis: 'y',
    maintainAspectRatio: false,
  };

  private initAmountDiff() {
    return forkJoin<number[]>([
      this.reportingService.getMatchPaymentAmount(this.batchId,'gross', 0,0),
      this.reportingService.getMatchPaymentAmount(this.batchId,'gross', 0.01, 0.05),
      this.reportingService.getMatchPaymentAmount(this.batchId,'gross', 0.06, 1),
      this.reportingService.getMatchPaymentAmount(this.batchId,'gross', 1.01, 10),
      this.reportingService.getMatchPaymentAmount(this.batchId,'gross', 10.01, 100),
      this.reportingService.getMatchPaymentAmount(this.batchId,'gross', 100.01, 9999),
      this.reportingService.getMatchPaymentAmount(this.batchId,'net', 0,0),
      this.reportingService.getMatchPaymentAmount(this.batchId,'net', 0.01, 0.05),
      this.reportingService.getMatchPaymentAmount(this.batchId,'net', 0.06, 1),
      this.reportingService.getMatchPaymentAmount(this.batchId,'net', 1.01, 10),
      this.reportingService.getMatchPaymentAmount(this.batchId,'net', 10.01, 100),
      this.reportingService.getMatchPaymentAmount(this.batchId,'net', 100.01, 9999),
    ]).subscribe((result: number[]) =>{
      console.log(result);
      this.dataSource = [
        {desc: 'Montants identiques', gross: result[0], net: result[6]},
        {desc: 'Différence de 0,05', gross: result[1], net: result[7]},
        {desc: 'Différence entre 0,05 et 1', gross: result[1], net: result[8]},
        {desc: 'Différence entre 1 et 10', gross: result[2], net: result[9]},
        {desc: 'Différence entre 10 et 100', gross: result[3], net: result[10]},
        {desc: 'Différence +100', gross: result[4], net: result[11]},
      ]

      this.barChartData = [
        {
          label: 'Gross', // Barre pour les montants bruts
          data: [result[1],result[2],result[3],result[4],result[5]],
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Couleur de la barre brute
          borderColor: 'rgba(255, 99, 132, 1)', // Bordure de la barre brute
          borderWidth: 1,
        },
        {
          label: 'Net', // Barre pour les montants nets
          data: [result[7],result[8],result[9],result[10],result[11]],
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Couleur de la barre nette
          borderColor: 'rgba(54, 162, 235, 1)', // Bordure de la barre nette
          borderWidth: 1,
        }
      ];
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

