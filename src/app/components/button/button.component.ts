import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-auto transition-colors"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Output() onClick = new EventEmitter<void>();
  
}
