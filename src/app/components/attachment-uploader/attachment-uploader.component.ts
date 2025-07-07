import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export interface AttachmentFile {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-attachment-uploader',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './attachment-uploader.component.html',
  styleUrls: ['./attachment-uploader.component.css']
})
export class AttachmentUploaderComponent {
  
  @Output() filesChanged = new EventEmitter<AttachmentFile[]>();
  
  attachments: AttachmentFile[] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.attachments.push({ file: file, previewUrl: e.target.result });
          this.emitFiles();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
    this.emitFiles();
  }

  private emitFiles(): void {
    this.filesChanged.emit(this.attachments);
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }
}