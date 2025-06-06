import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="card mb-6 bg-white shadow-md rounded-lg">
      <div class="p-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i-lucide name="search" class="h-5 w-5 text-gray-500"></i-lucide>
          </div>
          <input
            type="text"
            class="form-input pl-10 w-full border rounded px-3 py-2
               placeholder-gray-400 placeholder:text-sm placeholder:italic 
               hover:border-blue-500 focus:outline-none focus:ring-2 
               focus:ring-blue-500 focus:border-transparent"
            [placeholder]="placeholder"
            [(ngModel)]="searchTerm"
            (input)="onSearchInput($event)"
            (ngModelChange)="handleSearch($event)"
          />
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input() placeholder = 'Buscar '; 
  @Output() searchChange = new EventEmitter<string>();
  searchTerm = '';

  handleSearch(term: string) {
    console.log('Busca:', term);
  }

  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchChange.emit(inputElement.value);
  }
}
