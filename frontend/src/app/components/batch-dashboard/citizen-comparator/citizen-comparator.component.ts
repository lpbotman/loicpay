import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {
  MatChip, MatChipGrid, MatChipInput,
  MatChipInputEvent,
} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ReportingBatchService} from "../../../services/reporting-batch.service";
import {debounceTime, Subject, switchMap, takeUntil} from "rxjs";
import {CitizenReporting} from "../../../dtos/CitizenReporting.dto";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {ReportingPaginatedRequest} from "../../../dtos/ReportingPaginatedRequest.dto";
import {filterTocriteria} from "../../../utils/params";

@Component({
  selector: 'app-citizen-comparator',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatIcon,
    NgForOf,
    MatRowDef,
    MatPaginator,
    TranslatePipe,
    MatIconButton,
    NgIf,
    MatChip,
    MatChipInput,
    MatChipGrid,
    MatSlideToggle,
    FormsModule,
    MatButton,
  ],
  standalone: true,
  templateUrl: './citizen-comparator.component.html',
  styleUrl: './citizen-comparator.component.css'
})
export class CitizenComparatorComponent implements OnInit, OnDestroy {

  separatorKeysCodes: number[] = [ENTER, COMMA];

  batchId: string | null = '';
  filter?: string | null;
  params?: Map<string, any>;

  citizens: CitizenReporting[] = [];

  displayedColumns: string[] = [];
  dynamicDisplayedColumns: string[] = [];
  pageIndex: number = 0;
  pageSize: number = 50;
  pageTotal: number = 0;
  includeIgnored: boolean = false;

  private rowSubjects: Map<string, Subject<{ ssin: string, refMonth: number, labels: string | null, isIgnored: boolean }>> = new Map();


  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private reportingService: ReportingBatchService) {
  }

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('batchId');
    this.filter = this.route.snapshot.paramMap.get('filter');
    const queryParams = this.route.snapshot.queryParams;
    console.log('filter', this.filter);
    this.params = new Map<string, any>(Object.entries({
      ...queryParams,
      batchId: this.batchId
    }));

    if(!this.filter)
      throw new Error('No filter specified');

    this.loadData();
  }

  loadData() {
    if(!this.filter)
      throw new Error('No filter specified');

    let params = new Map<string, any>();
    params.set('batchId', this.batchId ? Number(this.batchId) : null);
    let criteria:string = filterTocriteria.find(f => f.filter === this.filter)!.criteria;

    console.log('params', params);

    let reportingPaginatedRequest = new ReportingPaginatedRequest(this.params, this.pageIndex, this.pageSize, criteria, this.includeIgnored);

    this.reportingService.getCitizensByCriteria(reportingPaginatedRequest).pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.citizens = result.results;
      this.pageTotal = result.total;
      if (this.citizens.length === 0) {
        this.displayedColumns = ['ssin', 'refMonth','labels', 'ignored'];
      } else {
        this.displayedColumns = ['ssin', 'refMonth', ...this.citizens[0].data.map(d => d.key), 'labels', 'ignored'];
        this.dynamicDisplayedColumns = this.citizens[0].data.map(d => d.key);
      }
    });
  }

  getDataValue(row: CitizenReporting, column: string): any {
    const found = row.data.find(d => d.key === column);
    return found ? found.value : null;
  }

  addLabel(event: MatChipInputEvent, row: any) {
    const value = (event.value || '').trim();
    console.log('addLabel', value, row);
    row.isLabelEditable = false;
    row.labels = value;
    this.updateRow(row);
    event.chipInput!.clear();
  }

  removeLabel(row: any): void {
    row.labels = null;
    this.updateRow(row);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  toggleIgnored(row: CitizenReporting, isIgnored: boolean) {
    row.isIgnored = isIgnored;
    this.updateRow(row);
  }

  updateRow(row: CitizenReporting) {
    console.log('updateRow', row);
    const key = `${row.ssin}-${row.refMonth}`;

    if (!this.rowSubjects.has(key)) {
      const subject = new Subject<{ ssin: string, refMonth: number, labels: string | null, isIgnored: boolean }>();
      this.rowSubjects.set(key, subject);

      subject.pipe(
        debounceTime(300),
        switchMap(data =>
          this.reportingService.updateCitizenReporting(data.ssin, data.refMonth, data.labels ?? null, data.isIgnored)
        )
      ).subscribe();
    }

    this.rowSubjects.get(key)!.next({
      ssin: row.ssin,
      refMonth: row.refMonth,
      labels: row.labels ?? null,
      isIgnored: row.isIgnored
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.rowSubjects.forEach(subject => subject.complete());
    this.rowSubjects.clear();
  }

  toggleIncludeIgnored(checked: boolean) {
    this.includeIgnored = !checked;
    this.loadData();
  }

  exportToCsv() {
    this.reportingService.exportCsv(this.filter!, this.batchId ? Number(this.batchId) : null).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'citizen-'+ this.filter+'.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
