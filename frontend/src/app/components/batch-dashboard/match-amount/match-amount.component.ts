import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {firstValueFrom, forkJoin, Subject, takeUntil} from "rxjs";
import {ReportingBatchService} from "../../../services/reporting-batch.service";
import {DecimalPipe, NgIf} from "@angular/common";
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
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-match-amount',
  imports: [
    BaseChartDirective,
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
    MatHeaderCellDef,
    MatProgressSpinner,
    NgIf,
    RouterLink
  ],
  templateUrl: './match-amount.component.html',
  styleUrl: './match-amount.component.css'
})
export class MatchAmountComponent implements OnInit, OnDestroy, OnChanges{

  @Input() batchId!: number;
  @Input() compareBatchId?: number | null;
  @Input() source: 'payment' | 'recovery' = 'payment';

  displayedColumns: string[] = ['desc', 'gross', 'net'];
  dataSource: { desc: string, gross: number, net: number, compareGross?: number | null, compareNet?: number | null, filter?: string,  params?: { [key: string]: any } }[] = [];

  public barChartLabels = [']0,0.05]', ']0.05,1]', ']1,10]', ']10,100]', '+100'];// Catégories
  public barChartLegend = true;
  public barChartData: any[] = [];

  isLoaded = false;

  private destroy$ = new Subject<void>();

  constructor(private reportingService: ReportingBatchService) {}

  ngOnInit(): void {
    this.prepareData();
  }

  public barChartOptions = {
    responsive: true,
    indexAxis: 'y',
    maintainAspectRatio: false,
  };

  private async prepareData() {
    const result: any = await this.initAmountDiff(this.batchId);
    const resultCompare: any = this.compareBatchId ? await this.initAmountDiff(this.compareBatchId) : null;

    this.dataSource = [
      {desc: 'Montants identiques', gross: result[0], net: result[6],
        compareGross: resultCompare ? resultCompare[0] : null, compareNet: resultCompare ? resultCompare[6] : null},
      {desc: 'Différence de 0,05', gross: result[1], net: result[7],
        compareGross: resultCompare ? resultCompare[1] : null, compareNet: resultCompare ? resultCompare[7] : null,
        filter: this.source+'-amount-diff', params: {intervalLow: 0.01, intervalHigh: 0.05}},
      {desc: 'Différence entre 0,05 et 1', gross: result[2], net: result[8],
        compareGross: resultCompare ? resultCompare[2] : null, compareNet: resultCompare ? resultCompare[8] : null,
        filter: this.source+'-amount-diff', params: {intervalLow: 0.06, intervalHigh: 1}},
      {desc: 'Différence entre 1 et 10', gross: result[3], net: result[9],
        compareGross: resultCompare ? resultCompare[3] : null, compareNet: resultCompare ? resultCompare[9] : null,
        filter: this.source+'-amount-diff', params: {intervalLow: 1.01, intervalHigh: 10}},
      {desc: 'Différence entre 10 et 100', gross: result[4], net: result[10],
        compareGross: resultCompare ? resultCompare[4] : null, compareNet: resultCompare ? resultCompare[10] : null,
        filter: this.source+'-amount-diff', params: {intervalLow: 10.01, intervalHigh: 100}},
      {desc: 'Différence +100', gross: result[5], net: result[11],
        compareGross: resultCompare ? resultCompare[5] : null, compareNet: resultCompare ? resultCompare[11] : null,
        filter: this.source+'-amount-diff', params: {intervalLow: 100.01, intervalHigh: 9999}},
    ]

    this.barChartData = [
      {
        label: 'Brut', // Barre pour les montants bruts
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

    this.isLoaded = true;
  }

  private initAmountDiff(batchId: number): Promise<number[]> {
    const matchAmountService = this.source === 'payment'
      ? this.reportingService.getMatchPaymentAmount.bind(this.reportingService)
      : this.reportingService.getMatchRecoveryAmount.bind(this.reportingService);

    return firstValueFrom(
      forkJoin<number[]>([
        matchAmountService(batchId, 'gross', 0, 0),
        matchAmountService(batchId, 'gross', 0.01, 0.05),
        matchAmountService(batchId, 'gross', 0.06, 1),
        matchAmountService(batchId, 'gross', 1.01, 10),
        matchAmountService(batchId, 'gross', 10.01, 100),
        matchAmountService(batchId, 'gross', 100.01, 9999),
        matchAmountService(batchId, 'net', 0, 0),
        matchAmountService(batchId, 'net', 0.01, 0.05),
        matchAmountService(batchId, 'net', 0.06, 1),
        matchAmountService(batchId, 'net', 1.01, 10),
        matchAmountService(batchId, 'net', 10.01, 100),
        matchAmountService(batchId, 'net', 100.01, 9999),
      ])
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['compareBatchId']) {
      if(this.compareBatchId === null) {
        this.displayedColumns = ['desc', 'gross', 'net'];
      } else {
        this.displayedColumns = ['desc', 'gross', 'net', 'compareGross', 'compareNet'];
        this.prepareData();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

