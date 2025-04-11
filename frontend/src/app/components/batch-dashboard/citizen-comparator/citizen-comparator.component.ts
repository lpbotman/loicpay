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
  ],
  standalone: true,
  templateUrl: './citizen-comparator.component.html',
  styleUrl: './citizen-comparator.component.css'
})
export class CitizenComparatorComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];

  data = [
    { value: 123, labels: ['Important'] },
    { value: 456, labels: [] },
  ];

  batchId: string | null = '';
  filter: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('batchId');
    this.filter = this.route.snapshot.paramMap.get('filter');
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

}
