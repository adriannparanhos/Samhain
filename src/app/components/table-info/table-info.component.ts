import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export interface TableColumn<T> {
  header: string;
  field: keyof T;
  type?: 'text' | 'currency' | 'date' | 'number';
  width?: string;
}

@Component({
  selector: 'app-table-info',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="card bg-white rounded-lg shadow-sm p-4">
      <div *ngIf="isLoading" class="p-4 text-center text-gray-500">Carregando…</div>
      <div *ngIf="!isLoading" class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th *ngFor="let col of columns"
                  [style.width]="col.width"
                  class="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                {{ col.header }}
              </th>
              <th class="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data; let last = last"
                [class.border-b]="!last"
                class="border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
              <td *ngFor="let col of columns; let lastCol = last"
                  class="p-3 border-r border-gray-100"
                  [class.border-r-0]="lastCol">
                <ng-container [ngSwitch]="col.field">
                  <span *ngSwitchCase="'status'"
                        class="inline-block px-2 py-1 rounded-md text-white transition duration-150 ease-in-out"
                        [ngClass]="getStatusClasses(getValue(row, col.field))">
                    {{ getValue(row, col.field) }}
                  </span>
                  <span *ngSwitchCase="'currency'" class="block">
                    {{ getNumberValue(row, col.field) | currency:'BRL':'symbol':'1.2-2' }}
                  </span>
                  <span *ngSwitchCase="'date'" class="block">
                    {{ getValue(row, col.field) | date:'dd/MM/yyyy' }}
                  </span>
                  <span *ngSwitchDefault class="block">
                    {{ getValue(row, col.field) }}
                  </span>
                </ng-container>
              </td>
              <td class="p-3">
                <div class="flex space-x-2">
                  <button (click)="edit.emit(row)"
                          class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-gray-100 transition"
                          title="Visualizar">
                    <lucide-icon [name]="'eye'" class="w-5 h-5"></lucide-icon>
                  </button>
                  <button (click)="edit.emit(row)"
                          class="text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-gray-100 transition"
                          title="Editar">
                    <lucide-icon [name]="'pencil'" class="w-5 h-5"></lucide-icon>
                  </button>
                  <button (click)="delete.emit(row)"
                          class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-gray-100 transition"
                          title="Excluir">
                    <lucide-icon [name]="'trash-2'" class="w-5 h-5"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="data.length === 0">
              <td [attr.colspan]="columns.length + 1"
                  class="text-center py-8 text-gray-500">Sem registros.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./table-info.component.css']
})
export class TableInfoComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data:     T[]             = [];
  @Input() isLoading: boolean        = false;

  @Output() edit   = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  getValue(item: T, field: keyof T): any {
    return item[field];
  }

  getNumberValue(item: T, field: keyof T): number {
    const value = item[field];
    return typeof value === 'number' ? value : 0;
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-400 text-green-600 hover:bg-green-300 rounded-full px-3 py-0.5 font-medium';
      case 'Pendente':
        return 'bg-yellow-400 text-yellow-600 hover:bg-yellow-300 rounded-full px-3 py-0.5 font-medium';
      case 'Cancelado':
        return 'bg-red-400 text-red-600 hover:bg-red-300 rounded-full px-3 py-0.5 font-medium';
      default:
        return 'bg-gray-400 text-gray-600 hover:bg-gray-300 rounded-full px-3 py-0.5 font-medium';
    }
  }
}