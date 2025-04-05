import {Component, EventEmitter, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-file-upload-picker',
    imports: [
        MatIcon
    ],
  templateUrl: './file-upload-picker.component.html',
  styleUrl: './file-upload-picker.component.css'
})
export class FileUploadPickerComponent {
  file: File | null = null;

  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileSelected.emit(this.file);
    }
  }
}
