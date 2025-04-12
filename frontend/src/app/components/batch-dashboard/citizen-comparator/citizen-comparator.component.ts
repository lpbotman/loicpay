import {Component, OnInit} from '@angular/core';
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
  MatChip, MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {NgForOf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ReportingBatchService} from "../../../services/reporting-batch.service";
import {Subject, takeUntil} from "rxjs";
import {CitizenReporting} from "../../../dtos/CitizenReporting.dto";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-citizen-comparator',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatChip,
    MatChipInput,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatIcon,
    NgForOf,
    MatChipGrid,
    MatRowDef,
    MatPaginator,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './citizen-comparator.component.html',
  styleUrl: './citizen-comparator.component.css'
})
export class CitizenComparatorComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];

  batchId: string | null = '';
  filter: string | null = '';

  citizens: CitizenReporting[] = [];

  displayedColumns: string[] = [];
  dynamicDisplayedColumns: string[] = [];
  pageIndex: number = 0;
  pageSize: number = 50;
  pageTotal: number = 0;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private reportingService: ReportingBatchService) { }

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
        this.displayedColumns = ['ssin', 'refMonth','label'];
      } else {
        this.displayedColumns = ['ssin', 'refMonth', ...this.citizens[0].data.map(d => d.key), 'label'];
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
    if (value && !row.labels.includes(value)) {
      row.labels.push(value);
    }
    event.chipInput!.clear();
  }

  removeLabel(row: any, label: string): void {
    const index = row.labels.indexOf(label);
    if (index >= 0) {
      row.labels.splice(index, 1);
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }
}
