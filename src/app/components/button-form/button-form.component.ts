import { Component, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-button-form',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './button-form.component.html',
  styleUrl: './button-form.component.css'
})
export class ButtonFormComponent {
  constructor(private location: Location) {}

  @Output() save = new EventEmitter<void>();


  onCancel() {
    this.location.back();
  }

  onSaveClick(): void {
    this.save.emit();
  }

}
