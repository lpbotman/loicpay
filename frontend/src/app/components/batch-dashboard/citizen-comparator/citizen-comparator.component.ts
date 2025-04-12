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
  MatChipInputEvent, MatChipOption, MatChipSet,
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
import {MatIconButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import * as console from "node:console";

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
  ],
  standalone: true,
  templateUrl: './citizen-comparator.component.html',
  styleUrl: './citizen-comparator.component.css'
})
export class CitizenComparatorComponent implements OnInit, OnDestroy {

  separatorKeysCodes: number[] = [ENTER, COMMA];

  batchId: string | null = '';
  filter: string | null = '';

  citizens: CitizenReporting[] = [];

  displayedColumns: string[] = [];
  dynamicDisplayedColumns: string[] = [];
  pageIndex: number = 0;
  pageSize: number = 50;
  pageTotal: number = 0;

  private toggleIgnoredSubjects: Map<string, Subject<{ ssin: string, refMonth: number, isIgnored: boolean }>> = new Map();


  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private reportingService: ReportingBatchService) {
  }

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('batchId');
    this.filter = this.route.snapshot.paramMap.get('filter');

    if(!this.filter)
      throw new Error('No filter specified');

    this.loadData();
  }

  loadData() {
    if(!this.filter)
      throw new Error('No filter specified');

    this.reportingService.getCitizensByCriteria(this.batchId ? Number(this.batchId) : null, this.filter, this.pageIndex, this.pageSize).pipe(takeUntil(this.destroy$)).subscribe(result => {
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
    row.label = value;
    event.chipInput!.clear();
  }

  removeLabel(row: any): void {
    row.label = null;
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  toggleIgnored(ssin: string, refMonth: number, isIgnored: boolean) {
    const key = `${ssin}-${refMonth}`;

    if (!this.toggleIgnoredSubjects.has(key)) {
      const subject = new Subject<{ ssin: string, refMonth: number, isIgnored: boolean }>();
      this.toggleIgnoredSubjects.set(key, subject);

      subject.pipe(
        debounceTime(300),
        switchMap(data =>
          this.reportingService.toggleIgnored(data.ssin, data.refMonth, data.isIgnored)
        )
      ).subscribe();
    }

    this.toggleIgnoredSubjects.get(key)!.next({ ssin, refMonth, isIgnored });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.toggleIgnoredSubjects.forEach(subject => subject.complete());
    this.toggleIgnoredSubjects.clear();
  }
}
