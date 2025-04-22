import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-category-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatDialogActions,
    MatButton,
    FormsModule
  ],
  templateUrl: './add-category-dialog.component.html',
  styleUrl: './add-category-dialog.component.css'
})
export class AddCategoryDialogComponent {
  categoryName = '';

  constructor(private dialogRef: MatDialogRef<AddCategoryDialogComponent>) {}

  save() {
    if (this.categoryName.trim()) {
      this.dialogRef.close(this.categoryName.trim());
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
