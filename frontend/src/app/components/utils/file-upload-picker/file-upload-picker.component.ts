import {Component, EventEmitter, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-file-upload-picker',
  imports: [
    MatIcon,
  ],
  standalone: true,
  templateUrl: './file-upload-picker.component.html',
  styleUrl: './file-upload-picker.component.css'
})
export class FileUploadPickerComponent {
  file: File | null = null;
  isFileSelected = false;
  fileUpload: string = "fileUpload" + Math.random().toString(36).substring(2, 15);

  @Output() fileSelected = new EventEmitter<File>();

  constructor() {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileSelected.emit(this.file);
      this.isFileSelected = true;
      console.log('File selected:', this.isFileSelected);
    }
  }
}
